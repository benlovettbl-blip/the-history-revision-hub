const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const alignedBlocks = [
  {
    "id": "block_1",
    "decimal": "[2.1]",
    "title": "The Motte & Bailey Blitz (1066–1068)",
    "text": "<span class=\"para-ref\">[2.1]</span> When William was crowned on Christmas Day 1066, he faced an existential emergency: an invading elite of just ten thousand Normans had to subjugate and control a hostile conquered population of approximately two million Anglo-Saxons. William’s immediate military solution was an unprecedented blitz of <strong>Motte and Bailey</strong> castles across England. Built in just eight to fourteen days using forced Saxon labour, over <strong>500 Castles Built Fast</strong> established immediate military control. A steep earth mound—the <strong>High Earth Mounds</strong> (motte)—stood up to ten metres high, topped with a wooden watchtower keep, while below lay the bailey protected by <strong>Quick Timber Walls</strong> and a deep defensive ditch.",
    "image": "/images/motte_and_bailey_castle_diagram.jpg",
    "image_alt": "Motte and Bailey Castle Cutaway",
    "caption": "Reconstruction of an early Norman timber motte-and-bailey castle.",
    "theme_heading": "Military Architecture & Coercion",
    "sources": [
      {
        "id": "source_2_1",
        "title": "Motte-and-Bailey Castle Architecture",
        "url": "/images/motte_and_bailey_castle_diagram.jpg",
        "caption": "A steep artificial motte mound topped with a timber watchtower keep and surrounded by a palisaded bailey courtyard."
      }
    ]
  },
  {
    "id": "block_2",
    "decimal": "[2.2]",
    "title": "The Scorched-Earth Harrying of the North (1069–1070)",
    "text": "<span class=\"para-ref\">[2.2]</span> Where castles failed to deter rebellion, William deployed merciless state terror. In the winter of 1069, northern English <strong>Rebels Attack York</strong> and slaughtered the Norman garrison with Danish allies. William marched north in fury, ordering the systematic destruction of Yorkshire and the northern shires. Norman cavalry conducted total war by <strong>Burning Every Crop</strong>, slaughtering livestock, salting agricultural soil, and destroying farming tools. Chronicler Orderic Vitalis recorded that over <strong>100,000 Starve to Death</strong> in the ensuing famine, leaving vast areas entirely desolate and broken for over a generation.",
    "image": "/images/harrying_of_the_north_devastation_1069.jpg",
    "image_alt": "The Harrying of the North Devastation",
    "caption": "Depiction of Norman troops burning villages and crops across Yorkshire during the brutal winter campaign of 1069–1070.",
    "theme_heading": "State Terror & Pacification",
    "sources": [
      {
        "id": "source_2_2",
        "title": "Orderic Vitalis on the Harrying",
        "url": "/images/harrying_of_the_north_devastation_1069.jpg",
        "caption": "Anglo-Norman chronicler Orderic Vitalis condemned the brutal winter campaign where 100,000 people perished of cold and starvation."
      }
    ]
  },
  {
    "id": "block_3",
    "decimal": "[2.3]",
    "title": "Stone Keeps & Portchester Castle (1070–1100)",
    "text": "<span class=\"para-ref\">[2.3]</span> As Norman rule stabilized, temporary timber watchtowers were replaced with massive stone keeps to project permanent imperial dominance. Along the Hampshire coastline at Portchester Castle, the Normans ingeniously commandeered massive 3rd-century <strong>Ancient Roman Walls</strong>, constructing a formidable four-storey <strong>Thick Limestone Keep</strong> inside the Roman fort enclosure. The fortress guarded a <strong>Deep Warship Harbour</strong> in Portsmouth Harbour, securing William’s cross-Channel supply lines to Normandy and deterring French invasion fleets.",
    "image": "/images/portchester_castle_keep_roman_walls.jpg",
    "image_alt": "Portchester Castle Norman Keep",
    "caption": "Portchester Castle: The 12th-century limestone keep standing inside the surviving 3rd-century Roman Saxon Shore fort walls.",
    "theme_heading": "Imperial Stone Fortifications",
    "sources": [
      {
        "id": "source_2_3",
        "title": "Portchester Castle Landscape Survey",
        "url": "/images/portchester_castle_keep_roman_walls.jpg",
        "caption": "Portchester Castle demonstrated permanent Norman rule by incorporating Roman perimeter walls and building a stone keep."
      }
    ]
  },
  {
    "id": "block_4",
    "decimal": "[2.4]",
    "title": "The Great Domesday Book Audit (1085–1086)",
    "text": "<span class=\"para-ref\">[2.4]</span> Physical conquest had to be cemented by administrative surveillance. At Midwinter 1085, <strong>Fearing Viking Invasion</strong> by King Cnut IV of Denmark, William gathered his council at Gloucester and commissioned an exhaustive nationwide economic survey. Royal commissioners were sent across every English shire, <strong>Counting Every Cow and Pig</strong>, meadow, woodland, and mill, demanding oaths under threat of severe penalty. Completed in 1086, the Domesday Book ensured the Crown extracted maximum fiscal revenue, guaranteeing every landholder was <strong>Paying Every Penny in Tax</strong>.",
    "image": "/images/domesday_book_manuscript_1086.jpg",
    "image_alt": "Domesday Book Folio",
    "caption": "Parchment page from Great Domesday Book recording landholding, livestock, and taxable wealth in 1086.",
    "theme_heading": "Bureaucratic Fiscal Control",
    "sources": [
      {
        "id": "source_2_4",
        "title": "Domesday Book Folio (1086)",
        "url": "/images/domesday_book_manuscript_1086.jpg",
        "caption": "The Domesday survey catalogued every manor across England to ensure precise tax assessment and military obligations."
      }
    ]
  },
  {
    "id": "block_5",
    "decimal": "[2.5]",
    "title": "Feudal Hierarchy & Land Dispossession (1086)",
    "text": "<span class=\"para-ref\">[2.5]</span> The Domesday audit laid bare the most complete redistribution of land and power in English history. Local surveys such as the <strong>Hundred of Fareham Survey</strong> demonstrate how Anglo-Saxon thegns were systematically dispossessed. Virtually all <strong>English Landlords Kicked Out</strong> were replaced by approximately two hundred Norman tenants-in-chief as <strong>Barons Take the Manors</strong>. This created a rigid feudal pyramid: William held all land by divine right, leasing manors to Norman barons in exchange for military knights, binding the kingdom in a tight web of feudal vassalage.",
    "image": "/images/feudal_system_hierarchy_pyramid.jpg",
    "image_alt": "The Norman Feudal Pyramid",
    "caption": "The Feudal Hierarchy: Land held from the King by Tenants-in-Chief (Barons and Bishops), sub-infeudated to Knights and worked by unfree Villeins.",
    "theme_heading": "Social Transformation & Feudalism",
    "sources": [
      {
        "id": "source_2_5",
        "title": "Norman Feudal Hierarchy",
        "url": "/images/feudal_system_hierarchy_pyramid.jpg",
        "caption": "Diagram showing how Norman land confiscation established a strict military hierarchy from King to Baron to Villein."
      }
    ]
  }
];

// 1. Update data/medieval_england.json and public/data/medieval_england.json
['data/medieval_england.json', 'public/data/medieval_england.json'].forEach(rel => {
  const fp = path.join(ROOT, rel);
  if (fs.existsSync(fp)) {
    const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
    d.lessons[1].narrative_blocks = alignedBlocks;
    fs.writeFileSync(fp, JSON.stringify(d, null, 2), 'utf8');
    console.log(`✅ Updated narrative_blocks in ${rel}`);
  }
});

// 2. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(rel => {
  const fp = path.join(ROOT, rel);
  if (fs.existsSync(fp)) {
    const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const target = d.units ? d.units.medieval_england : d.medieval_england;
    if (target && target.lessons && target.lessons[1]) {
      target.lessons[1].narrative_blocks = alignedBlocks;
      fs.writeFileSync(fp, JSON.stringify(d, null, 2), 'utf8');
      console.log(`✅ Updated narrative_blocks in ${rel}`);
    }
  }
});

console.log('\n🎉 Medieval England Lesson 2 narrative blocks perfectly aligned to the 5 workbook stages!');

