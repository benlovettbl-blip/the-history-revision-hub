const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'units', 'edexcel_medicine', 'data.js');
let content = fs.readFileSync(dataFilePath, 'utf8');

const replacements = [
  {
    target: "This is the profound paradox of the Renaissance.",
    replacement: "This is the profound paradox of the Renaissance. Why did revolutionary scientific ideas and anatomy fail to immediately transform everyday medical treatments during the Renaissance?"
  },
  {
    target: "to finally smash two thousand years of superstition and bad smells.",
    replacement: "to finally smash two thousand years of superstition and bad smells. How did Pasteur's Germ Theory and Koch's bacteriological discoveries finally dismantle the ancient theory of miasma?"
  },
  {
    target: "sprouting cow heads and cloven hooves.",
    replacement: "sprouting cow heads and cloven hooves. Why did Edward Jenner's discovery of the smallpox vaccine face such fierce initial opposition from doctors and the public?"
  },
  {
    target: "permanently transforming hospital architecture and turning nursing into a respected medical science.",
    replacement: "permanently transforming hospital architecture and turning nursing into a respected medical science. How did Florence Nightingale and the sanitary movement transform British hospital conditions and professionalise nursing?"
  },
  {
    target: "to conquer the invisible army of wound infection.",
    replacement: "to conquer the invisible army of wound infection. How did James Simpson's use of chloroform and Joseph Lister's introduction of antiseptics overcome the dual barriers of pain and infection?"
  },
  {
    target: "to finally force the British state to abandon laissez-faire and build London’s underground sewers.",
    replacement: "to finally force the British state to abandon laissez-faire and build London’s underground sewers. How did John Snow's investigation of cholera and the Great Stink compel the British government to abandon laissez-faire?"
  },
  {
    target: "transforming medicine from passive symptom management into predictive, personalized genomic science.",
    replacement: "transforming medicine from passive symptom management into predictive, personalized genomic science. How did the discovery of the structure of DNA and the Human Genome Project revolutionize modern understanding of the causes of disease?"
  },
  {
    target: "allowed physicians to peer deep inside living organs without a single surgical incision.",
    replacement: "allowed physicians to peer deep inside living organs without a single surgical incision. How did 20th-century diagnostic technologies and awareness of lifestyle factors transform preventive healthcare?"
  },
  {
    target: "providing free medical care at the point of delivery for every citizen.",
    replacement: "providing free medical care at the point of delivery for every citizen. How did the development of magic bullets and the foundation of the NHS in 1948 democratise medical care across Britain?"
  },
  {
    target: "saved millions of Allied soldiers and launched the Golden Age of Antibiotics.",
    replacement: "saved millions of Allied soldiers and launched the Golden Age of Antibiotics. Why did Alexander Fleming's initial discovery of penicillin require the industrial mass-production of Florey and Chain during the Second World War?"
  },
  {
    target: "while oncologists developed CT screening, robotic surgery, and immunotherapy.",
    replacement: "while oncologists developed CT screening, robotic surgery, and immunotherapy. How did government anti-smoking legislation and modern diagnostic technology combine in the fight against lung cancer?"
  },
  {
    target: "where every geological feature dictated life, death, and casualty evacuation.",
    replacement: "where every geological feature dictated life, death, and casualty evacuation. How did the geography and terrain of the Western Front create unprecedented logistical challenges for medical personnel?"
  },
  {
    target: "maintaining the physical health of an army in the trenches demanded ruthless preventive medical discipline.",
    replacement: "maintaining the physical health of an army in the trenches demanded ruthless preventive medical discipline. How did the trench environment cause debilitating conditions like trench foot and trench fever, and how were they treated?"
  },
  {
    target: "spawning lethal gas gangrene and tetanus within hours of injury.",
    replacement: "spawning lethal gas gangrene and tetanus within hours of injury. Why were shrapnel injuries, poison gas, and wound infections such lethal threats to British soldiers on the Western Front?"
  },
  {
    target: "every hour saved in transit was the difference between life and death.",
    replacement: "every hour saved in transit was the difference between life and death. How did the Chain of Evacuation function under intense shellfire to treat and transport wounded soldiers?"
  },
  {
    target: "trauma medicine through brilliant mechanical engineering, chemical irrigation, and mobile radiology.",
    replacement: "trauma medicine through brilliant mechanical engineering, chemical irrigation, and mobile radiology. How did the Thomas Splint and mobile X-ray units drastically reduce battlefield mortality rates during the war?"
  },
  {
    target: "and Harold Gillies sculpted entirely new living faces at Sidcup.",
    replacement: "and Harold Gillies sculpted entirely new living faces at Sidcup. How did wartime necessity drive revolutionary breakthroughs in blood transfusions, brain surgery, and plastic reconstruction?"
  }
];

let matchCount = 0;
replacements.forEach((r, idx) => {
  if (content.includes(r.target)) {
    content = content.replace(r.target, r.replacement);
    matchCount++;
  } else {
    console.error(`Target ${idx + 1} not found!`);
  }
});

if (matchCount === 17) {
  fs.writeFileSync(dataFilePath, content, 'utf8');
  console.log(`✅ Successfully updated all 17 hook_text entries in edexcel_medicine/data.js`);
} else {
  console.error(`❌ Only matched ${matchCount}/17 targets! Aborting.`);
  process.exit(1);
}

