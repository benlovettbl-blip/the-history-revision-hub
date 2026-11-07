const { execSync } = require('child_process');

const commits = ['HEAD~10', 'HEAD~50', 'HEAD~100', 'dd0bedf1', '8c08101e'];

commits.forEach(commit => {
  try {
    const txt = execSync(`git show ${commit}:units/cme_new/data.js`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    console.log(`\n=== COMMIT ${commit} ===`);
    const lessonMatches = txt.matchAll(/"id":\s*"([^"]+)",\s*[^}]*?"title":\s*"([^"]+)"/gs);
    let count = 0;
    for (const m of lessonMatches) {
      if (m[1].startsWith('lesson')) {
        console.log(`  ${m[1]} -> ${m[2]}`);
        count++;
      }
    }
    if (count === 0) {
      // try line-by-line
      const lines = txt.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('"id": "lesson_') || lines[i].includes('id: "lesson_') || lines[i].includes('id: \'lesson_')) {
          console.log(`  Line ${i}: ${lines[i].trim()} | ${lines[i+1] ? lines[i+1].trim() : ''}`);
        }
      }
    }
  } catch (e) {
    console.log(`Error on commit ${commit}: ${e.message}`);
  }
});

