const fs = require('fs');
const content = fs.readFileSync('public/interactive_mats/viewer.html', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);

lines.forEach((line, idx) => {
  if (line.includes('loadCurriculumData') || line.includes('model_answer') || line.includes('Empire Windrush')) {
    console.log(`Line ${idx + 1}: ${line.slice(0, 120)}`);
  }
});

