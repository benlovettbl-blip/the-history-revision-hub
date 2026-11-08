const fs = require('fs');
const viewer = fs.readFileSync('public/interactive_mats/viewer.html', 'utf8');

const lines = viewer.split('\n');
lines.forEach((l, i) => {
  if (l.includes('currentWritingStudioTasks =') || l.includes('currentWritingStudioTasks=')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
    // print 15 lines before and after
    for (let j = Math.max(0, i - 15); j <= Math.min(lines.length - 1, i + 25); j++) {
      console.log(`  ${j+1}: ${lines[j]}`);
    }
  }
});

