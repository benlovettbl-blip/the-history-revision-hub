const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const units = ['edexcel_medicine', 'weimar_nazi_germany'];

// Regex matching trailing retrieval parentheticals
const trailingLabelRegex = /\s*\((Last Lesson|Last Week|Prior Topic|Prior Unit|Earlier in Unit|Last Term|Last Year|Synoptic|Immediate Previous Lesson|Prior Learning|Foundational Context)\)\s*$/i;

let totalCleaned = 0;

for (const unitId of units) {
  const filePath = path.join(root, 'units', unitId, 'data.js');
  const pubFilePath = path.join(root, 'public', 'units', unitId, 'data.js');
  
  if (!fs.existsSync(filePath)) continue;

  const raw = fs.readFileSync(filePath, 'utf8');
  const jsonStr = raw.replace(/^export\s+default\s+/, '').replace(/;?\s*$/, '');
  const data = JSON.parse(jsonStr);

  let unitCleaned = 0;

  if (data.lessons) {
    for (const l of data.lessons) {
      if (l.do_now && l.do_now.items) {
        for (const item of l.do_now.items) {
          if (item.question && trailingLabelRegex.test(item.question)) {
            item.question = item.question.replace(trailingLabelRegex, '').trim();
            unitCleaned++;
            totalCleaned++;
          }
        }
      }
    }
  }

  const updatedContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  fs.writeFileSync(pubFilePath, updatedContent, 'utf8');
  console.log(`Cleaned ${unitCleaned} questions in ${unitId}.`);
}

console.log(`Total questions cleaned across all units: ${totalCleaned}`);

