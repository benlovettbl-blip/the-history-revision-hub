const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { enquiryConfigs } = require('./render_medieval_england_workbook.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const dataJsPath = path.join(ROOT_DIR, 'units', 'medieval_england', 'data.js');
const dataJsonPath = path.join(ROOT_DIR, 'data', 'medieval_england.json');

const modelSentencesPerLesson = {
  'lesson_1': {
    1: "When Edward died a childless English king, three rival claimants contested the succession before the Witan backed Harold.",
    2: "The English Earl takes the crown as Harold II, but Harald Hardrada invaded the north, where a fierce Viking giant held Stamford Bridge until pierced by an Anglo-Saxon spear from beneath the wooden planks.",
    3: "After the fierce river clash at Stamford Bridge, Harold’s exhausted housecarls set off, marching night and day over 190 miles south in less than five days to meet the Norman invasion fleet.",
    4: "William deployed his army at the base of Senlac Hill, while Harold formed a defensive line atop the steep slippery ridge, where men stood with locked wooden shields and swung terrifying two-handed battleaxes.",
    5: "The battle turned when the Normans feigned retreat, pretending to run away, tricking the Saxon fyrd into chasing down the hill; disordered and exposed, the Saxon shield wall collapsed after an arrow strikes Harold in the eye."
  },
  'lesson_2': {
    1: "William rapidly secured control by constructing motte-and-bailey castles across England, building high earth mounds with quick timber walls, with over 500 castles built fast to intimidate rebellious locals.",
    2: "When northern Anglo-Saxon rebels attack York in 1069, William launched the brutal Harrying of the North, burning every crop, slaughtering livestock, and salting fields so over 100,000 starve to death in winter.",
    3: "At strategic coastal sites like Portchester, Normans reused ancient Roman walls, constructing a thick limestone keep alongside a deep warship harbour to guard against French seaborne invasion.",
    4: "In 1085, William commissioned the Domesday Book, counting every cow and pig across every manor, ensuring the Crown could extract every penny in tax and survey all knight's fees.",
    5: "Local records such as the Hundred of Fareham survey reveal how English landlords were kicked out, allowing Norman barons to take the manors and establish feudal dominance."
  },
  'lesson_3': {
    1: "Henry II appointed his close hunting friend Thomas Becket as Chancellor; Becket enjoyed silk robes and feasting, leading Henry to appoint him Archbishop hoping for an easy puppet to control the Church.",
    2: "Once consecrated Archbishop, Becket underwent a radical transformation: he throws off silk robes, donned a scratchy goat hairshirt, and declared himself loyal only to the Pope in Rome.",
    3: "Henry sought to stop criminous priests escaping punishment in lenient bishop's courts simply by reading a Latin verse (Benefit of Clergy); the King demands royal trials under the Constitutions of Clarendon.",
    4: "When Becket excommunicated royal bishops, the King shouts in fury: 'Will no one rid me of this turbulent priest?'; four knights gallop away to Canterbury, where their swords smashed at the altar, killing Becket in 1170.",
    5: "Becket became a martyr as pilgrims reported miracles at the tomb; in 1174, Henry performed penance, enduring whipping with birch rods from monks while church courts were kept intact."
  },
  'lesson_4': {
    1: "King John faced military disasters in Normandy, losing French castles like Château Gaillard; the barons laugh at 'Softsword' as John grew desperate for silver to fund counter-offensives.",
    2: "John repeatedly levied extortionate shield money demands (scutage) without baronial consent, arbitrarily seizing lands, fining widows, and taking hostages to enforce feudal extraction.",
    3: "John's huge war chest was emptied in 1214 when his imperial allies were smashed in France at the Battle of Bouvines, after which the exhausted northern barons refuse more taxes.",
    4: "In May 1215, the rebel barons draw their swords, capture London, and forced John to seal Magna Carta at Runnymede, guaranteeing no jail without fair trial and establishing that the King is bound by the law.",
    5: "John had no intention of honoring the charter; the Pope tears up the treaty and declared it void, sparking the First Barons' War, during which John contracted dysentery and the Crown jewels were lost in the Wash."
  },
  'lesson_5': {
    1: "In June 1348, the Black Death arrived aboard a sailor ship at Weymouth, spreading pneumonic and bubonic plague with egg-sized buboes under the arms, leaving nearly half the country dead.",
    2: "The sudden mortality emptied village cottages and left unharvested wheat rotting on the ground, creating severe labor shortages that gave surviving serfs unprecedented bargaining power for higher wages.",
    3: "Parliament passed the 1351 Statute of Labourers, ensuring wages were frozen by lords, rebellious runaways had an iron 'F' burned on foreheads, and lower classes were banned from wearing fur by sumptuary laws.",
    4: "In 1381, to pay the costly French war debt bill, Parliament levied the third poll tax demanding twelve pence from every head, sparking fury when a tax collector was chased with pitchforks at Brentwood.",
    5: "Under Wat Tyler and radical priest John Ball, peasants swarm the capital, burning the Savoy Palace; at Mile End and Smithfield, the 14-year-old boy King promises freedom before Tyler was stabbed at the peace talks by the Mayor of London."
  }
};

const wordCluesPerLesson = {
  'lesson_1': {
    'Childless English King': 'Edward died without leaving a direct biological heir, triggering an immediate succession void.',
    'Three Rival Claimants': 'Harold Godwinson, Harald Hardrada, and Duke William of Normandy all asserted rival claims.',
    'Witan Backs Harold': 'The Anglo-Saxon council of nobles and bishops unanimously chose England\'s richest earl.',
    'English Earl Takes Crown': 'Harold crowned King Harold II in Westminster Abbey on 6 January 1066.',
    'Fierce Viking Giant': 'Legendary Norse axeman held Stamford Bridge single-handedly before being speared from beneath.',
    'Duke Promised the Throne': 'William maintained Edward swore an oath and Harold confirmed it over holy relics in 1064.',
    '300 Viking Longships': 'Hardrada invaded Yorkshire with a fleet of 300 longships; only 24 were needed to carry survivors home.',
    'Fierce River Clash': 'Brutal slaughter at Stamford Bridge destroyed the Viking threat but devastated Harold’s elite forces.',
    'Marching Night and Day': 'Saxon housecarls marched 190 miles north in four days, then rushed 200 miles south to Hastings.',
    'Steep Slippery Ridge': 'Harold seized high ground on Senlac Hill, forcing Norman cavalry to charge uphill through wet clay.',
    'Locked Wooden Shields': 'Overlapping lime-wood shields formed an impenetrable defensive wall repelling cavalry for six hours.',
    'Two-Handed Battleaxes': 'Elite housecarls wielded heavy Dane axes capable of severing a knight and horse in a single blow.',
    'Pretending to Run Away': 'Norman cavalry staged coordinated feigned retreats downhill, crying out that all was lost.',
    'Chasing Down the Hill': 'Undisciplined Saxon fyrd peasants broke formation to plunder, opening fatal gaps in the shield wall.',
    'Arrow Strikes Harold': 'King Harold was mortally wounded late in the day, causing remaining Saxon resistance to disintegrate.'
  },
  'lesson_2': {
    'High Earth Mounds': 'Steep artificial earth mounds (mottes) raised timber keeps above hostile Anglo-Saxon territory.',
    'Quick Timber Walls': 'Pre-fabricated wooden palisades allowed Norman garrison troops to fortify positions within days.',
    '500 Castles Built Fast': 'Network of 500 fortresses established total psychological domination and rapid response garrisons.',
    'Rebels Attack York': 'In 1069, northern rebels joined Danish forces to slaughter the Norman garrison at York.',
    'Burning Every Crop': 'William ordered systematic destruction of crops, seed corn, and farm tools from Humber to Tees.',
    '100,000 Starve to Death': 'Catastrophic famine killed over 100,000 Saxons; corpses rotted unburied in deserted villages.',
    'Ancient Roman Walls': 'Normans fortified Portchester by planting a four-storey stone keep within Roman Saxon Shore walls.',
    'Thick Limestone Keep': 'Towering stone walls projected invulnerability and permanent feudal royal authority.',
    'Deep Warship Harbour': 'Protected fleet anchorages guarded against potential Danish or French seaborne counter-attacks.',
    'Fearing Viking Invasion': 'Facing threat of a joint Danish-Flemish invasion in 1085, William audited the wealth of England.',
    'Counting Every Cow and Pig': 'Royal commissioners audited every hide of land, mill, plough, and beast across the shires.',
    'Paying Every Penny in Tax': 'Fiscal survey guaranteed maximum tax extraction and confirmed feudal obligations of barons.',
    'Hundred of Fareham Survey': 'Detailed local inquest documenting exactly how Anglo-Saxon estates were confiscated.',
    'English Landlords Kicked Out': 'Saxon thanes who had held land under Edward the Confessor were systematically dispossessed.',
    'Barons Take the Manors': 'By 1086, over 95% of English agricultural land was concentrated in the hands of ~200 Norman barons.'
  },
  'lesson_3': {
    'King’s Hunting Friend': 'Henry II and Thomas Becket were inseparable companions, sharing hunting, chess, and statecraft.',
    'Silk Robes and Feasting': 'As royal Chancellor, Becket lived with lavish extravagance, dazzling foreign ambassadors.',
    'Hoping for an Easy Puppet': 'Henry appointed Becket Archbishop of Canterbury, believing he would obey the Crown unconditionally.',
    'Throws Off Silk Robes': 'Upon consecration, Becket underwent total religious conversion, abandoning secular luxuries.',
    'Scratchy Goat Hairshirt': 'Becket adopted severe ascetic discipline, washing feet of beggars and wearing coarse hairshirts.',
    'Loyal Only to the Pope': 'Becket declared the Church sovereign above monarchs, submitting solely to the authority of Rome.',
    'Priests Escaping Punishment': 'Over 100 clerics committed homicide during Henry’s reign without facing capital punishment.',
    'Reading a Latin Verse': 'Literate offenders recited Psalm 51 ("neck verse") to claim Benefit of Clergy in lenient bishop courts.',
    'King Demands Royal Trials': 'Constitutions of Clarendon (1164) demanded unfrocked criminous clerics be sentenced in royal courts.',
    'King Shouts in Fury': 'Henry erupted: "What miserable drones and traitors have I nourished, that no one will rid me of this priest!"',
    'Four Knights Gallop Away': 'Reginald FitzUrse and three knights rode to Canterbury Cathedral to arrest Becket on 29 Dec 1170.',
    'Swords Smashed at the Altar': 'Knights hacked Becket to death before the Cathedral altar, shattering a sword tip on the stone floor.',
    'Miracles at the Tomb': 'Pilgrims reported miraculous healings at Becket\'s tomb, making Canterbury a global pilgrimage hub.',
    'Whipping with Birch Rods': 'In 1174, Henry performed barefoot penance, submitting to flogging by eighty monks at Canterbury.',
    'Church Courts Kept Intact': 'Becket’s martyrdom forced Henry to abandon royal prosecution of clergy, preserving papal autonomy.'
  },
  'lesson_4': {
    'Losing French Castles': 'King John lost ancestral Angevin territories including Normandy, Anjou, and Maine to Philip II by 1204.',
    'Barons Laugh at Softsword': 'Barons mocked John as "Softsword" for military incompetence and cowardly flight from Normandy.',
    'Desperate for Silver': 'Losing continental revenues drove John to squeeze extraordinary taxation from English landholders.',
    'Shield Money Demands': 'John levied 11 scutage taxes in 16 years, charging barons up to 3 marks per knight’s fee without consent.',
    'Locked Church Doors': 'When John rejected Stephen Langton, Pope Innocent III placed England under interdict (1208–1213).',
    'Dead Buried in Ditches': 'Church bells were silenced, sacraments banned, and corpses buried in ditches without Christian rites.',
    'Huge War Chest Emptied': 'John spent over £130,000 financing a massive European military alliance to reconquer Normandy.',
    'Allies Smashed in France': 'At the Battle of Bouvines (1214), French King Philip Augustus smashed John’s German and Flemish allies.',
    'Barons Refuse More Taxes': 'Bankrupt and humiliated, John returned to England where rebel barons renounced their feudal homage.',
    'Barons Draw Their Swords': 'Rebel barons seized London in May 1215, forcing John to negotiate at Runnymede meadow.',
    'No Jail Without Fair Trial': 'Clause 39 established that no free man could be imprisoned without lawful judgement of peers.',
    'King Bound by the Law': 'Magna Carta subordinated the monarch to statutory law, ending arbitrary royal absolutism.',
    'Pope Tears Up the Treaty': 'Pope Innocent III issued a papal bull declaring Magna Carta null, void, and shameful.',
    'French Prince Invited In': 'Rebel barons offered the English crown to Prince Louis of France, who invaded southern England.',
    'Crown Jewels Lost in the Wash': 'John contracted fatal dysentery in October 1216 after his baggage train was swamped by the tide.'
  },
  'lesson_5': {
    'Sailor Ship at Weymouth': 'Plague arrived in England at Melcombe Regis (Weymouth) in June 1348 aboard a Gascon merchant vessel.',
    'Buboes Under the Arms': 'Bacterial infection caused agonizing black swellings (buboes) in the groin and armpits followed by death.',
    'Nearly Half the Country Dead': 'Between 40% and 50% of the English population died within eighteen months of the initial outbreak.',
    'Empty Village Cottages': 'Entire settlements were abandoned as livestock roamed unharvested fields across the realm.',
    'Wheat Rotting on the Ground': 'Massive labour shortages left grain unharvested, causing manorial productivity to collapse.',
    'Workers Demanding Double Pay': 'Surviving serfs and labourers possessed unprecedented leverage, demanding double or triple pre-plague wages.',
    'Wages Frozen by Lords': '1351 Statute of Labourers capped wages at 1346 levels and prohibited peasants from travelling for higher pay.',
    'Iron "F" Burned on Foreheads': 'Runaway labourers caught violating the statute were branded on the forehead with "F" for falsity.',
    'Banned from Wearing Fur': 'Sumptuary laws of 1363 forbade peasants from wearing expensive dyed cloth, silver, or fur.',
    'French War Debt Bill': 'Prohibitive costs of the Hundred Years’ War bankrupted the Crown, forcing emergency wartime taxes.',
    'Twelve Pence from Every Head': 'Third Poll Tax of 1381 demanded a flat one shilling (12 pence) from every adult regardless of wealth.',
    'Tax Collector Chased with Pitchforks': 'John Bampton attempted to collect tax arrears at Brentwood, Essex, sparking armed rural revolt.',
    'Peasants Swarm the Capital': 'Essex and Kent rebels entered London on 13 June 1381, burning the Savoy Palace and Fleet Prison.',
    'Tyler Stabbed at the Peace Talks': 'Mayor William Walworth killed rebel leader Wat Tyler during negotiations with Richard II at Smithfield.',
    'Boy King Promises Freedom': 'The 14-year-old Richard II promised to abolish serfdom, but revoked all charters once the rebel army dispersed.'
  }
};

// Build formatted workbook_stages for each of the 5 lessons
const builtStagesByLesson = {};

enquiryConfigs.forEach(cfg => {
  const lessonKey = cfg.id;
  const sentences = modelSentencesPerLesson[lessonKey] || {};
  const clues = wordCluesPerLesson[lessonKey] || {};

  builtStagesByLesson[lessonKey] = cfg.stages.map(st => {
    const stepNum = st.step;
    const bullets = st.bullets || [];
    const wordsWithClues = bullets.map(b => ({
      term: b,
      clue: clues[b] || st.focusClue || ''
    }));

    return {
      step: stepNum,
      para_ref: st.paraRef || `[${cfg.lessonNum}.${stepNum}]`,
      paraRef: st.paraRef || `[${cfg.lessonNum}.${stepNum}]`,
      date: st.date || '',
      heading: st.questionHeading || '',
      questionHeading: st.questionHeading || '',
      bullets: bullets,
      words: wordsWithClues,
      focus_clue: st.focusClue || '',
      focusClue: st.focusClue || '',
      model_sentence: sentences[stepNum] || '',
      modelSentence: sentences[stepNum] || ''
    };
  });
});

// 1. Update units/medieval_england/data.js
console.log('Loading units/medieval_england/data.js...');
const rawDataJs = fs.readFileSync(dataJsPath, 'utf8');
const code = rawDataJs.replace(/^\s*export\s+default\s+/m, 'global.unitData = ');
const ctx = { global: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const unitData = ctx.global.unitData;

unitData.lessons.forEach(lesson => {
  if (builtStagesByLesson[lesson.id]) {
    lesson.workbook_stages = builtStagesByLesson[lesson.id];
    console.log(`✅ Injected 5 workbook_stages into ${lesson.id} in units/medieval_england/data.js`);
  }
});

const serializedJs = 'export default ' + JSON.stringify(unitData, null, 2) + ';\n';
fs.writeFileSync(dataJsPath, serializedJs, 'utf8');
console.log('Saved units/medieval_england/data.js successfully.');

// 2. Update data/medieval_england.json
if (fs.existsSync(dataJsonPath)) {
  console.log('Updating data/medieval_england.json...');
  const jsonContent = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
  jsonContent.lessons.forEach(lesson => {
    if (builtStagesByLesson[lesson.id]) {
      lesson.workbook_stages = builtStagesByLesson[lesson.id];
    }
  });
  fs.writeFileSync(dataJsonPath, JSON.stringify(jsonContent, null, 2), 'utf8');
  console.log('Saved data/medieval_england.json successfully.');
}

console.log('🎉 Successfully synchronized all 5 enquiries of Medieval England with full workbook_stages!');

