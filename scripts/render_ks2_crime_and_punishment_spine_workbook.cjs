/**
 * scripts/render_ks2_crime_and_punishment_spine_workbook.cjs
 *
 * KEY STAGE 2 CRIME AND PUNISHMENT THROUGH TIME (AD 43–PRESENT)
 * Edition B: KS3-Style Structured Spine Pupil Workbook (16 Pages • 4 Folded A3 Sheets)
 */

const { compileKs2SpineWorkbook, buildSpineWorkbookHtml } = require('./components/build_ks2_6lesson_spine_workbook.cjs');

const SPEC = {
  unitId: 'ks2_crime_and_punishment',
  docTitle: 'KS2 Crime and Punishment Through Time (AD 43–Present)',
  versoHeaderRight: 'KS2 HISTORY &bull; CRIME &amp; PUNISHMENT (AD 43–PRESENT)',
  cover: {
    kickerPill: 'Key Stage 2 Post-1066 Thematic Study &bull; AD 43–Present &bull; Wide-Ruled Edition',
    mainTitle: 'Crime &amp; Punishment Through Time',
    bigQuestion: 'How and why have crimes, policing, trials, and punishments changed across 2,000 years of British history?',
    imagePath: '/units/ks2_crime_and_punishment/assets/banner_unit_hero.jpg',
    imageAlt: 'Gilded bronze statue of Lady Justice holding sword and balance scales atop the Old Bailey Central Criminal Court in London',
    objectPosition: 'center 25%',
    cluesHeading: '3 Clues to Spot on Lady Justice',
    clues: [
      'Balanced golden scales weighing courtroom evidence fairly for both sides.',
      'An unsheathed sword showing the lawful authority of courts and juries.',
      'Standing high above London’s Old Bailey — with open eyes watching the city!',
    ],
    thinkQuestion: 'Why did Britain have zero uniformed police officers for nearly 1,800 years from Roman Bath until Sir Robert Peel’s 1829 London "Bobbies"?',
    captionLeft: 'Gilded Bronze Statue of Lady Justice Atop the Old Bailey Central Criminal Court, London',
    captionRight: 'OLD BAILEY, LONDON &bull; WIKIMEDIA COMMONS',
  },
  lessons: [
    {
      lessonNum: 1,
      taskA: {
        badge: 'EVIDENCE & SOCIAL RANK',
        question: 'How did Roman magistrates judge crimes using written laws, and why did robbed bathers at Bath write lead curse tablets?',
        connectives: 'After AD 43, Roman courts used... &bull; However, without police detectives,... &bull; Punishments also differed sharply because... &bull; At Aquae Sulis,...',
        keyTerms: 'Twelve Tables &bull; stone basilica &bull; magistrate &bull; Roman citizens vs enslaved people &bull; Aquae Sulis &bull; lead curse tablets',
      },
      taskB: {
        connectives: 'Written Roman rules mattered because... &bull; Yet legionaries and vigiles did not... &bull; Whenever unseen thieves stole cloaks,... &bull; Overall,...',
        keyTerms: 'written laws &bull; vigiles &bull; fines vs whipping &bull; Sulis Minerva &bull; folded lead sheets &bull; bronze scales',
      },
      leftQuip: 'Over 130 scratched lead curse tablets recovered at Roman Bath complain about everyday thefts of cloaks, gloves, rings, and small coins!',
      rightQuip: 'Wealthy Roman citizens usually paid fines or faced exile, whereas enslaved workers risked whipping, hard labour in mines, or the arena.',
    },
    {
      lessonNum: 2,
      taskA: {
        badge: 'COMMUNITY JUSTICE',
        question: 'How did ten-person tithings, the Hue and Cry, and silver wergild keep Anglo-Saxon villages peaceful without police or prisons?',
        connectives: 'Every male villager aged twelve joined... &bull; Whenever someone shouted the Hue and Cry,... &bull; To stop deadly blood feuds,... &bull; Only when witnesses disagreed...',
        keyTerms: 'ten-person tithing &bull; Hue and Cry horn &bull; King Alfred &bull; silver wergild &bull; blood feuds &bull; Trial by Ordeal',
      },
      taskB: {
        connectives: 'Anglo-Saxon community rules worked cleverly by... &bull; However, wergild was unequal because... &bull; Inside stone churches, priests also... &bull; Balancing both sides,...',
        keyTerms: 'Hundred Court &bull; oath-helpers &bull; thane (1,200s) vs ceorl (200s) &bull; Trial by Hot Iron &bull; three days &bull; superstition',
      },
      leftQuip: 'In Old English, "wer-gild" literally meant "person-price" — fixing exact silver compensation for every injury so families put away their swords!',
      rightQuip: 'In Trial by Hot Iron, priests checked the bandaged hand after three days: clean healing meant innocent, while infection meant guilty.',
    },
    {
      lessonNum: 3,
      taskA: {
        badge: 'CONTINUITY & CHANGE',
        question: 'Why did villagers resent Norman Forest Laws after 1066, and how did Henry II and 1215 build fairer English jury trials?',
        connectives: 'After 1066, William I kept tithings yet... &bull; Under harsh Forest Laws, hunting deer... &bull; From 1154, King Henry II introduced... &bull; Then in 1215,...',
        keyTerms: 'Norman Forest Laws &bull; poaching &bull; King’s treasury &bull; Common Law &bull; twelve-person jury &bull; 1215 Magna Carta',
      },
      taskB: {
        connectives: 'Alongside royal courts, medieval churches... &bull; Striking Durham’s Sanctuary Knocker gave... &bull; Meanwhile, market towns shamed cheats in... &bull; Overall,...',
        keyTerms: 'Durham Cathedral &bull; 37–40 days sanctuary &bull; Pope’s 1215 ordeal ban &bull; ankle stocks &bull; upright pillory &bull; rule of law',
      },
      leftQuip: 'Two huge events met in 1215: King John sealed Magna Carta at Runnymede AND Pope Innocent III stopped priests blessing Trials by Ordeal!',
      rightQuip: 'Village stocks locked a sitting offender’s ankles low down, whereas an upright wooden pillory trapped a standing cheat’s neck and wrists.',
    },
    {
      lessonNum: 4,
      taskA: {
        badge: 'FEAR & DETERRENCE',
        question: 'Why did Tudor and Stuart rulers punish "sturdy beggars" and the 1605 Gunpowder Plotters so harshly—and why did witch trials end?',
        connectives: 'Rising Tudor poverty left many jobless, so... &bull; In November 1605, the Monteagle Letter... &bull; During the 1645–1647 Civil War,... &bull; After 1660,...',
        keyTerms: '1601 Poor Law &bull; sturdy beggars &bull; High Treason &bull; Guy Fawkes’s lantern &bull; Matthew Hopkins &bull; 1660 Royal Society',
      },
      taskB: {
        connectives: 'With only unpaid parish constables,... &bull; Catching Fawkes beside 36 barrels showed... &bull; Once calm judges demanded real proof,... &bull; Therefore,...',
        keyTerms: 'vagrants &bull; whipped behind a cart &bull; 36 gunpowder barrels &bull; sleep deprivation &bull; scientific evidence &bull; 1736 Witchcraft Act',
      },
      leftQuip: 'Guy Fawkes’s real 1605 iron "dark lantern" — with a sliding shutter hiding its candle flame — still survives in Oxford’s Ashmolean Museum!',
      rightQuip: 'In England, convicted witches were hanged under felony laws rather than burned — until science and the 1736 Act ended witch trials.',
    },
    {
      lessonNum: 5,
      taskA: {
        badge: 'UNINTENDED CONSEQUENCES',
        question: 'Why did Georgian MPs pass over 220 death-penalty laws ("the Bloody Code"), and why did juries and reformers push for change?',
        connectives: 'In the 1700s, high import taxes and unlit roads... &bull; Refusing to pay for police, MPs passed... &bull; However, twelve-person juries refused to... &bull; Instead,...',
        keyTerms: 'coastal smuggling &bull; highwaymen &bull; Bloody Code (220+ crimes) &bull; five shillings &bull; reluctant juries &bull; Australian transportation',
      },
      taskB: {
        connectives: 'Armed Royal Mail coaches and banknotes ended... &bull; Meanwhile, over 160,000 convicts sailed... &bull; Inside Newgate Prison in 1813–1817,... &bull; Clearly,...',
        keyTerms: 'Royal Mail coaches &bull; Thames prison hulks &bull; Australia (1787–1868) &bull; Elizabeth Fry &bull; rehabilitation &bull; 1823 Gaols Act',
      },
      leftQuip: 'Because hanging a teenager for stealing five shillings felt cruelly unfair, English juries deliberately undervalued stolen goods on purpose!',
      rightQuip: 'Quaker reformer Elizabeth Fry opened a school and paid patchwork sewing workshops for mothers and children inside grim Newgate Prison.',
    },
    {
      lessonNum: 6,
      taskA: {
        badge: 'SYNOPTIC CHANGE (1829–TODAY)',
        question: 'How have Sir Robert Peel’s 1829 Bobbies, prison reforms, 1901 fingerprints, and 1984 DNA transformed modern British justice?',
        connectives: 'In 1829, Home Secretary Sir Robert Peel... &bull; Dressed in blue coats without guns,... &bull; While Victorian Pentonville tested solitary cells,... &bull; Since 1901 and 1984,...',
        keyTerms: 'Sir Robert Peel (1829) &bull; unarmed Bobbies &bull; policing by consent &bull; Pentonville &amp; 1965 &bull; 1901 fingerprints &bull; 1984 DNA profiling',
      },
      taskB: {
        connectives: 'Across 2,000 years from Roman Bath to today,... &bull; Medieval twelve-person juries still endure, yet... &bull; Sir Alec Jeffreys’s Leicester DNA breakthrough... &bull; Overall,...',
        keyTerms: 'prevention vs deterrence &bull; rehabilitation &bull; Scotland Yard &bull; Sir Alec Jeffreys &bull; clearing the innocent &bull; cyber-crime policing',
      },
      leftQuip: 'Early 1829 Peelers wore dark blue tailcoats and reinforced top hats with wooden rattles — earning citizens’ trust without carrying army muskets!',
      rightQuip: 'In its very first murder inquiry (1986–87), Leicester DNA profiling proved an arrested teenager INNOCENT before catching the real culprit!',
    },
  ],
  centrefold: {
    part1KickerRight: 'KEY STAGE 2 &bull; PART 1 ANCHORS (AD 43–1485)',
    part1Heading: 'Roman Courts, Saxon Wergild, Norman Forests &amp; 1215 Juries',
    part1CueHint: 'Who Caught Criminals to the left &bull; Trials &amp; Punishments to the right',
    part1ContinueLabel: 'Timeline Spine Continues to 1605 Treason, Bloody Code, 1829 Bobbies &amp; 1984 DNA (Page 9)',
    part1FooterQuip: 'Crime &amp; Punishment Through Time (AD 43–Present) &bull; Centrefold Mind-Map Spine (Part 1).',
    part2KickerRight: 'KEY STAGE 2 &bull; PART 2 ANCHORS (1485–PRESENT)',
    part2Heading: 'Tudor Deterrence, Bloody Code, 1829 Bobbies &amp; DNA Science',
    part2CueHint: 'New Crimes &amp; Policing to the left &bull; Reform &amp; Forensics to the right',
    part2CompleteLabel: 'Crime &amp; Punishment Mind-Map Spine Complete (AD 43–Present)',
    part2FooterQuip: 'Crime &amp; Punishment Through Time (AD 43–Present) &bull; Centrefold Mind-Map Spine (Part 2).',
    spineLeft: [
      {
        date: 'AD 43–410',
        title: 'Roman Law &amp; Bath Curses',
        enq: 'Enq 1',
        leftCue: '◂ No Police; Vigiles Watch Fires',
        rightCue: 'Twelve Tables &amp; Lead Curses ▸',
      },
      {
        date: 'AD 410–1066',
        title: 'Saxon Tithings &amp; Wergild',
        enq: 'Enq 2',
        leftCue: '◂ 10-Man Tithings &amp; Hue and Cry',
        rightCue: 'Silver Wergild &amp; Ordeals ▸',
      },
      {
        date: '1066–1485',
        title: 'Forest Laws &amp; 1215 Juries',
        enq: 'Enq 3',
        leftCue: '◂ Poaching &amp; Church Sanctuary',
        rightCue: 'Henry II Juries &amp; Magna Carta ▸',
      },
    ],
    spineRight: [
      {
        date: '1485–1700',
        title: 'Vagrants, 1605 &amp; Witches',
        enq: 'Enq 4',
        leftCue: '◂ Sturdy Beggars &amp; Fawkes',
        rightCue: 'Hopkins → 1660s Science ▸',
      },
      {
        date: '1700–1820',
        title: 'Smugglers &amp; Bloody Code',
        enq: 'Enq 5',
        leftCue: '◂ Tea Smugglers &amp; Highwaymen',
        rightCue: 'Australia &amp; Elizabeth Fry ▸',
      },
      {
        date: '1829–Present',
        title: '1829 Bobbies &amp; 1984 DNA',
        enq: 'Enq 6',
        leftCue: '◂ Peel’s Blue-Coated Police',
        rightCue: '1965 Reform &amp; DNA Proof ▸',
      },
    ],
  },
  checkpoints: [
    {
      title: 'Enquiry 1: Roman Law, Twelve Tables & Bath Curse Tablets (AD 43–410)',
      focus: 'Written basilica law, unequal citizen vs slave ranks & Bath curses',
    },
    {
      title: 'Enquiry 2: Anglo-Saxon Tithings, Wergild & Trial by Ordeal (AD 410–1066)',
      focus: 'Ten-person tithings, Hue and Cry, silver wergild & church ordeals',
    },
    {
      title: 'Enquiry 3: Norman Forest Laws, Sanctuary & Royal Courts (1066–1485)',
      focus: 'Royal deer poaching, Henry II’s Common Law juries & 1215 Magna Carta',
    },
    {
      title: 'Enquiry 4: Tudor Vagrants, High Treason & Witchcraft Trials (1485–1700)',
      focus: '1601 Poor Law, Guy Fawkes’s 1605 plot & science ending witch trials',
    },
    {
      title: 'Enquiry 5: Smugglers, Highwaymen & The Bloody Code (1700–1820)',
      focus: '220+ capital laws, reluctant juries, Australia & Elizabeth Fry',
    },
    {
      title: 'Enquiry 6: Peel’s 1829 Bobbies, Victorian Prisons & Forensics (1829–Present)',
      focus: 'Unarmed policing by consent, prison reform, 1901 fingerprints & 1984 DNA',
    },
    {
      title: 'Teacher-Designated End-of-Unit Synoptic Assessment Task',
      focus: '2,000-Year Change & Continuity Across Policing, Trials & Punishments',
    },
  ],
};

if (require.main === module) {
  compileKs2SpineWorkbook(SPEC).catch((err) => {
    console.error('❌ ks2_crime_and_punishment Spine Workbook failed:', err);
    process.exit(1);
  });
}

module.exports = { SPEC, buildSpineWorkbookHtml: (d) => buildSpineWorkbookHtml(SPEC, d) };
