const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'units', 'eee', 'data.js');
let content = fs.readFileSync(dataFilePath, 'utf8');

const replacements = [
  {
    target: "that would define England's religious identity for centuries.",
    replacement: "that would define England's religious identity for centuries. How successfully did Elizabeth's 1559 Religious Settlement reconcile deep divisions between Catholics and Puritans while establishing royal supremacy?"
  },
  {
    target: "a captive queen who instantly became a magnetic lightning rod for Catholic rebellion.",
    replacement: "a captive queen who instantly became a magnetic lightning rod for Catholic rebellion. Why did the arrival of Mary, Queen of Scots pose such a dangerous dynastic threat to Elizabeth's security and the stability of Protestant England?"
  },
  {
    target: "directly into the heart of Spain's naval empire: the legendary raid on Cadiz harbour.",
    replacement: "directly into the heart of Spain's naval empire: the legendary raid on Cadiz harbour. Why did English intervention in the Netherlands and Drake's raid on Cadiz make full-scale war with Philip II's Spain inevitable?"
  },
  {
    target: "drifting fireships, and raging storms, England fought an existential battle for survival.",
    replacement: "drifting fireships, and raging storms, England fought an existential battle for survival. What were the decisive reasons why the Spanish Armada was defeated in 1588, and how did this victory reshape English national identity?"
  },
  {
    target: "branding irons to England's first nationwide system of state-enforced welfare.",
    replacement: "branding irons to England's first nationwide system of state-enforced welfare. Why did poverty and vagrancy escalate so rapidly in Elizabethan England, and how did the government's approach shift from punishment to state welfare?"
  },
  {
    target: "Elizabethan mariners transformed England into a global seafaring superpower.",
    replacement: "Elizabethan mariners transformed England into a global seafaring superpower. How did navigational breakthroughs and commercial rivalry drive English voyages of exploration and Drake's circumnavigation of the globe?"
  },
  {
    target: "culminating in the chilling, unsolved disappearance of the 'Lost Colony'.",
    replacement: "culminating in the chilling, unsolved disappearance of the 'Lost Colony'. Why did Walter Raleigh's attempts to establish a permanent English colony at Roanoke Island end in catastrophic failure?"
  }
];

let totalReplacements = 0;
replacements.forEach((r, idx) => {
  const count = (content.split(r.target).length - 1);
  if (count === 0) {
    console.error(`Target ${idx + 1} not found!`);
  } else {
    content = content.replaceAll(r.target, r.replacement);
    totalReplacements += count;
    console.log(`Target ${idx + 1}: replaced ${count} occurrence(s)`);
  }
});

if (totalReplacements >= 7) {
  fs.writeFileSync(dataFilePath, content, 'utf8');
  console.log(`✅ Successfully updated EEE blurbs with ${totalReplacements} replacements!`);
} else {
  console.error(`❌ Only replaced ${totalReplacements} times. Aborting.`);
  process.exit(1);
}

