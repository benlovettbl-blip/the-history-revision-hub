const fs = require('fs');

['C:/Projects/the-history-revision-hub/units/cme_new/data.js', 'C:/Projects/the-history-revision-hub/public/units/cme_new/data.js'].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    '"question": "How did permanent Israeli settlements transform the occupied territories?"',
    '"question": "How did refugee displacement and military administration transform the occupied territories?"'
  );

  content = content.replace(
    '"exam_link": "Q1 Consequence: Created permanent Jewish settlements in Palestinian territory, which became a major barrier to a two-state solution."',
    '"exam_link": "Q1 Consequence: Displaced over 300,000 Palestinian refugees into Jordan and established direct IDF military administration over the West Bank and Gaza."'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated domino spine banner in:', filePath);
});

