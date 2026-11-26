/**
 * scripts/render_ks2_stone_to_iron_age_spine_workbook.cjs
 *
 * KEY STAGE 2 STONE AGE TO IRON AGE BRITAIN (c. 800,000 BC–AD 43)
 * Edition B: KS3-Style Structured Spine Pupil Workbook (16 Pages • 4 Folded A3 Sheets)
 */

const { compileKs2SpineWorkbook, buildSpineWorkbookHtml } = require('./components/build_ks2_6lesson_spine_workbook.cjs');

const SPEC = {
  unitId: 'ks2_stone_to_iron_age',
  docTitle: 'KS2 Stone Age to Iron Age Britain (c. 800,000 BC–AD 43)',
  versoHeaderRight: 'KS2 HISTORY &bull; STONE AGE TO IRON AGE (c. 800,000 BC–AD 43)',
  cover: {
    kickerPill: 'Key Stage 2 Prehistoric Britain &bull; c. 800,000 BC–AD 43 &bull; Wide-Ruled Edition',
    mainTitle: 'Stone Age to Iron Age Britain',
    bigQuestion: 'How did life in Britain change from Ice Age hunter-gatherers to Iron Age hillfort builders?',
    imagePath: '/units/ks2_stone_to_iron_age/assets/banner_unit_hero.jpg',
    imageAlt: 'Summer solstice sunrise shining directly between the giant Neolithic sarsen trilithons at Stonehenge, Wiltshire',
    objectPosition: 'center 52%',
    cluesHeading: '3 Clues to Spot at Stonehenge',
    clues: [
      'Giant upright sarsen stones topped with horizontal stone lintels (trilithons).',
      'Sunrise shining directly between the stones on the midsummer solstice.',
      'Raised without cranes, wheels, or metal tools over 4,500 years ago.',
    ],
    thinkQuestion: 'How can historians uncover prehistoric lives when people left zero written books behind?',
    captionLeft: 'Summer Solstice Sunrise Through the Sarsen Trilithons at Stonehenge, Wiltshire',
    captionRight: 'STONEHENGE, WILTSHIRE &bull; CC BY-SA 2.0',
  },
  lessons: [
    {
      lessonNum: 1,
      taskA: {
        badge: 'SURVIVAL & CLIMATE',
        question: 'How did flint tools and fire help Ice Age families survive, and why did Doggerland sink beneath the North Sea?',
        connectives: 'During the freezing Ice Age,... &bull; By knapping sharp flint,... &bull; After 10,000 BC, melting ice... &bull; Around 6500 BC,...',
        keyTerms: 'Palaeolithic &bull; knapping &bull; flint handaxes &bull; Cheddar Man &bull; Star Carr &bull; Doggerland',
      },
      taskB: {
        connectives: 'At first, nomadic hunters... &bull; When forests warmed,... &bull; Finally, rising seas... &bull; Overall,...',
        keyTerms: 'mammoths &bull; Creswell Crags &bull; Mesolithic &bull; red-deer masks &bull; North Sea &bull; island',
      },
      leftQuip: 'At Happisburgh in Norfolk, archaeologists found 850,000-year-old footprints pressed into mud — the oldest human prints outside Africa.',
      rightQuip: 'Modern fishing trawlers in the North Sea still haul up mammoth teeth and bone harpoons from sunken Doggerland.',
    },
    {
      lessonNum: 2,
      taskA: {
        badge: 'ARCHAEOLOGY & SETTLEMENT',
        question: 'What did the great storm of 1850 uncover inside the stone houses of Skara Brae in Orkney?',
        connectives: 'Around 4000 BC, newcomers brought... &bull; In 1850, a fierce storm... &bull; Inside each cosy stone house,... &bull; This proves...',
        keyTerms: 'Neolithic &bull; agriculture &bull; Skara Brae &bull; Orkney &bull; stone dressers &bull; central hearth',
      },
      taskB: {
        connectives: 'Before farming arrived,... &bull; Growing wheat and barley meant... &bull; Villagers also built... &bull; As a result,...',
        keyTerms: 'permanent villages &bull; flint sickles &bull; pottery &bull; Skara Brae &bull; West Kennet Long Barrow &bull; ancestors',
      },
      leftQuip: 'Skara Brae’s sunken stone houses in Orkney are older than the Great Pyramids of Egypt — and still have their stone beds and dressers.',
      rightQuip: 'West Kennet Long Barrow in Wiltshire held the bones of nearly fifty Neolithic villagers honoured over many generations.',
    },
    {
      lessonNum: 3,
      taskA: {
        badge: 'ENGINEERING & BELIEF',
        question: 'How did Neolithic builders quarry, haul, and lock giant Welsh bluestones and 25-tonne sarsen stones together at Stonehenge?',
        connectives: 'Around 3000 BC, workers dug... &bull; From the Preseli Hills in Wales,... &bull; Next, 25-tonne sarsens were... &bull; Builders locked lintels using...',
        keyTerms: 'red-deer antler picks &bull; bluestones &bull; Preseli Hills &bull; sarsen trilithons &bull; mortise-and-tenon joints &bull; Durrington Walls',
      },
      taskB: {
        connectives: 'Stonehenge took centuries because... &bull; Nearby at Durrington Walls,... &bull; Aligning the Heel Stone with... &bull; Overall,...',
        keyTerms: 'henge &bull; wooden sledges &bull; Heel Stone &bull; summer &amp; winter solstice &bull; midwinter feasts &bull; sacred calendar',
      },
      leftQuip: 'Stonehenge builders shaped mortise-and-tenon stone joints — just like Lego bumps and sockets — using heavy stone hammer-balls.',
      rightQuip: 'Pig bones at Durrington Walls show families travelled from as far away as Scotland for huge midwinter feasts near Stonehenge.',
    },
    {
      lessonNum: 4,
      taskA: {
        badge: 'TECHNOLOGY & TRADE',
        question: 'How did Bronze Age smiths smelt copper and Cornish tin to cast tough bronze axes, and what did the Amesbury Archer’s grave reveal?',
        connectives: 'Around 2400 BC, Beaker newcomers... &bull; Pure copper was soft, so... &bull; Pouring molten bronze into... &bull; Near Stonehenge, the Amesbury Archer...',
        keyTerms: 'Beaker people &bull; smelting &bull; copper &amp; Cornish tin &bull; stone moulds &bull; Amesbury Archer &bull; Alps',
      },
      taskB: {
        connectives: 'Metalworking transformed Britain because... &bull; Unlike chipped flint,... &bull; Long-distance trade also brought... &bull; Consequently,...',
        keyTerms: 'cast bronze axes &bull; Great Orme mines &bull; gold lunula &bull; Mold Gold Cape &bull; status &bull; European trade',
      },
      leftQuip: 'Tooth-enamel tests proved the Amesbury Archer — buried with gold hair-wraps three miles from Stonehenge — grew up near the Alps!',
      rightQuip: 'Mixing nine parts copper with one part Cornish tin created bronze: tough enough to fell oak forests and recyclable when melted down.',
    },
    {
      lessonNum: 5,
      taskA: {
        badge: 'PRESERVATION & DAILY LIFE',
        question: 'Why did Must Farm earn the nickname "Britain’s Pompeii", and what everyday objects survived in the oxygen-free river mud?',
        connectives: 'Around 900 BC, families built... &bull; Suddenly, a fierce fire... &bull; Because everything splashed into wet silt,... &bull; Archaeologists uncovered...',
        keyTerms: 'Must Farm &bull; wooden stilts &bull; oxygen-free mud &bull; lime-bast cloth &bull; porridge bowls &amp; spoons &bull; wooden wheel',
      },
      taskB: {
        connectives: 'Usually, wooden homes rot away, but... &bull; Inside Must Farm’s roundhouses,... &bull; Beyond the fens, oak boats... &bull; Altogether, this proves...',
        keyTerms: 'waterlogged &bull; Bronze Age axes &bull; glass beads &bull; Britain’s oldest wheel &bull; Dover Bronze Age Boat &bull; Channel trade',
      },
      leftQuip: 'At Must Farm in Cambridgeshire, clay bowls still held the charred remains of a Bronze Age meal with wooden spoons resting inside!',
      rightQuip: 'The Dover Bronze Age Boat (c. 1550 BC) was stitched together from oak planks using twisted yew branches and waterproof moss.',
    },
    {
      lessonNum: 6,
      taskA: {
        badge: 'DEFENCE & CRAFTSMANSHIP',
        question: 'Why did Iron Age tribes build giant earth ramparts at hillforts like Maiden Castle, and what do torcs and coins prove about Celtic Britain?',
        connectives: 'After 800 BC, blacksmiths forged... &bull; As rival tribes grew richer,... &bull; Giant hillforts like Maiden Castle... &bull; Fine treasures such as...',
        keyTerms: 'iron ploughshares &bull; rotary quern &bull; hillfort &bull; Maiden Castle ramparts &bull; Snettisham Gold Torc &bull; Celtic coins',
      },
      taskB: {
        connectives: 'Iron tools changed farming by... &bull; Across Britain, Celtic tribes... &bull; Skilled smiths and merchants also... &bull; By AD 43,...',
        keyTerms: 'blacksmiths &bull; roundhouses &bull; Iceni &amp; Brigantes &bull; hillforts &bull; Battersea Shield &bull; Roman Empire',
      },
      leftQuip: 'A rotary quern stone saved Iron Age families hours of daily grinding, turning grain into flour far faster than Stone Age saddle querns.',
      rightQuip: 'The Snettisham Great Torc was twisted from eight gold ropes made of sixty-four fine wires — proving dazzling Celtic metalwork before Rome arrived.',
    },
  ],
  centrefold: {
    part1KickerRight: 'KEY STAGE 2 &bull; PART 1 ANCHORS (c. 800,000–2200 BC)',
    part1Heading: 'Stone Age Hunters, First Farmers &amp; Giant Stonehenge',
    part1CueHint: 'Climate &amp; Tools to the left &bull; Settlements &amp; Monuments to the right',
    part1ContinueLabel: 'Timeline Spine Continues to Bronze Age Metal, Must Farm &amp; Iron Age Hillforts (Page 9)',
    part1FooterQuip: 'Stone Age to Iron Age Britain (c. 800,000 BC–AD 43) &bull; Centrefold Mind-Map Spine (Part 1).',
    part2KickerRight: 'KEY STAGE 2 &bull; PART 2 ANCHORS (c. 2500 BC–AD 43)',
    part2Heading: 'Beaker Bronze, Must Farm &amp; Iron Age Hillforts',
    part2CueHint: 'Metalworking &amp; Trade to the left &bull; Villages, Hillforts &amp; Art to the right',
    part2CompleteLabel: 'Stone Age to Iron Age Mind-Map Spine Complete (c. 800,000 BC–AD 43)',
    part2FooterQuip: 'Stone Age to Iron Age Britain (c. 800,000 BC–AD 43) &bull; Centrefold Mind-Map Spine (Part 2).',
    spineLeft: [
      {
        date: 'c. 800,000–4000 BC',
        title: 'Ice Age Hunters &amp; Doggerland',
        enq: 'Enq 1',
        leftCue: '◂ Flint Axes, Fire &amp; Star Carr',
        rightCue: 'Doggerland Floods c. 6500 BC ▸',
      },
      {
        date: 'c. 4000–2500 BC',
        title: 'First Farmers &amp; Skara Brae',
        enq: 'Enq 2',
        leftCue: '◂ Crops, Herds &amp; Sickles',
        rightCue: 'Skara Brae &amp; Long Barrows ▸',
      },
      {
        date: 'c. 3000–2200 BC',
        title: 'Building Giant Stonehenge',
        enq: 'Enq 3',
        leftCue: '◂ Welsh Bluestones &amp; Sarsens',
        rightCue: 'Solstice Sun &amp; Winter Feasts ▸',
      },
    ],
    spineRight: [
      {
        date: 'c. 2500–1200 BC',
        title: 'Beaker People &amp; Bronze Age',
        enq: 'Enq 4',
        leftCue: '◂ Copper + Tin = Cast Bronze',
        rightCue: 'Amesbury Archer &amp; Gold Capes ▸',
      },
      {
        date: 'c. 1200–800 BC',
        title: 'Must Farm (“Britain’s Pompeii”)',
        enq: 'Enq 5',
        leftCue: '◂ Stilt Homes &amp; Wet Silt',
        rightCue: 'Oldest Wheel &amp; Dover Boat ▸',
      },
      {
        date: 'c. 800 BC–AD 43',
        title: 'Iron Age Celts &amp; Hillforts',
        enq: 'Enq 6',
        leftCue: '◂ Iron Ploughs &amp; Querns',
        rightCue: 'Maiden Castle &amp; Gold Torcs ▸',
      },
    ],
  },
  checkpoints: [
    {
      title: 'Enquiry 1: Ice Age Hunters & Sunken Doggerland (c. 800,000–4000 BC)',
      focus: 'Palaeolithic flint tools, Mesolithic Star Carr & flooding of Doggerland',
    },
    {
      title: 'Enquiry 2: The First Farmers & Skara Brae (c. 4000–2500 BC)',
      focus: 'Neolithic farming revolution, Skara Brae stone homes & ancestor tombs',
    },
    {
      title: 'Enquiry 3: Secrets of Stonehenge (c. 3000–2200 BC)',
      focus: 'Welsh bluestones, 25-tonne sarsen trilithons & solstice alignments',
    },
    {
      title: 'Enquiry 4: Enter the Bronze Age & Beaker People (c. 2500–1200 BC)',
      focus: 'Smelting copper and tin, cast bronze axes & the Amesbury Archer',
    },
    {
      title: 'Enquiry 5: Must Farm — "Britain’s Pompeii" (c. 1200–800 BC)',
      focus: 'Waterlogged stilt roundhouses, preserved textiles/wheel & Channel trade',
    },
    {
      title: 'Enquiry 6: Iron Age Celts & Giant Hillforts (c. 800 BC–AD 43)',
      focus: 'Iron tools, Maiden Castle ramparts, gold torcs & pre-Roman coins',
    },
    {
      title: 'Teacher-Designated End-of-Unit Assessment Task',
      focus: 'Overall KS2 Prehistoric Chronology, Evidence & Vocabulary Mastery',
    },
  ],
};

if (require.main === module) {
  compileKs2SpineWorkbook(SPEC).catch((err) => {
    console.error('❌ ks2_stone_to_iron_age Spine Workbook failed:', err);
    process.exit(1);
  });
}

module.exports = { SPEC, buildSpineWorkbookHtml: (d) => buildSpineWorkbookHtml(SPEC, d) };
