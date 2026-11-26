/**
 * scripts/render_ks2_maya_civilisation_spine_workbook.cjs
 *
 * KEY STAGE 2 THE ANCIENT MAYA (c. 2000 BC–AD 1500)
 * Edition B: KS3-Style Structured Spine Pupil Workbook (16 Pages • 4 Folded A3 Sheets)
 */

const { compileKs2SpineWorkbook, buildSpineWorkbookHtml } = require('./components/build_ks2_6lesson_spine_workbook.cjs');

const SPEC = {
  unitId: 'ks2_maya_civilisation',
  docTitle: 'KS2 The Ancient Maya (c. 2000 BC–AD 1500)',
  versoHeaderRight: 'KS2 HISTORY &bull; THE ANCIENT MAYA (c. 2000 BC–AD 1500)',
  cover: {
    kickerPill: 'Key Stage 2 Non-European Contrast &bull; c. 2000 BC–AD 1500 &bull; Wide-Ruled Edition',
    mainTitle: 'The Ancient Maya Civilisation',
    bigQuestion: 'How did the Maya build dazzling stone rainforest cities, invent zero, and endure to this day?',
    imagePath: '/units/ks2_maya_civilisation/assets/banner_unit_hero.jpg',
    imageAlt: 'El Castillo (Pyramid of Kukulcán) limestone step-pyramid with carved serpent heads at Chichén Itzá, Yucatán, Mexico',
    objectPosition: 'center 46%',
    cluesHeading: '3 Clues to Spot at El Castillo',
    clues: [
      'Nine terraced limestone platforms rising to a square stone temple on top.',
      'Steep staircases whose steps add up to 365 — one for each solar day!',
      'Two carved stone feathered-serpent heads guarding the foot of the stairs.',
    ],
    thinkQuestion: 'Around AD 900, while Anglo-Saxons built wooden halls in Britain, how did the Maya build stone pyramids without iron tools or wheels?',
    captionLeft: 'El Castillo (Pyramid of Kukulcán) Limestone Step-Pyramid at Chichén Itzá, Yucatán (c. AD 800–1100)',
    captionRight: 'CHICHÉN ITZÁ &bull; WIKIMEDIA COMMONS',
  },
  lessons: [
    {
      lessonNum: 1,
      taskA: {
        badge: 'ENVIRONMENT & INGENUITY',
        question: 'How did natural sinkholes (cenotes), underground chultun reservoirs, and Three Sisters crops feed huge Maya rainforest cities?',
        connectives: 'With few surface rivers in Yucatán,... &bull; Maya engineers plastered plazas to... &bull; On terraced fields, farmers planted... &bull; Together, these crops...',
        keyTerms: 'cenotes &bull; chultunes (stone cisterns) &bull; Three Sisters &bull; maize, beans &amp; squash &bull; obsidian blades &bull; limestone',
      },
      taskB: {
        connectives: 'Across Mesoamerica’s three zones,... &bull; Even without iron tools or pack animals,... &bull; Compared with Anglo-Saxon Britain c. AD 900,... &bull; Overall,...',
        keyTerms: 'Mesoamerica &bull; obsidian &amp; limestone &bull; cenotes &bull; Tikal &amp; Palenque &bull; stone plazas &bull; Anglo-Saxon timber halls',
      },
      leftQuip: 'Growing maize, climbing beans, and broad squash leaves together (“Three Sisters”) kept soil fertile and weed-free without ploughs.',
      rightQuip: 'Around AD 750, stone-built Tikal housed roughly 60,000 people — far larger than wooden London or Winchester in Anglo-Saxon England!',
    },
    {
      lessonNum: 2,
      taskA: {
        badge: 'KINGSHIP & ARCHAEOLOGY',
        question: 'What did Archaeologist Alberto Ruz Lhuillier’s discovery inside Palenque’s Temple of the Inscriptions reveal about King Pakal?',
        connectives: 'Classic Maya cities had no single emperor; instead,... &bull; Ruling Palenque for 68 years,... &bull; Deep inside his step-pyramid,... &bull; His carved jade mask shows...',
        keyTerms: 'rival city-states &bull; k’uhul ajaw (holy lord) &bull; King Pakal the Great &bull; Palenque &bull; mosaic jade mask &bull; carved sarcophagus',
      },
      taskB: {
        connectives: 'Each Maya city-state was led by... &bull; Tall stone stelae and pyramids... &bull; Royal Maya women such as Lady Six Sky also... &bull; Overall,...',
        keyTerms: 'ajaw &bull; step-pyramids &bull; corbelled stone vaults &bull; stelae monuments &bull; Lady Six Sky &bull; royal alliances',
      },
      leftQuip: 'To Maya rulers, green jade was far more precious than gold because its colour matched sprouting young maize and life-giving water.',
      rightQuip: 'Carved stone lintels and stelae prove royal women like Lady Six Sky of Naranjo governed courts and led ceremonies in their own right.',
    },
    {
      lessonNum: 3,
      taskA: {
        badge: 'WRITING & MATHEMATICS',
        question: 'How did Maya scribes write bark-paper codices, and why was inventing a shell symbol for place-value zero such a breakthrough?',
        connectives: 'Using over 800 picture-and-syllable glyphs,... &bull; On folded huun bark paper,... &bull; In base-20 maths, scribes used... &bull; Inventing zero meant...',
        keyTerms: 'hieroglyphs &bull; bark-paper codices &bull; base-20 maths &bull; shell (0), dot (1) &amp; bar (5) &bull; place value &bull; Dresden Codex',
      },
      taskB: {
        connectives: 'Unlike most ancient peoples, the Maya... &bull; Their shell-zero and base-20 system... &bull; From observatories like El Caracol,... &bull; Altogether,...',
        keyTerms: 'complete writing system &bull; place-value zero &bull; naked-eye astronomy &bull; El Caracol &bull; Venus tables &bull; 260-day Tzolk’in &amp; 365-day Haab’',
      },
      leftQuip: 'Maya mathematicians used place-value zero centuries before zero reached medieval Europe — needing just three signs: shell, dot, and bar!',
      rightQuip: 'Without glass telescopes, Maya sky-watchers at El Caracol tracked the planet Venus to within two hours over five hundred years.',
    },
    {
      lessonNum: 4,
      taskA: {
        badge: 'DAILY LIFE & TRADE',
        question: 'Why were maize and cacao beans so valuable in Maya daily life, and how was the sacred rubber-ball game Pok-ta-Pok played?',
        connectives: 'Soaking dried maize in limewater... &bull; Valuable cacao beans were whisked into... &bull; Merchants also used cacao beans as... &bull; Inside stone ballcourts,...',
        keyTerms: 'maize tortillas &bull; stone metate &bull; spiced frothy cacao &bull; cacao-bean currency &bull; solid rubber ball &bull; Pok-ta-Pok stone rings',
      },
      taskB: {
        connectives: 'Every morning, Maya kitchens... &bull; Without pack animals or metal coins, traders... &bull; Meanwhile, roaring stone ballcourts... &bull; Overall,...',
        keyTerms: 'maize &amp; chilli cacao &bull; obsidian, salt &amp; quetzal feathers &bull; dugout canoes &bull; Pok-ta-Pok &bull; padded hips &bull; Hero Twins myth',
      },
      leftQuip: 'Maya rulers drank cacao unsweetened, spiced with red chilli peppers and poured from height to whip up a thick, frothy foam!',
      rightQuip: 'Pok-ta-Pok players bounced a heavy solid rubber ball off padded hips and elbows — never touching it with their hands or feet.',
    },
    {
      lessonNum: 5,
      taskA: {
        badge: 'BELIEF & ARCHITECTURE',
        question: 'How did Maya builders design El Castillo at Chichén Itzá as a giant 365-day stone calendar for the feathered serpent Kukulcán?',
        connectives: 'In the sacred Popol Vuh story,... &bull; At Chichén Itzá, architects built... &bull; Four staircases of 91 steps plus... &bull; Every spring and autumn equinox,...',
        keyTerms: 'Popol Vuh &bull; maize-dough humans &bull; Rain God Chaac &bull; El Castillo &bull; 365 steps &bull; Kukulcán equinox shadow',
      },
      taskB: {
        connectives: 'Maya religion taught that gods... &bull; Caves and cenotes mattered because... &bull; By aligning El Castillo with the sun,... &bull; Clearly,...',
        keyTerms: 'Maize God &bull; Chaac &bull; Xibalba underworld &bull; Chichén Itzá &bull; spring &amp; autumn equinox &bull; stone calendar',
      },
      leftQuip: 'Four staircases of 91 steps (364) plus El Castillo’s top temple platform equal 365 — matching every day of the solar year!',
      rightQuip: 'Each March and September equinox, afternoon sunlight casts seven triangles down El Castillo’s balustrade like a wriggling serpent.',
    },
    {
      lessonNum: 6,
      taskA: {
        badge: 'CAUSATION & CONTINUITY',
        question: 'Which linked causes emptied southern cities like Tikal around AD 900 — and what proves the Maya people never vanished?',
        connectives: 'Between AD 800 and 950, southern cities... &bull; Cave-mineral clues prove severe... &bull; Linked with deforestation and warfare,... &bull; Yet further north and today,...',
        keyTerms: 'multi-causal &bull; severe droughts &bull; deforestation &bull; rival warfare &bull; Chichén Itzá &amp; Mayapán &bull; 7 million living Maya',
      },
      taskB: {
        connectives: 'No single disaster emptied Tikal; instead,... &bull; After AD 900, Maya families thrived in... &bull; Even today across Central America,... &bull; Therefore,...',
        keyTerms: 'AD 900 southern shift &bull; drought &amp; trade routes &bull; northern Yucatán cities &bull; over 30 Mayan languages &bull; woven huipil &bull; living culture',
      },
      leftQuip: 'Northern Maya coastal cities like Chichén Itzá, Mayapán, and Tulum flourished for centuries after southern jungle plazas fell quiet.',
      rightQuip: 'More than seven million Maya people live across Mexico, Guatemala, and Belize today, speaking over thirty Mayan languages!',
    },
  ],
  centrefold: {
    part1KickerRight: 'KEY STAGE 2 &bull; PART 1 ANCHORS (c. 2000 BC–AD 900)',
    part1Heading: 'Rainforest Cities, Jade Kings, Glyphs &amp; Inventing Zero',
    part1CueHint: 'Environment &amp; Rulers to the left &bull; Writing, Zero &amp; Stars to the right',
    part1ContinueLabel: 'Timeline Spine Continues to Cacao, Pok-ta-Pok, Chichén Itzá &amp; Living Maya (Page 9)',
    part1FooterQuip: 'The Ancient Maya (c. 2000 BC–AD 1500) &bull; Centrefold Mind-Map Spine (Part 1).',
    part2KickerRight: 'KEY STAGE 2 &bull; PART 2 ANCHORS (AD 600–1500 &amp; TODAY)',
    part2Heading: 'Cacao, Pok-ta-Pok, El Castillo &amp; Seven Million Living Maya',
    part2CueHint: 'Daily Life &amp; Beliefs to the left &bull; AD 900 Shift &amp; Continuity to the right',
    part2CompleteLabel: 'The Ancient Maya Mind-Map Spine Complete (c. 2000 BC–Today)',
    part2FooterQuip: 'The Ancient Maya (c. 2000 BC–AD 1500) &bull; Centrefold Mind-Map Spine (Part 2).',
    spineLeft: [
      {
        date: 'c. 2000 BC–AD 900',
        title: 'Rainforest Cities &amp; Cenotes',
        enq: 'Enq 1',
        leftCue: '◂ Cenotes &amp; Three Sisters',
        rightCue: 'Stone Tikal vs Saxon Halls ▸',
      },
      {
        date: 'c. AD 250–900',
        title: 'Ajaw Kings &amp; Pakal’s Jade Mask',
        enq: 'Enq 2',
        leftCue: '◂ Rival City-State Pyramids',
        rightCue: 'Palenque Tomb &amp; Royal Women ▸',
      },
      {
        date: 'c. AD 300–900',
        title: 'Bark Codices &amp; Shell Zero',
        enq: 'Enq 3',
        leftCue: '◂ 800 Glyphs &amp; Base-20 Maths',
        rightCue: 'El Caracol &amp; Two Calendars ▸',
      },
    ],
    spineRight: [
      {
        date: 'c. AD 600–900',
        title: 'Maize, Cacao &amp; Pok-ta-Pok',
        enq: 'Enq 4',
        leftCue: '◂ Metates &amp; Cacao Money',
        rightCue: 'Rubber Ballcourts &amp; Myth ▸',
      },
      {
        date: 'c. AD 600–1200',
        title: 'Popol Vuh &amp; Chichén Itzá',
        enq: 'Enq 5',
        leftCue: '◂ Maize Gods &amp; Rain Chaac',
        rightCue: '365 Steps &amp; Equinox Serpent ▸',
      },
      {
        date: 'AD 900–Today',
        title: 'AD 900 Shift &amp; Living Maya',
        enq: 'Enq 6',
        leftCue: '◂ Drought, Trees &amp; War',
        rightCue: 'Yucatán &amp; 7m Maya Today ▸',
      },
    ],
  },
  checkpoints: [
    {
      title: 'Enquiry 1: Stone Cities in the Rainforest (c. 2000 BC–AD 600)',
      focus: 'Cenote water storage, Three Sisters crops & contrast with Saxon Britain',
    },
    {
      title: 'Enquiry 2: Step Pyramids, Pakal & Maya Rulers (c. AD 250–900)',
      focus: 'Rival city-states, King Pakal’s Palenque jade tomb & royal Maya women',
    },
    {
      title: 'Enquiry 3: Maya Glyphs, Bark Books & Inventing Zero (c. AD 300–900)',
      focus: 'Hieroglyphs, bark codices, shell place-value zero & Venus calendars',
    },
    {
      title: 'Enquiry 4: Maize Tortillas, Frothy Cacao & Pok-ta-Pok (c. AD 600–900)',
      focus: 'Maize kitchens, cacao-bean currency, obsidian trade & Pok-ta-Pok courts',
    },
    {
      title: 'Enquiry 5: Maize Gods, Rain Caves & Chichén Itzá (c. AD 600–1200)',
      focus: 'Popol Vuh creation story, Chaac rain caves & El Castillo’s 365 steps',
    },
    {
      title: 'Enquiry 6: The AD 900 Mystery & Seven Million Living Maya',
      focus: 'Multi-causal southern shift, thriving northern cities & living Maya today',
    },
    {
      title: 'Teacher-Designated End-of-Unit Assessment Task',
      focus: 'Overall KS2 Non-European Contrast Enquiry & Vocabulary Mastery',
    },
  ],
};

if (require.main === module) {
  compileKs2SpineWorkbook(SPEC).catch((err) => {
    console.error('❌ ks2_maya_civilisation Spine Workbook failed:', err);
    process.exit(1);
  });
}

module.exports = { SPEC, buildSpineWorkbookHtml: (d) => buildSpineWorkbookHtml(SPEC, d) };
