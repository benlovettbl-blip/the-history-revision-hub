const fs = require('fs');
const wb = fs.readFileSync('c:/Users/fives/the-history-revision-hub/units/medieval_england/pupil_workbook.html', 'utf8');

const regex = /<span class="stage-question-text"[^>]*>([\s\S]*?)<\/span>/gi;
let match;
let count = 0;
while ((match = regex.exec(wb)) !== null) {
  count++;
  if (count >= 6 && count <= 10) {
    console.log(`L2 Stage ${count - 5}: ${match[1].trim()}`);
  }
}

