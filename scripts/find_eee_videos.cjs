const { searchYouTube } = require('./search_youtube_real.cjs');
const fs = require('fs');
const path = require('path');

const queries = [
  // L1: Accession 1558
  { lesson: 1, q: "Simple History Elizabeth I Accession 1558" },
  { lesson: 1, q: "Elizabeth I problems facing accession 1558 GCSE History" },
  { lesson: 1, q: "Elizabeth I coronation 1559 royal court patronage" },

  // L2: Religious Settlement 1559
  { lesson: 2, q: "Religious Settlement 1559 Elizabeth Act of Supremacy Uniformity" },
  { lesson: 2, q: "Simple History Elizabeth Religious Settlement 1559" },
  { lesson: 2, q: "Elizabeth Middle Way Act of Uniformity 1559 GCSE" },

  // L3: Challenges to Settlement
  { lesson: 3, q: "Puritan challenge vestments controversy Elizabeth GCSE" },
  { lesson: 3, q: "Papal Bull 1570 Regnans in Excelsis excommunication Elizabeth" },
  { lesson: 3, q: "Catholic challenge seminary priests Edmund Campion Elizabeth" },

  // L4: Mary Queen of Scots
  { lesson: 4, q: "Simple History Mary Queen of Scots England captivity" },
  { lesson: 4, q: "Mary Queen of Scots arrival in England 1568 Casket Letters" },
  { lesson: 4, q: "Problem of Mary Queen of Scots Elizabeth I GCSE History" },

  // L5: Plots and Revolts
  { lesson: 5, q: "Revolt of the Northern Earls 1569 GCSE History" },
  { lesson: 5, q: "Simple History Babington Plot 1586 Walsingham cipher" },
  { lesson: 5, q: "Francis Walsingham spy network Mary Queen of Scots execution" },

  // L6: Relations with Spain 1569-1585
  { lesson: 6, q: "Francis Drake privateering Spanish Main Cadiz San Juan de Ulua" },
  { lesson: 6, q: "Spain England commercial rivalry Netherlands Drake GCSE" },
  { lesson: 6, q: "Treaty of Joinville 1584 Philip II Elizabeth Spain" },

  // L7: Outbreak of War 1585-1588
  { lesson: 7, q: "Treaty of Nonsuch 1585 Robert Dudley Netherlands Elizabeth" },
  { lesson: 7, q: "Drake singeing King of Spain beard Cadiz 1587" },
  { lesson: 7, q: "Outbreak of war with Spain 1585 Cadiz raid GCSE History" },

  // L8: Spanish Armada 1588
  { lesson: 8, q: "Simple History Spanish Armada 1588" },
  { lesson: 8, q: "Battle of Gravelines 1588 fireships Calais Spanish Armada" },
  { lesson: 8, q: "Spanish Armada defeat crescent formation Tilbury speech" },

  // L9: Education and Leisure
  { lesson: 9, q: "Elizabethan education grammar schools literacy GCSE History" },
  { lesson: 9, q: "Elizabethan theatre Globe Theatre groundlings pastimes" },
  { lesson: 9, q: "Elizabethan leisure sports bear baiting football hunting" },

  // L10: Poverty and Vagrancy
  { lesson: 10, q: "Elizabethan Poor Law 1572 1576 vagrancy enclosure" },
  { lesson: 10, q: "Causes of poverty Elizabethan England idle poor deserving poor" },
  { lesson: 10, q: "Simple History Elizabethan Poor Law 1601 vagabonds" },

  // L11: Exploration
  { lesson: 11, q: "Francis Drake circumnavigation 1577 1580 Golden Hind" },
  { lesson: 11, q: "Elizabethan exploration navigation astrolabe compass trade routes" },
  { lesson: 11, q: "Simple History Francis Drake circumnavigation" },

  // L12: Roanoke & Virginia
  { lesson: 12, q: "Walter Raleigh Roanoke colony Virginia 1585 1587" },
  { lesson: 12, q: "The Lost Colony of Roanoke mystery Walter Raleigh" },
  { lesson: 12, q: "Why did the Roanoke colony fail Walter Raleigh GCSE" }
];

async function run() {
  console.log(`Searching real YouTube videos for ${queries.length} EEE queries...`);
  const results = [];

  for (const item of queries) {
    console.log(`\nSearching for L${item.lesson}: "${item.q}"...`);
    const found = await searchYouTube(item.q);
    console.log(`  Found ${found.length} verified candidates.`);
    if (found.length > 0) {
      results.push({
        lesson: item.lesson,
        query: item.q,
        topVideo: found[0],
        allVideos: found.slice(0, 3)
      });
      console.log(`  -> Selected: [${found[0].id}] ${found[0].duration} | "${found[0].title}" (${found[0].author})`);
    }
    await new Promise(r => setTimeout(r, 400));
  }

  fs.writeFileSync(path.join(__dirname, 'eee_discovered_videos.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nDiscovered videos saved to scripts/eee_discovered_videos.json!`);
}

run();

