const fs = require('fs');
const path = require('path');

const cme8mUpdates = [
  {
    lessonIndex: 3, // Lesson 4
    questionMatch: 'events of the 1956 Suez Crisis',
    model: `The crisis began on 26 July 1956 when Egyptian President Gamal Abdel Nasser nationalised the Anglo-French Suez Canal Company. Nasser seized the waterway to fund the Aswan High Dam after Britain and the US cancelled financial aid. British Prime Minister Anthony Eden viewed this as an intolerable threat to vital oil supplies, resolving to overthrow Nasser.<br><br>In response, Britain, France, and Israel secretly signed the Protocol of Sèvres in October 1956 to manufacture an excuse for war. Under this plan, Israel invaded the Sinai on 29 October. Britain and France then issued an ultimatum and landed paratroopers at Port Said on 5 November, claiming to protect the canal as impartial peacekeepers.<br><br>However, this military action provoked decisive superpower intervention. US President Eisenhower condemned the invasion and threatened to collapse the British pound by blocking vital loans. Facing financial ruin, Britain accepted a humiliating ceasefire on 6 November. Therefore, American economic pressure forced the rapid withdrawal of Anglo-French troops, cementing Nasser's triumph and ending Britain's imperial status.`
  },
  {
    lessonIndex: 4, // Lesson 5
    questionMatch: 'leading to the outbreak of the Six-Day War',
    model: `The path to war began along the northern border between 1964 and April 1967. Syria’s Ba'athist government backed Fatah guerrilla raids and shelled Israeli kibbutzim from the Golan Heights. In response, Israel launched retaliatory counter-strikes, culminating on 7 April 1967 when Israeli Mirage jets shot down six Syrian MiG-21s in an aerial dogfight over Damascus.<br><br>This humiliation directly provoked Egyptian President Nasser into dangerous brinkmanship in May 1967. Spurred by false Soviet intelligence claiming Israel was massing troops to invade Syria, Nasser mobilised 100,000 soldiers in the Sinai, expelled the United Nations Emergency Force (UNEF), and closed the Straits of Tiran, severing Israel's oil supplies from Eilat.<br><br>This blockade convinced Israeli leaders that national destruction was imminent. The crisis escalated further on 30 May when King Hussein of Jordan signed a mutual defence pact with Egypt, encircling Israel. Therefore, fearing an imminent multi-front assault, Israel launched a preemptive strike on 5 June, destroying the Egyptian air force in Operation Focus and sparking the Six-Day War.`
  },
  {
    lessonIndex: 6, // Lesson 7
    questionMatch: 'aftermath of the 1967 war in the period from June to November 1967',
    model: `The aftermath began in June 1967 when Israel decisively captured East Jerusalem, the West Bank, Gaza, Sinai, and the Golan Heights. This displacement of over 300,000 Palestinian refugees across the Jordan River created an acute humanitarian crisis that destabilised neighbouring Arab states and inflamed regional hostility.<br><br>This catastrophic defeat directly provoked Arab leaders to convene at the Khartoum Summit in August 1967. Rather than negotiating, the Arab League issued its uncompromising 'Three Noes': no peace, no recognition, and no negotiations with Israel. In response, Israel hardened its stance by establishing permanent military outposts and early settlements across the conquered territories, entrenching the occupation.<br><br>This deadlock ultimately forced the United Nations to intervene in November 1967 by passing Resolution 242, establishing the 'Land for Peace' formula. However, deliberate ambiguity over whether Israel had to withdraw from 'all' territories allowed both sides to maintain opposing demands. Therefore, instead of achieving a lasting settlement, the post-war diplomacy of 1967 cemented a permanent territorial stalemate that fuelled decades of future conflict.`
  },
  {
    lessonIndex: 8, // Lesson 9
    questionMatch: 'key events of the Yom Kippur War',
    model: `The war began on 6 October 1973 when Egypt and Syria launched a coordinated surprise assault during the Jewish holy day of Yom Kippur. In the south, Egyptian forces crossed the Suez Canal and breached the fortified Bar-Lev Line using water cannons, while Syrian armoured divisions overran Israeli defences on the Golan Heights, inflicting devastating initial casualties on the unprepared IDF.<br><br>This existential crisis directly triggered a massive American military intervention. US President Nixon ordered Operation Nickel Grass, an emergency airlift of tanks and aircraft that replenished Israeli forces. Re-equipped, General Ariel Sharon's division exploited a gap between Egyptian armies, bridged the canal, and surrounded Egypt's Third Army, reversing the military momentum in Israel's favour.<br><br>However, this turnaround provoked global diplomatic and economic retaliation. Arab OPEC nations imposed a punitive oil embargo on Western supporters of Israel, quadrupling world oil prices. Fearing a catastrophic nuclear standoff with the Soviet Union, US Secretary of State Kissinger intervened. Therefore, intense superpower pressure secured a UN ceasefire on 24 October 1973, ending combat and opening the path to subsequent peace diplomacy.`
  },
  {
    lessonIndex: 9, // Lesson 10
    questionMatch: 'diplomatic negotiations between Israel and Egypt from 1974 to November 1977',
    model: `Diplomatic engagement began in early 1974 following the devastation of the Yom Kippur War. Fearing further conflict and eager to ease the damaging Arab oil embargo, US Secretary of State Henry Kissinger initiated intensive 'shuttle diplomacy'. Flying between Middle Eastern capitals, Kissinger successfully mediated the Sinai I (1974) and Sinai II (1975) disengagement accords, which withdrew Israeli troops from the Suez Canal and permitted Egypt to reopen the waterway.<br><br>However, this diplomatic momentum stalled following the May 1977 election of Menachem Begin’s right-wing Likud government. Begin was an ideological hardliner committed to retaining biblical lands in the West Bank, which threatened to paralyze regional talks. Fearing another costly war, Egyptian President Anwar Sadat decided to break the psychological impasse with an unprecedented diplomatic gamble.<br><br>This culminated on 19 November 1977 when Sadat made a historic visit to Jerusalem, becoming the first Arab leader to address the Israeli Knesset. Offering full peace in exchange for Egyptian territory, Sadat's bold initiative dismantled thirty years of mutual hostility. Therefore, this dramatic gesture compelled Begin to negotiate, laying the crucial foundation for the 1978 Camp David Accords.`
  },
  {
    lessonIndex: 10, // Lesson 11
    questionMatch: 'Israeli military involvement in Lebanon between 1978 and 1983',
    model: `Israeli military involvement began in March 1978 when Prime Minister Menachem Begin launched Operation Litani following the PLO's Coastal Road attack. Over 25,000 Israeli soldiers invaded southern Lebanon to push Palestinian fedayeen north of the Litani River. Although UNIFIL peacekeepers and a Christian militia buffer zone were deployed, persistent cross-border rocket fire convinced Defence Minister Ariel Sharon that only total destruction of the PLO would secure Israel.<br><br>Consequently, this tension triggered a full-scale invasion in June 1982 termed Operation Peace for Galilee. Advancing sixty miles past the cabinet-approved limit, Sharon besieged West Beirut. Weeks of relentless IDF aerial and artillery bombardment forced Yasser Arafat and thousands of PLO fighters to evacuate Lebanon for exile in Tunisia.<br><br>However, this military victory turned into a moral catastrophe in September 1982. Following the assassination of Lebanese President Gemayel, Israeli forces permitted Christian Phalangist militias into the Sabra and Shatila refugee camps, where hundreds of civilians were slaughtered. Therefore, intense domestic outrage and the Kahan Commission inquiry forced Sharon’s resignation, leaving Israel trapped in a costly Lebanese occupation.`
  },
  {
    lessonIndex: 11, // Lesson 12
    questionMatch: 'peace process between Israel and the Palestinians from 1992 to the assassination of Yitzhak Rabin',
    model: `The peace process began in 1992 following the election of Israeli Prime Minister Yitzhak Rabin, who favoured territorial compromise. Secret back-channel negotiations in Norway produced the historic Letters of Mutual Recognition in September 1993, in which Israel recognised the PLO and Yasser Arafat renounced terrorism. This breakthrough led directly to the Oslo I Accord, establishing a framework for phased Palestinian self-government.<br><br>Following this initial agreement, the peace process expanded practical administration. In May 1994, the Cairo Agreement created the Palestinian National Authority (PNA) in Gaza and Jericho. Diplomatic momentum continued with the September 1995 Oslo II Agreement, which divided the West Bank into Areas A, B, and C to extend Palestinian civil control.<br><br>However, violent extremist opposition threatened to derail these achievements. The 1994 Hebron massacre and retaliatory Hamas suicide bombings hardened public opinion. This hostility culminated on 4 November 1995 when Jewish extremist Yigal Amir assassinated Rabin at a Tel Aviv peace rally. Therefore, Rabin’s murder shattered the moderate political coalition, bringing the momentum of the Oslo peace process to a tragic halt.`
  }
];

function applyToUnitData(unitData) {
  let count = 0;
  cme8mUpdates.forEach(u => {
    const lesson = unitData.lessons[u.lessonIndex];
    if (!lesson || !lesson.exam_practice || !lesson.exam_practice.questions) return;
    const q = lesson.exam_practice.questions.find(item => item.question && item.question.includes(u.questionMatch));
    if (q) {
      q.model = u.model;
      count++;
    }
  });
  return count;
}

// 1. Update data/cme_new.json and public/data/cme_new.json
['data/cme_new.json', 'public/data/cme_new.json'].forEach(rel => {
  const p = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(p)) return;
  const json = JSON.parse(fs.readFileSync(p, 'utf8'));
  const updatedCount = applyToUnitData(json);
  fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Updated ${updatedCount} narrative models in ${rel}`);
});

// 2. Update units/cme_new/data.js and public/units/cme_new/data.js
['units/cme_new/data.js', 'public/units/cme_new/data.js'].forEach(rel => {
  const p = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  try {
    let clean = content;
    if (clean.startsWith('export default ')) clean = clean.substring('export default '.length);
    if (clean.endsWith(';\n')) clean = clean.substring(0, clean.length - 2);
    else if (clean.endsWith(';')) clean = clean.substring(0, clean.length - 1);
    const parsed = JSON.parse(clean);
    const updatedCount = applyToUnitData(parsed);
    fs.writeFileSync(p, `export default ${JSON.stringify(parsed, null, 2)};\n`, 'utf8');
    console.log(`Updated ${updatedCount} narrative models in ${rel}`);
  } catch (err) {
    console.log(`Could not JSON parse ${rel}:`, err.message);
  }
});

// 3. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(rel => {
  const p = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(p)) return;
  const db = JSON.parse(fs.readFileSync(p, 'utf8'));
  const cmeUnit = db.units ? db.units.find(u => u.id === 'cme_new') : null;
  if (cmeUnit) {
    const updatedCount = applyToUnitData(cmeUnit);
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${updatedCount} narrative models in ${rel} (units.cme_new)`);
  }
});

// 4. Update scripts/calibrate_cme_models.cjs
const calibScriptPath = path.resolve(__dirname, 'calibrate_cme_models.cjs');
if (fs.existsSync(calibScriptPath)) {
  let calibContent = fs.readFileSync(calibScriptPath, 'utf8');
  cme8mUpdates.forEach(u => {
    // Regex replace the model string for question_match
    const escapedMatch = u.questionMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(question_match:\\s*['"][^'"]*${escapedMatch}[^'"]*['"],\\s*model:\\s*)(["'\`])([\\s\\S]*?)\\2`, 'g');
    if (regex.test(calibContent)) {
      calibContent = calibContent.replace(regex, `$1${JSON.stringify(u.model)}`);
      console.log(`Updated model in calibrate_cme_models.cjs for: ${u.questionMatch}`);
    }
  });
  fs.writeFileSync(calibScriptPath, calibContent, 'utf8');
}

console.log('All CME narrative account calibrations applied successfully!');
