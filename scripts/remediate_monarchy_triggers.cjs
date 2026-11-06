const fs = require('fs');
const vm = require('vm');

const filePath = 'units/monarchy_religion_power/data.js';
const rawCode = fs.readFileSync(filePath, 'utf8');

const additionsPerLesson = {
  'lesson_1': {
    1: " Martin Luther attacked the corrupt sale of indulgences, where ordinary sinners were paying for forgiveness; in response, the young Henry VIII wrote Assertio Septem Sacramentorum, earning the Defender of the Faith title from the Pope.",
    2: " Henry VIII faced a dynastic crisis driven by the desperate need for a son to secure the Tudor throne; he cited a Bible warning on marriage from Leviticus declaring that marrying a dead brother's wife would leave the union childless.",
    3: " In 1527, troops of Holy Roman Emperor Charles V attacks Rome, leaving the Pope held prisoner in the Castel Sant'Angelo, so the legatine church trial was cancelled and revoked to Rome.",
    4: " Advised by Thomas Cromwell, Henry mounted pressure by threatening church fines through praemunire, stopping taxes to Rome (annates), and banning appeals to the Pope under the 1533 Act in Restraint of Appeals.",
    5: " The 1534 Act of Supremacy made Henry Supreme Head of the Church of England, breaking ties with Rome and enforcing forced treason oaths under the Treason Act that led to the executions of Thomas More and John Fisher."
  },
  'lesson_2': {
    1: " Elizabeth I inherited a divided realm consumed by fierce religious hatred between Catholics and Protestants, made more urgent by the return of strict Puritans exiled under Mary Tudor.",
    2: " The 1559 Act of Supremacy made Elizabeth Supreme Governor, requiring loyalty oaths for priests while sacking Catholic bishops who refused to acknowledge royal supremacy.",
    3: " The 1559 Act of Uniformity introduced one shared prayer book with clever compromise wording for communion, imposing Sunday church fines of 12d on recusants who stayed away.",
    4: " Deep divisions persisted: recusant gentry celebrated secret Catholic mass in manor houses, and in 1570, Pope Pius V's bull Regnans in Excelsis orders Elizabeth deposed as a heretic.",
    5: " Walsingham's spy network uncovered the 1586 Babington Plot via letters hidden in beer barrels; the cipher secret code was broken, leading directly to Mary Queen of Scots' execution."
  },
  'lesson_3': {
    1: " Anglo-Spanish rivalry intensified over religious war, English help for Dutch rebels under the Treaty of Nonsuch, Francis Drake stealing Spanish gold on the Spanish Main, and Mary Queen of Scots beheaded in 1587.",
    2: " In 1587, Drake's raid on Cadiz ('singeing the King of Spain's beard') involved burning food barrels; unseasoned stave barrels left rotten water and bread, ensuring the fleet was held back for a year.",
    3: " In July 1588, Philip II dispatched 130 ships in a crescent line sailing up the English Channel, while Lord Howard and Drake shadowed them, firing cannons from afar beyond boarding range.",
    4: " Off Calais, the English launched eight burning ghost ships (fireships) into the Spanish anchorage, causing crews cutting anchor ropes in panic and scattering in the dark.",
    5: " At the Battle of Gravelines, English gunners closed in, blasting wooden hulls with rapid broadsides, before severe gales drove retreating galleons toward shipwrecks on Irish rocks."
  },
  'lesson_4': {
    1: " Charles I ruled for eleven years without Parliament (Personal Rule), using medieval expedients like Ship Money; Buckinghamshire MP John Hampden refuses to pay, making the tax a national symbol of royal tyranny.",
    2: " The crisis boiled over in January 1642 when armed royal guards raid the Commons to arrest Five Members; failing, the King raises his war flag at Nottingham in August 1642, beginning the Civil War.",
    3: " Parliament created the New Model Army, fielding full-time paid redcoats under Thomas Fairfax and Oliver Cromwell; at the Battle of Naseby (1645), Cromwell's cavalry charges routed and captured the royalists.",
    4: " After Pride's Purge saw the army kicks out moderate MPs, the remaining Rump Parliament put the King on trial for treason, culminating in the public execution of Charles I outside Banqueting House in 1649.",
    5: " After the Restoration, the 1688 Glorious Revolution saw a Dutch army lands at Torbay; James II flees the country, leading William and Mary to sign the 1689 Bill of Rights, leaving the monarch bound by the law."
  },
  'lesson_5': {
    1: " Under Henry VIII, the Pope lost all English power, new laws were made with MPs in the Reformation Parliament, and vast monastery lands were given away or sold to gentry supporters.",
    2: " Elizabeth’s Middle Way created a compromise for both sides, while fines for missing church penalized recusants, and national identity was united by the Armada victory in 1588.",
    3: " The Stuart belief in the Divine Right of Kings meant kings claim only God rules them; Charles I levied illegal taxes without votes and sparked crisis when the Scots rebel against English prayer rules.",
    4: " During the Civil War, Parliament's citizen army beat the King, leading to the regicide, a Commonwealth republic, and abolishing the House of Lords.",
    5: " The 1689 Bill of Rights confirmed that the King cannot cancel laws, enforced no taxes without MP votes, and established a constitutional contract with new rulers."
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

console.log(`Updated ${totalUpdated} narrative blocks in units/monarchy_religion_power/data.js.`);
const newFileContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(filePath, newFileContent, 'utf8');
console.log('Saved units/monarchy_religion_power/data.js successfully.');

