const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.json');
const pubDbPath = path.join(__dirname, '../public/database.json');

// 1. the_shoah
const shoahPath = path.join(__dirname, '../data/the_shoah.json');
const pubShoahPath = path.join(__dirname, '../public/data/the_shoah.json');
const shoah = JSON.parse(fs.readFileSync(shoahPath, 'utf8'));

shoah.lessons[1].workbook_stages[0].words = [
  { term: "nationwide anti-Jewish boycott (1 April 1933)", clue: "The state-sponsored one-day commercial boycott where SA men stood outside Jewish-owned shops with placards." },
  { term: "Civil Service Restoration Act (7 April 1933)", clue: "The Nazi law ordering the dismissal of all non-Aryan civil servants, teachers, and university professors." },
  { term: "Nazi SA stormtrooper intimidation", clue: "Violent paramilitaries in brown uniforms who harassed customers, painted Stars of David, and enforced the boycott." }
];
shoah.lessons[1].workbook_stages[0].model_sentence = "Beginning with the <strong>nationwide anti-Jewish boycott (1 April 1933)</strong> enforced by <strong>Nazi SA stormtrooper intimidation</strong>, the regime rapidly purged Jews under the <strong>Civil Service Restoration Act (7 April 1933)</strong>.";

shoah.lessons[2].workbook_stages[0].words = [
  { term: "invasion of Poland (1 September 1939)", clue: "The German blitzkrieg attack that initiated WWII and placed over two million Polish Jews under brutal Nazi occupation." },
  { term: "two million Polish Jews", clue: "The massive Jewish population of occupied Poland, far larger than Germany's pre-war Jewish community of 500,000." },
  { term: "Heydrich's Schnellbrief (21 September 1939)", clue: "The urgent directive ordering all Polish Jews to be gathered from rural villages and concentrated into cities near rail junctions." }
];
shoah.lessons[2].workbook_stages[0].model_sentence = "Following the <strong>invasion of Poland (1 September 1939)</strong> that trapped <strong>two million Polish Jews</strong>, Reinhard Heydrich issued <strong>Heydrich's Schnellbrief (21 September 1939)</strong> ordering concentration into urban ghettos.";

shoah.lessons[3].workbook_stages[0].words = [
  { term: "22 June 1941", clue: "The date Adolf Hitler launched Operation Barbarossa, invading the Soviet Union with three million soldiers." },
  { term: "Operation Barbarossa", clue: "The Axis invasion of the USSR, framed from the beginning as an ideological war of extermination against Judeo-Bolshevism." },
  { term: "Adolf Hitler & German High Command", clue: "Nazi military leaders who issued criminal orders, including the Commissar Order, authorizing the summary execution of Soviet captives." }
];
shoah.lessons[3].workbook_stages[0].model_sentence = "Launched on <strong>22 June 1941</strong> under the ideological leadership of <strong>Adolf Hitler & German High Command</strong>, <strong>Operation Barbarossa</strong> transformed the conflict into an uncompromising war of racial annihilation.";

shoah.lessons[4].workbook_stages[0].words = [
  { term: "20 January 1942", clue: "The date fifteen senior Nazi government officials met at a lakeside villa in Berlin to coordinate the Final Solution." },
  { term: "Wannsee Conference", clue: "The ninety-minute secret meeting where administrative leaders coordinated the deportation of 11 million European Jews to death camps." },
  { term: "Reinhard Heydrich & 15 State Officials", clue: "RSHA chief Heydrich and government state secretaries who organized the bureaucratic machinery of mass industrial murder." }
];
shoah.lessons[4].workbook_stages[0].model_sentence = "Convening on <strong>20 January 1942</strong> lakeside in Berlin, <strong>Reinhard Heydrich & 15 State Officials</strong> met at the <strong>Wannsee Conference</strong> to coordinate the logistical machinery of the Final Solution.";

shoah.lessons[6].workbook_stages[1].words = [
  { term: "27 January 1945", clue: "The day Soviet soldiers of the 322nd Rifle Division arrived at Auschwitz-Birkenau, discovering 7,000 surviving inmates and warehouse piles of human hair." },
  { term: "15 April 1945", clue: "The date British forces entered Bergen-Belsen camp in northern Germany, discovering 60,000 starving prisoners and 13,000 unburied corpses." },
  { term: "Bergen-Belsen", clue: "The concentration camp liberated by the British 11th Armoured Division whose horrors shocked the international public through BBC radio broadcasts." }
];
shoah.lessons[6].workbook_stages[1].model_sentence = "Following the Soviet discovery of Auschwitz on <strong>27 January 1945</strong>, British forces reached <strong>Bergen-Belsen</strong> on <strong>15 April 1945</strong>, confronting the horrific reality of Nazi extermination.";

fs.writeFileSync(shoahPath, JSON.stringify(shoah, null, 2), 'utf8');
if (fs.existsSync(pubShoahPath)) fs.writeFileSync(pubShoahPath, JSON.stringify(shoah, null, 2), 'utf8');

// 2. great_war
const gwPath = path.join(__dirname, '../data/great_war.json');
const pubGwPath = path.join(__dirname, '../public/data/great_war.json');
const gw = JSON.parse(fs.readFileSync(gwPath, 'utf8'));

gw.lessons[4].workbook_stages[3].words = [
  { term: "30 July 1914", clue: "The fateful date Tsar Nicholas II ordered full general mobilization of the Russian imperial armed forces." },
  { term: "general mobilization", clue: "The mass call-up of millions of Russian reservists that triggered reciprocal German military counter-mobilization." },
  { term: "\"War by Timetable.\"", clue: "A.J.P. Taylor's historical thesis that rigid railway mobilization schedules made general European war inevitable once trains started rolling." }
];
gw.lessons[4].workbook_stages[3].model_sentence = "When Russia ordered <strong>general mobilization</strong> on <strong>30 July 1914</strong>, rigid military schedules trapped European powers in an unstoppable <strong>\"War by Timetable.\"</strong>";

fs.writeFileSync(gwPath, JSON.stringify(gw, null, 2), 'utf8');
if (fs.existsSync(pubGwPath)) fs.writeFileSync(pubGwPath, JSON.stringify(gw, null, 2), 'utf8');

// 3. cme_new
const cmePath = path.join(__dirname, '../data/cme_new.json');
const pubCmePath = path.join(__dirname, '../public/data/cme_new.json');
const cme = JSON.parse(fs.readFileSync(cmePath, 'utf8'));

const cmeFixes = {
  "4_1": {
    words: [
      { term: "28 February 1955", clue: "The date Israeli paratroopers launched a devastating raid into Egyptian-held Gaza." },
      { term: "Operation Black Arrow", clue: "The Israeli retaliatory strike against an Egyptian army garrison in Gaza that shattered border stability." },
      { term: "37 Egyptian soldiers", clue: "The Egyptian servicemen killed during the Gaza raid, which humiliated Gamal Abdel Nasser and prompted the Czech Arms Deal." }
    ],
    model: "Launched on <strong>28 February 1955</strong>, Israel's cross-border strike in <strong>Operation Black Arrow</strong> left <strong>37 Egyptian soldiers</strong> dead, pushing Nasser toward the Soviet bloc."
  },
  "5_4": {
    words: [
      { term: "13 November 1966", clue: "The date Israeli forces conducted a major armored cross-border reprisal against the Jordanian West Bank." },
      { term: "Operation Shredder", clue: "The codename for the massive IDF armored raid that destroyed 125 buildings in the West Bank town of As-Samu." },
      { term: "As-Samu", clue: "The Jordanian village attacked in retaliation for a Fatah landmine, leaving fifteen Jordanian soldiers dead and shattering Israeli-Jordanian relations." }
    ],
    model: "On <strong>13 November 1966</strong>, the Israeli military initiated <strong>Operation Shredder</strong>, launching an armoured raid against <strong>As-Samu</strong> that destabilised King Hussein's regime."
  },
  "5_5": {
    words: [
      { term: "7 April 1967", clue: "The day an intense aerial clash erupted along the Syrian-Israeli border over tractor plowing rights in the demilitarized zone." },
      { term: "Mirage III", clue: "French-built supersonic jet fighters flown by the Israeli Air Force that dominated Syrian dogfights over the Golan." },
      { term: "MiG-21", clue: "Soviet-supplied jet fighters flown by the Syrian Air Force, six of which were shot down during the clash." }
    ],
    model: "In a major air engagement on <strong>7 April 1967</strong>, Israeli pilots flying the <strong>Mirage III</strong> shot down six Syrian <strong>MiG-21</strong> fighters and buzzed Damascus."
  },
  "6_1": {
    words: [
      { term: "13 May 1967", clue: "The day the Soviet Union transmitted false intelligence reports to Cairo claiming Israel was massing twelve brigades on the Syrian border." },
      { term: "ten to twelve combat brigades", clue: "The phantom Israeli force that Soviet intelligence falsely claimed was preparing an imminent invasion of Damascus." },
      { term: "14–15 May", clue: "The dates Egyptian troops staged public military parades through Cairo before deploying into the Sinai Peninsula." }
    ],
    model: "Prompted by false Soviet intelligence on <strong>13 May 1967</strong> alleging an attack by <strong>ten to twelve combat brigades</strong>, Egyptian forces marched into the Sinai on <strong>14–15 May</strong>."
  },
  "6_2": {
    words: [
      { term: "16 May 1967", clue: "The date President Nasser formally demanded the immediate withdrawal of UN peacekeepers from the Sinai border." },
      { term: "United Nations Emergency Force (UNEF)", clue: "The international peacekeeping detachment stationed along the Egyptian-Israeli border since the 1956 Suez Crisis." },
      { term: "22–23 May", clue: "The dates Nasser announced the total closure of the Straits of Tiran, cutting off Israel's southern oil port of Eilat." }
    ],
    model: "After Nasser expelled the <strong>United Nations Emergency Force (UNEF)</strong> on <strong>16 May 1967</strong>, he closed the Straits of Tiran on <strong>22–23 May</strong>, making war all but inevitable."
  },
  "7_1": {
    words: [
      { term: "7 June 1967", clue: "The momentous day Israeli paratroopers breached the Lions' Gate to capture the Old City of Jerusalem." },
      { term: "Motta Gur", clue: "Brigade commander of the 55th Paratroopers who broadcast the famous radio message: 'The Temple Mount is in our hands!'" },
      { term: "Western Wall", clue: "The sacred remnant of the Second Temple where emotional Israeli soldiers gathered to pray for the first time in nineteen years." }
    ],
    model: "On <strong>7 June 1967</strong>, paratrooper commander <strong>Motta Gur</strong> captured the Old City of Jerusalem, enabling Jewish worshippers to return to the <strong>Western Wall</strong>."
  },
  "8_1": {
    words: [
      { term: "21 March 1968", clue: "The date Israeli forces crossed the Jordan River to attack the Palestinian guerrilla stronghold at Karameh." },
      { term: "Karameh", clue: "The town in Jordan where Palestinian fighters offered fierce resistance to an IDF armored assault, suffering heavy casualties." },
      { term: "Yasser Arafat", clue: "The charismatic Fatah leader who transformed the Battle of Karameh into a celebrated moral victory, catapulting himself to PLO leadership." }
    ],
    model: "Fought on <strong>21 March 1968</strong>, the fierce resistance of Palestinian guerrillas at <strong>Karameh</strong> established <strong>Yasser Arafat</strong> as the undisputed leader of the liberation movement."
  },
  "8_4": {
    words: [
      { term: "5 September 1972", clue: "The tragic day eight Palestinian terrorists broke into the Olympic Village in Munich, West Germany." },
      { term: "Black September", clue: "The militant Palestinian faction named after the 1970 Jordanian civil war that carried out the Munich attack." },
      { term: "nine Israeli athletes and coaches hostage", clue: "The Olympic team members taken captive in their dormitories and murdered during a botched German rescue attempt at Fürstenfeldbruck." }
    ],
    model: "On <strong>5 September 1972</strong>, the militant faction <strong>Black September</strong> stormed the Munich Olympic Village, taking <strong>nine Israeli athletes and coaches hostage</strong>."
  },
  "9_3": {
    words: [
      { term: "6 October 1973", clue: "The holy day of Yom Kippur when Egypt and Syria launched a coordinated surprise assault across the Suez Canal and Golan Heights." },
      { term: "the surprise attack", clue: "Operation Badr, which caught Israeli intelligence off guard and breached the heavily fortified Bar-Lev Line in hours." },
      { term: "Yom Kippur", clue: "The holiest day in the Jewish calendar, when Israel was at prayer and radio broadcasting was suspended, delaying national military mobilization." }
    ],
    model: "Launched on <strong>6 October 1973</strong>, <strong>the surprise attack</strong> by Arab armies took full advantage of the holiday of <strong>Yom Kippur</strong> to shatter the Bar-Lev Line."
  },
  "9_5": {
    words: [
      { term: "17 October 1973", clue: "The date Arab oil ministers in Kuwait voted to implement production cuts and an embargo against Western nations supporting Israel." },
      { term: "$12 per barrel", clue: "The quadruple increase in world petroleum prices that plunged Western economies into unprecedented stagflation and energy panic." },
      { term: "Resolution 338", clue: "The United Nations Security Council resolution adopted on 22 October 1973 calling for an immediate ceasefire and implementation of Resolution 242." }
    ],
    model: "Announced on <strong>17 October 1973</strong>, the Arab oil embargo drove crude to <strong>$12 per barrel</strong> while world powers negotiated UN <strong>Resolution 338</strong>."
  },
  "10_5": {
    words: [
      { term: "6 October 1981", clue: "The day President Anwar Sadat was assassinated during an annual military victory parade in Cairo." },
      { term: "Khalid Islambouli", clue: "The army lieutenant and Egyptian Islamic Jihad conspirator who jumped from an artillery truck to fire directly into the presidential reviewing stand." },
      { term: "Anwar Sadat was assassinated", clue: "The tragic death of the Egyptian leader, gunned down by religious extremists enraged by his peace treaty with Israel." }
    ],
    model: "During a military parade on <strong>6 October 1981</strong>, army conspirator <strong>Khalid Islambouli</strong> led the attack where President <strong>Anwar Sadat was assassinated</strong>."
  }
};

cme.lessons.forEach((l, li) => {
  (l.workbook_stages || l.stages || []).forEach((s, si) => {
    const key = `${li+1}_${si+1}`;
    if (cmeFixes[key]) {
      s.words = cmeFixes[key].words;
      s.key_terms = cmeFixes[key].words;
      s.model_sentence = cmeFixes[key].model;
    }
  });
});

fs.writeFileSync(cmePath, JSON.stringify(cme, null, 2), 'utf8');
if (fs.existsSync(pubCmePath)) fs.writeFileSync(pubCmePath, JSON.stringify(cme, null, 2), 'utf8');

// Update databases
[dbPath, pubDbPath].forEach(dbp => {
  if (fs.existsSync(dbp)) {
    const db = JSON.parse(fs.readFileSync(dbp, 'utf8'));
    db.the_shoah = shoah;
    db.great_war = gw;
    db.cme_new = cme;
    fs.writeFileSync(dbp, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated all 3 units in ${dbp}`);
  }
});
console.log('Successfully healed all 17 "decisive developments surrounding" stages!');

