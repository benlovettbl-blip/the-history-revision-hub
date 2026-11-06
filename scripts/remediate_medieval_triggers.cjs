const fs = require('fs');
const vm = require('vm');

const filePath = 'units/medieval_england/data.js';
const rawCode = fs.readFileSync(filePath, 'utf8');

const additionsPerLesson = {
  'lesson_1': {
    1: " In January 1066, Edward the Confessor died as a childless English king, sparking a succession crisis between three rival claimants: Harold Godwinson, William of Normandy, and Harald Hardrada, before the Witan backs Harold.",
    2: " The English Earl takes the crown as Harold II, but Harald Hardrada invaded the north, where a fierce Viking giant held Stamford Bridge until pierced by an Anglo-Saxon spear from beneath the wooden planks.",
    3: " After the fierce river clash at Stamford Bridge, Harold’s exhausted housecarls set off, marching night and day over 190 miles south in less than five days to meet the Norman invasion fleet.",
    4: " William deployed his army at the base of Senlac Hill, while Harold formed a defensive line atop the steep slippery ridge, where men stood with locked wooden shields and swung terrifying two-handed battleaxes.",
    5: " The battle turned when the Normans feigned retreat, pretending to run away, tricking the Saxon fyrd into chasing down the hill; disordered and exposed, the Saxon shield wall collapsed after an arrow strikes Harold in the eye."
  },
  'lesson_2': {
    1: " William rapidly secured control by constructing motte-and-bailey castles across England, building high earth mounds with quick timber walls, with over 500 castles built fast to intimidate rebellious locals.",
    2: " When northern Anglo-Saxon rebels attack York in 1069, William launched the brutal Harrying of the North, burning every crop, slaughtering livestock, and salting fields so over 100,000 starve to death in winter.",
    3: " At strategic coastal sites like Portchester, Normans reused ancient Roman walls, constructing a thick limestone keep alongside a deep warship harbour to guard against French seaborne invasion.",
    4: " In 1085, William commissioned the Domesday Book, counting every cow and pig across every manor, ensuring the Crown could extract every penny in tax and survey all knight's fees.",
    5: " Local records such as the Hundred of Fareham survey reveal how English landlords were kicked out, allowing Norman barons to take the manors and establish feudal dominance."
  },
  'lesson_3': {
    1: " Henry II appointed his close hunting friend Thomas Becket as Chancellor; Becket enjoyed silk robes and feasting, leading Henry to appoint him Archbishop hoping for an easy puppet to control the Church.",
    2: " Once consecrated Archbishop, Becket underwent a radical transformation: he throws off silk robes, donned a scratchy goat hairshirt, and declared himself loyal only to the Pope in Rome.",
    3: " Henry sought to stop criminous priests escaping punishment in lenient bishop's courts simply by reading a Latin verse (Benefit of Clergy); the King demands royal trials under the Constitutions of Clarendon.",
    4: " When Becket excommunicated royal bishops, the King shouts in fury: 'Will no one rid me of this turbulent priest?'; four knights gallop away to Canterbury, where their swords smashed at the altar, killing Becket in 1170.",
    5: " Becket became a martyr as pilgrims reported miracles at the tomb; in 1174, Henry performed penance, enduring whipping with birch rods from monks while church courts were kept intact."
  },
  'lesson_4': {
    1: " King John faced military disasters in Normandy, losing French castles like Château Gaillard; the barons laugh at 'Softsword' as John grew desperate for silver to fund counter-offensives.",
    2: " John repeatedly levied extortionate shield money demands (scutage) without baronial consent, arbitrarily seizing lands, fining widows, and taking hostages to enforce feudal extraction.",
    3: " John's huge war chest was emptied in 1214 when his imperial allies were smashed in France at the Battle of Bouvines, after which the exhausted northern barons refuse more taxes.",
    4: " In May 1215, the rebel barons draw their swords, capture London, and forced John to seal Magna Carta at Runnymede, guaranteeing no jail without fair trial and establishing that the King is bound by the law.",
    5: " John had no intention of honoring the charter; the Pope tears up the treaty and declared it void, sparking the First Barons' War, during which John contracted dysentery and the Crown jewels were lost in the Wash."
  },
  'lesson_5': {
    1: " In June 1348, the Black Death arrived aboard a sailor ship at Weymouth, spreading pneumonic and bubonic plague with egg-sized buboes under the arms, leaving nearly half the country dead.",
    2: " The sudden mortality emptied village cottages and left unharvested wheat rotting on the ground, creating severe labor shortages that gave surviving serfs unprecedented bargaining power for higher wages.",
    3: " Parliament passed the 1351 Statute of Labourers, ensuring wages were frozen by lords, rebellious runaways had an iron 'F' burned on foreheads, and lower classes were banned from wearing fur by sumptuary laws.",
    4: " In 1381, to pay the costly French war debt bill, Parliament levied the third poll tax demanding twelve pence from every head, sparking fury when a tax collector was chased with pitchforks at Brentwood.",
    5: " Under Wat Tyler and radical priest John Ball, peasants swarm the capital, burning the Savoy Palace; at Mile End and Smithfield, the 14-year-old boy King promises freedom before Tyler was stabbed at the peace talks by the Mayor of London."
  }
};

const code = rawCode.replace(/^\s*export\s+default\s+/m, 'global.data = ');
const ctx = { global: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const data = ctx.global.data;

let totalUpdated = 0;

data.lessons.forEach(lesson => {
  const adds = additionsPerLesson[lesson.id];
  if (!adds) return;
  
  lesson.narrative_blocks.forEach((block, bIdx) => {
    const stageNum = bIdx + 1;
    const addText = adds[stageNum];
    if (addText && !block.text.includes(addText.trim().slice(0, 30))) {
      block.text = block.text.trim() + " " + addText.trim();
      totalUpdated++;
    }
  });
});

console.log(`Updated ${totalUpdated} narrative blocks in units/medieval_england/data.js.`);
const newFileContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(filePath, newFileContent, 'utf8');
console.log('Saved units/medieval_england/data.js successfully.');

