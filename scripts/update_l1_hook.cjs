const fs = require('fs');

const oldHook = "The Middle East is the ultimate geopolitical crossroads of the earth—the physical land bridge connecting Europe, Asia, and Africa, the guardian of vital maritime chokepoints, and the birthplace of three world religions. To understand the bloody wars between Arabs and Israelis from 1945 to 1995, one must first understand its geography: how European diplomats drew straight ruler lines across deserts, why fresh water from the River Jordan is a matter of national survival, and why controlling the high ground of the Golan Heights or the narrow waters of the Straits of Tiran dictated the difference between victory and annihilation. How did imperial diplomacy and strategic geography lay the groundwork for fifty years of intractable conflict?";

const newHook = "The Middle East sits at the strategic crossroads of three continents, defined by vital waterways, rich oil reserves, and centuries of imperial rivalry. In the wake of the First World War, European diplomats drew artificial borders that divided Arab communities and promised conflicting homelands. How did imperial diplomacy and strategic geography lay the groundwork for fifty years of intractable conflict?";

['C:/Projects/the-history-revision-hub/units/cme_new/data.js', 'C:/Projects/the-history-revision-hub/public/units/cme_new/data.js'].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(oldHook, newHook);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated Lesson 1 hook in:', filePath);
});

