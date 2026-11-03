const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'units', 'cme_new', 'data.js');
let content = fs.readFileSync(filePath, 'utf8');

const trimmed = content
  .replace(/^\/\/.*$/m, '')
  .replace(/const cme_new_data\s*=\s*/, '')
  .replace(/;\s*export default cme_new_data;[\s\S]*$/, '');

const data = JSON.parse(trimmed);

const l11 = data.lessons.find(l => l.id === 'lesson_11');
if (!l11) throw new Error('Lesson 11 not found');

const srcA = {
  id: "cme_l11_source_a",
  letter: "A",
  title: "Source A: US Secretary of State Henry Kissinger on Step-by-Step Shuttle Diplomacy (January 1974)",
  src: "/units/cme_new/assets/henry_kissinger.jpg",
  image: "/units/cme_new/assets/henry_kissinger.jpg",
  source: "/units/cme_new/assets/henry_kissinger.jpg",
  caption: "Dr Henry Kissinger, US Secretary of State who pioneered 'Shuttle Diplomacy' between Cairo, Damascus, and Jerusalem following the 1973 Yom Kippur War.",
  desc: "Archival portrait of US Secretary of State Henry Kissinger.",
  provenance: "US Department of State Historical Office / Gerald R. Ford Presidential Library.",
  citation: "Foreign Relations of the United States, 1969–1976, Volume XXVI, Arab-Israeli Dispute.",
  hinge_question: "Why did Kissinger insist on an incremental, 'step-by-step' approach rather than attempting a comprehensive peace conference at Geneva?",
  source_context: "Following the October 1973 War and the Arab oil embargo, US Secretary of State Henry Kissinger flew thousands of miles between Middle Eastern capitals aboard his Boeing 707. Kissinger deliberately excluded the Soviet Union and avoided intractable core disputes like Jerusalem and Palestinian sovereignty, focusing instead on military disengagement agreements (Sinai I in 1974 and Sinai II in 1975). **Hinge Question:** Why did Kissinger insist on an incremental, 'step-by-step' approach rather than attempting a comprehensive peace conference at Geneva?",
  context: "Kissinger's shuttle diplomacy separated Egyptian and Israeli frontline armies along the Suez Canal.",
  question_badge: "Source Inference",
  question_type: "Source Inference",
  enquiry_question: "What can you infer from Source A about the American objectives in conducting 'Shuttle Diplomacy' after the 1973 Yom Kippur War?",
  model_answer: "Source A indicates that the United States sought to stabilize the Middle East through step-by-step military disengagement, aiming to avert renewed conflict, protect Western oil supplies, and systematically edge the Soviet Union out of regional diplomacy.",
  provenance_clues: {
    author: "US Department of State diplomatic photographers.",
    audience: "International diplomatic community and American public.",
    motive: "To project Kissinger as an indispensable, tireless mediator constructing peace in the Middle East.",
    hinge_question: "Why did Kissinger insist on an incremental, 'step-by-step' approach rather than attempting a comprehensive peace conference at Geneva?"
  },
  teacher_notes: {
    source_context: "Following the October 1973 War and the Arab oil embargo, US Secretary of State Henry Kissinger flew thousands of miles between Middle Eastern capitals aboard his Boeing 707. Kissinger deliberately excluded the Soviet Union and avoided intractable core disputes like Jerusalem and Palestinian sovereignty, focusing instead on military disengagement agreements (Sinai I in 1974 and Sinai II in 1975). **Hinge Question:** Why did Kissinger insist on an incremental, 'step-by-step' approach rather than attempting a comprehensive peace conference at Geneva?"
  }
};

const srcB = {
  id: "cme_l11_source_b",
  letter: "B",
  type: "written_speech",
  title: "Source B: President Anwar Sadat's Historic Address to the Israeli Knesset (20 November 1977)",
  author: "President Anwar Sadat (Arab Republic of Egypt)",
  date: "20 November 1977",
  text: "\"I have come to you today on firm ground, to build a new life, to establish peace. We all love this land, the land of God, Muslims, Christians, and Jews alike... You want to live with us in this part of the world in peace, and I say to you in all sincerity that we welcome you among us with all security and safety. We used to reject you, having our reasons and claims, but today we say to you that we agree to live with you in permanent peace and justice... Yet there can be no peace if you insist on retaining Arab territory occupied in 1967, nor without a just solution for the Palestinian people.\"",
  caption: "Extract from President Anwar Sadat's speech delivered before the Israeli Knesset in Jerusalem on 20 November 1977.",
  provenance: "Official Knesset Records, Jerusalem / Ministry of Foreign Affairs, Cairo.",
  citation: "Records of the Israeli Knesset, Third Session, Jerusalem.",
  hinge_question: "Why did Sadat's unilateral visit to Jerusalem shatter thirty years of psychological taboo between Israel and the Arab states?",
  source_context: "On 19–21 November 1977, Egyptian President Anwar Sadat made an unprecedented, dramatic state visit to Jerusalem, becoming the first Arab leader to travel to Israel. Speaking directly to Israeli lawmakers in the Knesset, Sadat offered full diplomatic recognition and peace in exchange for complete Israeli withdrawal from the Sinai and justice for Palestinians. **Hinge Question:** Why did Sadat's unilateral visit to Jerusalem shatter thirty years of psychological taboo between Israel and the Arab states?",
  context: "Sadat’s address to the Knesset broke thirty years of diplomatic paralysis, proving Egypt was willing to negotiate a separate peace.",
  question_badge: "Author’s Purpose",
  question_type: "Author’s Purpose",
  enquiry_question: "What does Source B demonstrate about Sadat’s political purpose in addressing the Israeli Knesset in Jerusalem?",
  model_answer: "Source B demonstrates that Sadat sought to break the psychological barrier of hatred by directly reassuring the Israeli public that Egypt accepted Israel's right to exist in peace, while firmly linking lasting peace to the return of Arab lands seized in 1967.",
  provenance_clues: {
    author: "Egyptian President Anwar Sadat.",
    audience: "Members of the Israeli Knesset, the Israeli public, and the worldwide television audience.",
    motive: "To demonstrate moral courage, break diplomatic deadlock, and force Israeli leaders to reciprocate with territorial concessions in Sinai.",
    hinge_question: "Why did Sadat's unilateral visit to Jerusalem shatter thirty years of psychological taboo between Israel and the Arab states?"
  },
  teacher_notes: {
    source_context: "On 19–21 November 1977, Egyptian President Anwar Sadat made an unprecedented, dramatic state visit to Jerusalem, becoming the first Arab leader to travel to Israel. Speaking directly to Israeli lawmakers in the Knesset, Sadat offered full diplomatic recognition and peace in exchange for complete Israeli withdrawal from the Sinai and justice for Palestinians. **Hinge Question:** Why did Sadat's unilateral visit to Jerusalem shatter thirty years of psychological taboo between Israel and the Arab states?"
  }
};

const srcC = {
  id: "cme_l11_source_c",
  letter: "C",
  title: "Source C: Israeli Prime Minister Menachem Begin & The Camp David Accords (September 1978)",
  src: "/units/cme_new/assets/menachem_begin.jpeg",
  image: "/units/cme_new/assets/menachem_begin.jpeg",
  source: "/units/cme_new/assets/menachem_begin.jpeg",
  caption: "Menachem Begin, former underground Irgun commander and Likud Prime Minister who negotiated the historic Camp David Accords with Egypt, 1978.",
  desc: "Archival portrait photograph of Israeli Prime Minister Menachem Begin.",
  provenance: "Israel Government Press Office (GPO D1-1978), 1978.",
  citation: "Israel Government Press Office, Jerusalem.",
  hinge_question: "Why was a hardline nationalist like Begin capable of surrendering the entire Sinai when Labor leaders could not?",
  source_context: "As a right-wing Revisionist Zionist who had fiercely opposed earlier compromises, Begin possessed the unimpeachable nationalist credentials needed to evacuate Jewish settlements like Yamit in Sinai without being branded a traitor. Crucially, Begin gave up Sinai to secure Egyptian neutrality, allowing Israel to retain permanent control over Judea and Samaria (the West Bank). **Hinge Question:** Why was a hardline nationalist like Begin capable of surrendering the entire Sinai when Labor leaders could not?",
  context: "Likud Prime Minister Menachem Begin agreed to return the entire Sinai in exchange for a separate peace with Egypt.",
  question_badge: "Source Inference",
  question_type: "Source Inference",
  enquiry_question: "What can you infer from Source C about the ideological trade-offs made by Menachem Begin at Camp David?",
  model_answer: "Source C indicates that Begin made painful territorial concessions in the non-biblical Sinai Peninsula specifically to split the Arab world, neutralize Israel’s most powerful military opponent, and protect Israeli sovereignty over the biblically sacred West Bank.",
  provenance_clues: {
    author: "Official photographer for the Prime Minister's Office.",
    audience: "The Israeli electorate, Knesset members, and international diplomats.",
    motive: "To project Begin as a resolute, principled legal statesman capable of defending vital national interests.",
    hinge_question: "Why was a hardline nationalist like Begin capable of surrendering the entire Sinai when Labor leaders could not?"
  },
  teacher_notes: {
    source_context: "As a right-wing Revisionist Zionist who had fiercely opposed earlier compromises, Begin possessed the unimpeachable nationalist credentials needed to evacuate Jewish settlements like Yamit in Sinai without being branded a traitor. Crucially, Begin gave up Sinai to secure Egyptian neutrality, allowing Israel to retain permanent control over Judea and Samaria (the West Bank). **Hinge Question:** Why was a hardline nationalist like Begin capable of surrendering the entire Sinai when Labor leaders could not?"
  }
};

const existingD = l11.sources.find(s => s.title && s.title.includes('White House Lawn')) || l11.sources[3];
const srcD = JSON.parse(JSON.stringify(existingD));
srcD.id = "cme_l11_source_d";
srcD.letter = "D";

const existingE = l11.sources.find(s => s.title && s.title.includes('Withdrawal from Sinai')) || l11.sources[4];
const srcE = JSON.parse(JSON.stringify(existingE));
srcE.id = "cme_l11_source_e";
srcE.letter = "E";

// Update Narrative Blocks
l11.narrative_blocks[0].image = "/units/cme_new/assets/kissinger_golda_meir_1973.jpg";
l11.narrative_blocks[0].caption = "US Secretary of State Henry Kissinger meeting with Israeli Prime Minister Golda Meir in Jerusalem during post-war disengagement negotiations (1973–1974).";
l11.narrative_blocks[0].sources = [ srcA ];

l11.narrative_blocks[1].sources = [ srcB ];
l11.narrative_blocks[2].sources = [ srcC ];
l11.narrative_blocks[3].sources = [ srcD ];
l11.narrative_blocks[4].sources = [ srcE ];

// Update Root sources array
l11.sources = [ srcA, srcB, srcC, srcD, srcE ];

const newFileContent = `// CME Unit Data - Calibrated with 100% Traceable Quizzes
const cme_new_data = ${JSON.stringify(data, null, 2)};

export default cme_new_data;
`;

fs.writeFileSync(filePath, newFileContent, 'utf8');
console.log('Successfully updated units/cme_new/data.js');

const publicFilePath = path.join(__dirname, '..', 'public', 'units', 'cme_new', 'data.js');
fs.writeFileSync(publicFilePath, newFileContent, 'utf8');
console.log('Successfully updated public/units/cme_new/data.js');
