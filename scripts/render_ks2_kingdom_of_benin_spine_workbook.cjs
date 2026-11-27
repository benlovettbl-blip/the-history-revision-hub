/**
 * scripts/render_ks2_kingdom_of_benin_spine_workbook.cjs
 *
 * KEY STAGE 2 THE KINGDOM OF BENIN (c. AD 900–1897)
 * Edition B: KS3-Style Structured Spine Pupil Workbook (16 Pages • 4 Folded A3 Sheets)
 */

const { compileKs2SpineWorkbook, buildSpineWorkbookHtml } = require('./components/build_ks2_6lesson_spine_workbook.cjs');

const SPEC = {
  unitId: 'ks2_kingdom_of_benin',
  docTitle: 'KS2 The Kingdom of Benin (c. AD 900–1897)',
  versoHeaderRight: 'KS2 HISTORY &bull; KINGDOM OF BENIN (c. AD 900–1897)',
  cover: {
    kickerPill: 'Key Stage 2 Non-European Contrast Study &bull; c. AD 900–1897 &bull; Wide-Ruled Edition',
    mainTitle: 'The Kingdom of Benin',
    bigQuestion: 'How did the rainforest Kingdom of Benin build giant earthworks, a sacred royal court, and world-famous brass sculptures?',
    imagePath: '/units/ks2_kingdom_of_benin/assets/banner_unit_hero.jpg',
    imageAlt: 'Sixteenth-century royal Benin cast brass court plaque from Benin City, southern Nigeria',
    objectPosition: 'center 35%',
    cluesHeading: '3 Clues to Spot on This Benin Plaque',
    clues: [
      'Shining golden brass cast in clay moulds using the clever lost-wax method on Igun Street.',
      'Sacred coral-bead collars, patterned shields, and ceremonial swords showing royal court rank.',
      'Corner nail holes proving this plaque once hung on a tall wooden pillar inside the Oba’s palace!',
    ],
    thinkQuestion: 'Why did Edo communities in southern Nigeria dig 16,000 kilometres of red-clay earthworks and light wide streets with palm-oil lamps centuries ago?',
    captionLeft: 'Royal Cast Brass Court Plaque From the Oba’s Palace in Benin City, Edo State, Nigeria',
    captionRight: 'BRITISH MUSEUM COLLECTION &bull; CC0 PUBLIC DOMAIN',
  },
  lessons: [
    {
      lessonNum: 1,
      taskA: {
        badge: 'SIMILARITY & CONTRAST',
        question: 'How did Edo communities use rainforest wealth and Ogiso leadership to dig 16,000 km of Iya earthworks—and how did AD 900 Britain compare?',
        connectives: 'In southern Nigeria’s rainforest, Edo villages... &bull; Ruled by early Ogiso kings,... &bull; Using iron hoes and woven baskets,... &bull; By contrast, in AD 900 Britain,...',
        keyTerms: 'southern Nigeria &bull; Edo rainforest &bull; oil palms &amp; yams &bull; Ogiso (Kings of the Sky) &bull; 16,000 km Iya moats &bull; Anglo-Saxon burhs',
      },
      taskB: {
        connectives: 'First, remember historic Benin lay in... &bull; Sun-baked red laterite clay stood... &bull; Linking over 500 settlements proved... &bull; Overall,...',
        keyTerms: 'Edo State (not Republic of Benin) &bull; red laterite clay &bull; iron hoes &bull; ceremonial eben swords &bull; village teamwork &bull; global wonder',
      },
      leftQuip: 'Geography check: historic Benin City lay in Edo State in southern NIGERIA — completely separate from the modern country called Republic of Benin!',
      rightQuip: 'Benin’s 16,000 km network of hand-dug red-clay Iya ditches and banks is roughly four times longer than the Great Wall of China!',
    },
    {
      lessonNum: 2,
      taskA: {
        badge: 'CAUSE & CONSEQUENCE',
        question: 'How did Benin’s royal dynasty begin through sacred Ife, and how did Oba Ewuare the Great turn Benin City into a golden capital?',
        connectives: 'Around AD 1180, Edo elders invited... &bull; His son Oba Eweka I founded... &bull; Around 1440, Oba Ewuare the Great built... &bull; After dark, tall lamps...',
        keyTerms: 'sacred Ife &bull; Prince Oranmiyan &bull; Oba Eweka I &bull; Oba Ewuare the Great &bull; nine guarded gates &bull; palm-oil street lamps',
      },
      taskB: {
        connectives: 'Surrounding Edo with a deep inner moat... &bull; Broad straight avenues and drains... &bull; Inside the palace, red coral beads... &bull; Clearly,...',
        keyTerms: 'inner city moat &bull; toll gates &bull; underground drains &bull; red coral regalia &bull; Igue festival &bull; royal craft guilds',
      },
      leftQuip: 'Centuries before London or Paris had regular street lighting, fifteenth-century Benin City lit its broad avenues with tall palm-oil lamps!',
      rightQuip: 'Oba Ewuare introduced precious red sea-coral crowns and collars so heavy that court attendants supported the Oba’s arms at ceremonies.',
    },
    {
      lessonNum: 3,
      taskA: {
        badge: 'PROCESS & EVIDENCE',
        question: 'How did the royal guild on Igun Street cast "lost-wax" brass sculptures, and how did palace plaques record Benin’s history?',
        connectives: 'Although often called Benin Bronzes, most... &bull; First, Igun Street sculptors carved... &bull; Heating the clay mould melted... &bull; Nailed onto palace pillars,...',
        keyTerms: 'brass (copper &amp; zinc) &bull; Igun Street guild &bull; beeswax model &bull; lost-wax casting &bull; clay crucible &bull; 900+ pillar plaques',
      },
      taskB: {
        connectives: 'Because casters cracked open each clay mould,... &bull; Alongside brass heads, ivory-carvers... &bull; Together with spoken court songs,... &bull; Therefore,...',
        keyTerms: 'one-of-a-kind sculptures &bull; hierarchical scale &bull; carved elephant tusks &bull; Igbesanmwan guild &bull; royal altars &bull; visual history books',
      },
      leftQuip: 'Because the outer clay mould had to be smashed open once the molten brass cooled, every single Benin lost-wax sculpture was one of a kind!',
      rightQuip: 'West African metalworkers in Ife and Benin mastered lost-wax casting centuries BEFORE the first European ships arrived in 1485.',
    },
    {
      lessonNum: 4,
      taskA: {
        badge: 'BELIEFS & SOCIETY',
        question: 'What role did the sacred Oba, wise Queen Mother Idia, and everyday village farmers play in Golden Age Benin?',
        connectives: 'Edo people revered the Oba as... &bull; Under Oba Esigie, Queen Mother Idia... &bull; Each year at the Igue festival,... &bull; Meanwhile, in rainforest villages,...',
        keyTerms: 'Leopard of the House &bull; Olokun &amp; mudfish &bull; Oba Esigie &bull; Queen Mother (Iyoba) Idia &bull; carved ivory mask &bull; Igue festival',
      },
      taskB: {
        connectives: 'Spotted leopards showed royal rule over land, while... &bull; Giving Iyoba Idia her own palace proved... &bull; Outside the court, families farmed... &bull; Overall,...',
        keyTerms: 'Uselu palace &bull; brass altar bells &bull; white yams &amp; plantains &bull; red palm oil &bull; woven cotton cloth &bull; courtyard compounds',
      },
      leftQuip: 'Oba Esigie created the powerful royal office of Iyoba (Queen Mother) for his mother Idia and wore her carved ivory mask on his ceremonial hip!',
      rightQuip: 'Mudfish could swim in rivers AND wriggle across damp land — making them the symbol linking the Oba’s earthly rule to sea-god Olokun!',
    },
    {
      lessonNum: 5,
      taskA: {
        badge: 'TRADE & INTERPRETATIONS',
        question: 'How did Benin control trade with European ships after 1485, and why did Olfert Dapper’s 1668 book praise Benin City so highly?',
        connectives: 'When João Afonso de Aveiro arrived in 1485,... &bull; At Gwato river port, the Oba insisted... &bull; Benin exported pepper and cloth for... &bull; In 1668, Olfert Dapper wrote...',
        keyTerms: 'AD 1485 &bull; Gwato river port &bull; ambassadors to Lisbon &bull; Benin pepper &amp; cloth &bull; brass manillas &amp; cowries &bull; Olfert Dapper (1668)',
      },
      taskB: {
        connectives: 'Melting thousands of imported brass manillas... &bull; Meanwhile, white cowrie shells worked as... &bull; Comparing Benin’s palace to Haarlem showed... &bull; Careful historians note...',
        keyTerms: 'fluent Portuguese (1553) &bull; Igun Street plaque boom &bull; thirty 120-foot streets &bull; town of Haarlem &bull; polished red-clay walls &bull; Dutch merchant diaries',
      },
      leftQuip: 'In 1553, Tudor English sailors were astonished when the Oba of Benin greeted them in fluent Portuguese learned since his boyhood!',
      rightQuip: 'Olfert Dapper never sailed to Africa himself — he compiled real eyewitness journals from Dutch merchants who walked Benin City’s 30 broad streets.',
    },
    {
      lessonNum: 6,
      taskA: {
        badge: 'CONSEQUENCE & RESTITUTION',
        question: 'Why did British forces invade Benin City in February 1897, and why have museums begun returning looted Benin Bronzes to Nigeria today?',
        connectives: 'In the 1890s, Britain wanted control over... &bull; When Oba Ovonramwen defended Benin’s tolls,... &bull; In February 1897, 1,200 British troops... &bull; Today, restitution means...',
        keyTerms: 'palm oil &amp; rubber trade &bull; Oba Ovonramwen &bull; February 1897 Punitive Expedition &bull; 4,000+ looted bronzes &bull; restitution &bull; Nigeria',
      },
      taskB: {
        connectives: 'Selling 4,000+ royal plaques and tusks scattered... &bull; Stunned curators in London and Berlin realised... &bull; Since 2021, Cambridge, Horniman, and Germany... &bull; Best of all, in Benin City today,...',
        keyTerms: '160+ world museums &bull; sacred visual archive &bull; Cambridge &amp; Berlin returns &bull; Oba Ewuare II &bull; living Igun Street guild &bull; Edo heritage',
      },
      leftQuip: 'Over 4,000 brass plaques, heads, and carved tusks seized in February 1897 were auctioned to pay for Britain’s military expedition!',
      rightQuip: 'Edo royal culture never ended: today Oba Ewuare II leads Benin’s court and hereditary families still cast molten brass on Igun Street!',
    },
  ],
  centrefold: {
    part1KickerRight: 'KEY STAGE 2 &bull; PART 1 ANCHORS (c. AD 900–1700)',
    part1Heading: 'Ogiso Earthworks, Oba Ewuare &amp; Lost-Wax Brass Plaques',
    part1CueHint: 'Rulers &amp; City Building to the left &bull; Craft &amp; Engineering to the right',
    part1ContinueLabel: 'Timeline Spine Continues to Queen Mother Idia, 1485 Trade, 1897 &amp; Restitution (Page 9)',
    part1FooterQuip: 'The Kingdom of Benin (c. AD 900–1897) &bull; Centrefold Mind-Map Spine (Part 1).',
    part2KickerRight: 'KEY STAGE 2 &bull; PART 2 ANCHORS (c. AD 1485–PRESENT)',
    part2Heading: 'Sacred Court, Global Trade, 1897 Invasion &amp; Modern Return',
    part2CueHint: 'Court &amp; Trade Power to the left &bull; 1897 &amp; Living Heritage to the right',
    part2CompleteLabel: 'Kingdom of Benin Mind-Map Spine Complete (c. AD 900–Present)',
    part2FooterQuip: 'The Kingdom of Benin (c. AD 900–1897) &bull; Centrefold Mind-Map Spine (Part 2).',
    spineLeft: [
      {
        date: 'c. AD 900–1180',
        title: 'Ogiso &amp; Iya Earthworks',
        enq: 'Enq 1',
        leftCue: '◂ Ogiso Kings in Southern Nigeria',
        rightCue: '16,000 km Red-Clay Moats ▸',
      },
      {
        date: 'c. AD 1180–1500',
        title: 'Ife Dynasty &amp; Oba Ewuare',
        enq: 'Enq 2',
        leftCue: '◂ Eweka I &amp; Nine Guarded Gates',
        rightCue: 'Broad Streets &amp; Oil Lamps ▸',
      },
      {
        date: 'c. AD 1400–1700',
        title: 'Igun Lost-Wax Bronzes',
        enq: 'Enq 3',
        leftCue: '◂ Beeswax, Clay &amp; Molten Brass',
        rightCue: '900+ Plaques &amp; Ivory Tusks ▸',
      },
    ],
    spineRight: [
      {
        date: 'c. AD 1500–1700',
        title: 'Oba Esigie &amp; Iyoba Idia',
        enq: 'Enq 4',
        leftCue: '◂ Queen Mother Idia &amp; Leopards',
        rightCue: 'Igue Festival &amp; Yam Farms ▸',
      },
      {
        date: 'c. AD 1485–1850',
        title: 'Manillas &amp; 1668 Dapper',
        enq: 'Enq 5',
        leftCue: '◂ Gwato Port &amp; Lisbon Envoys',
        rightCue: 'Brass Manillas &amp; 30 Streets ▸',
      },
      {
        date: '1897–Present',
        title: '1897 Looting &amp; Return',
        enq: 'Enq 6',
        leftCue: '◂ Feb 1897 Invasion &amp; Exile',
        rightCue: 'Restitution &amp; Edo Today ▸',
      },
    ],
  },
  checkpoints: [
    {
      title: 'Enquiry 1: Rainforest Kingdom — Ogiso Rulers, Red-Earth Walls & Britain Contrast',
      focus: 'Southern Nigeria rainforest, Ogiso kings, 16,000 km Iya moats & AD 900 Britain',
    },
    {
      title: 'Enquiry 2: From Ogiso to Oba — Ewuare the Great & Golden Benin City',
      focus: 'Sacred Ife, Oba Eweka I, nine fortified gates, wide avenues & palm-oil lamps',
    },
    {
      title: 'Enquiry 3: Lost-Wax Masterpieces — Igun Street Brass-Casters, Ivory & Coral',
      focus: 'Beeswax-and-clay lost-wax brass casting, carved tusks & visual history plaques',
    },
    {
      title: 'Enquiry 4: Sacred Court Rituals — The Oba, Queen Mother Idia & Everyday Life',
      focus: 'Oba Esigie, Iyoba Idia’s ivory mask, royal leopards, Igue & village yam farming',
    },
    {
      title: 'Enquiry 5: Global Traders — Brass Manillas, Cowrie Shells & European Visitors',
      focus: '1485 Portuguese trade, brass manillas, cowries & Olfert Dapper’s 1668 account',
    },
    {
      title: 'Enquiry 6: 1897 British Invasion, Looted Bronzes & Living Edo Heritage Today',
      focus: 'Oba Ovonramwen, February 1897 looting, modern restitution & living Igun casting',
    },
    {
      title: 'Teacher-Designated End-of-Unit Synoptic Assessment Task',
      focus: '1,000 Years of Edo Engineering, Artistry, Trade, 1897 & Modern Restitution',
    },
  ],
};

if (require.main === module) {
  compileKs2SpineWorkbook(SPEC).catch((err) => {
    console.error('❌ ks2_kingdom_of_benin Spine Workbook failed:', err);
    process.exit(1);
  });
}

module.exports = { SPEC, buildSpineWorkbookHtml: (d) => buildSpineWorkbookHtml(SPEC, d) };
