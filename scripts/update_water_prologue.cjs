const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'units', 'water_and_sanitation', 'data.js');
let content = fs.readFileSync(dataFilePath, 'utf8');

const replacements = [
  {
    target: "it exposed the tragic divide between medieval hygiene efforts and the limits of medical understanding.",
    replacement: "it exposed the tragic divide between medieval hygiene efforts and the limits of medical understanding. Did medieval public health collapse because town councils lacked the resources to act, or because mistaken medical beliefs like miasma blinded them to the real causes of disease?"
  },
  {
    target: "trapped between Renaissance innovation and medieval squalor.",
    replacement: "trapped between Renaissance innovation and medieval squalor. Why did rapid urban population growth make Early Modern towns filthier, and why did brilliant inventions like the flushing toilet fail to improve public health?"
  },
  {
    target: "to finally force the government to act and commission Sir Joseph Bazalgette’s brick revolution.",
    replacement: "to finally force the government to act and commission Sir Joseph Bazalgette’s brick revolution. Did the British government commission Sir Joseph Bazalgette’s sewer network out of compassion for the working class, or out of terror when the Great Stink reached the Palace of Westminster?"
  },
  {
    target: "permanently defeating epidemic cholera in Britain.",
    replacement: "permanently defeating epidemic cholera in Britain. Was epidemic cholera finally defeated by Dr John Snow’s epidemiological detective work, Pasteur’s Germ Theory, or the compulsory powers of the 1875 Public Health Act?"
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

if (matchCount === 4) {
  fs.writeFileSync(dataFilePath, content, 'utf8');
  console.log('✅ Successfully updated all 4 prologue entries in water_and_sanitation/data.js');
} else {
  console.error(`❌ Only matched ${matchCount}/4 targets! Aborting.`);
  process.exit(1);
}
