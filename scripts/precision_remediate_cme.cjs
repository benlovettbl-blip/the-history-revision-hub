const fs = require('fs');
const vm = require('vm');

const filePath = 'units/cme_new/data.js';
const rawCode = fs.readFileSync(filePath, 'utf8');

const precisionAdditions = {
  'lesson_3': {
    1: " Ben-Gurion was reading the declaration in Tel Aviv to establish statehood."
  },
  'lesson_6': {
    3: " Syrian gunners established bases in the Golan Heights and carried out landmine sabotage in Galilee farms.",
    4: " Israeli units engaged in sharp clashes with Jordanian soldiers during cross-border operations.",
    5: " Israeli fighter jets performed celebratory victory passes over Damascus after air duels."
  },
  'lesson_7': {
    1: " Over 100,000 Egyptian soldiers deployed into the Sinai desert.",
    3: " Moshe Dayan was named Defence Minister to lead the war cabinet.",
    4: " Over 300 aircraft were wiped out on the runway, granting uncontested total air supremacy to Israel."
  },
  'lesson_8': {
    1: " Israeli paratroopers reach the Western Wall in the Old City.",
    3: " Resolution 242 called for Arab recognition of secure borders for all states in the region.",
    5: " The government initiated the Allon Plan security outposts and civilian communities in Jordan Valley."
  },
  'lesson_9': {
    1: " During the Battle of Karameh, 28 Israeli soldiers were killed alongside heavy Palestinian losses.",
    2: " Guerrillas filmed blowing up jets for world television audiences at Dawson's Field.",
    4: " Eleven athletes were murdered in a failed rescue attempt at the airfield during a live broadcast to 900 million viewers worldwide.",
    5: " Prime Minister Golda Meir issued a secret personal directive authorizing Operation Wrath of God."
  },
  'lesson_10': {
    1: " Egyptian forces deployed a dense Soviet anti-aircraft missile umbrella along the western bank.",
    3: " The joint assault was codenamed Operation Badr, a holy day assault where 1,400 Syrian tanks storm the Heights.",
    4: " General Ariel Sharon led a counter-thrust, exploiting the seam between Arab armies at the Great Bitter Lake."
  },
  'lesson_11': {
    4: " Menachem Begin asserted ancient biblical claims on occupied lands.",
    5: " Sadat's trip was followed by Menachem Begin’s reciprocal visit to Ismailia.",
    2: " Palestinians rejected the proposal for a vague five-year autonomy council.",
    4: " Arab nations expressed furious outrage and condemned Egypt for making a separate bilateral deal.",
    5: " Sadat's assassination was fueled by extremist outrage over peace with Israel."
  },
  'lesson_12': {
    1: " Operation Litani succeeded in pushing rocket launchers north beyond striking range.",
    3: " Christian Phalangist fighters entered the camps where up to 3,500 unarmed civilians were slain.",
    5: " In response, the United States opens direct dialogue with the PLO, and President Bush pressures Gulf coalition allies."
  },
  'lesson_13': {
    1: " The 1992 election resulted in the decisive defeat of the right-wing Likud government."
  }
};

const code = rawCode.replace(/^\s*export\s+default\s+/m, 'global.data = ');
const ctx = { global: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const data = ctx.global.data;

let totalUpdated = 0;

data.lessons.forEach(lesson => {
  const adds = precisionAdditions[lesson.id];
  if (!adds) return;
  
  Object.keys(adds).forEach(blockIdxStr => {
    const blockIdx = parseInt(blockIdxStr, 10) - 1;
    const block = lesson.narrative_blocks[blockIdx];
    const addText = adds[blockIdxStr];
    if (block && addText && !block.text.includes(addText.trim().slice(0, 25))) {
      block.text = block.text.trim() + " " + addText.trim();
      totalUpdated++;
    }
  });
});

console.log(`Applied ${totalUpdated} precision additions to units/cme_new/data.js.`);
const newFileContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(filePath, newFileContent, 'utf8');
console.log('Saved units/cme_new/data.js successfully.');

