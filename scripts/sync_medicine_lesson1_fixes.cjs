const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const medDataPath = path.join(ROOT_DIR, 'data', 'edexcel_medicine.json');
const medData = JSON.parse(fs.readFileSync(medDataPath, 'utf8'));

// 1. Fix lesson_1_1 blocks in data/edexcel_medicine.json
const l11 = medData.lessons.find(l => l.id === 'lesson_1_1');

// Swap texts of blocks 2, 3, 4 so they match their titles:
// Currently:
// block[1] has pilgrimage text
// block[2] has leprosy text
// block[3] has astrology text
const textPilgrimage = l11.narrative_blocks[1].text;
const textLeprosy = l11.narrative_blocks[2].text;
const textAstrology = l11.narrative_blocks[3].text;

l11.narrative_blocks[1].text = textLeprosy;
l11.narrative_blocks[2].text = textAstrology;
l11.narrative_blocks[3].text = textPilgrimage;

// Update lesson_1_1 workbook_stages in data/edexcel_medicine.json
l11.workbook_stages = [
  {
    step: 1,
    date: 'c1250',
    para_ref: '[1.1–1.2]',
    heading: 'Why was disease believed to be a direct punishment sent by God?',
    title: 'Divine Retribution & Original Sin',
    dates: 'c1250',
    focus_clue: 'Why was disease believed to be a direct punishment sent by God?',
    bullets: [
      'Divine punishment for sin',
      'Original sin & human fallen state',
      'Prayer & repentance as primary cure'
    ],
    words: [
      { term: 'Divine punishment for sin', clue: 'The medieval Catholic Church taught that illness was a divine punishment sent by God to cleanse sin, leading sufferers to prioritize spiritual repentance over physical medical treatment.' },
      { term: 'Original sin & human fallen state', clue: 'Ordinary peasants and learned scholars believed humanity was inherently fallen, meaning bodily afflictions were natural reminders of moral weakness.' },
      { term: 'Prayer & repentance as primary cure', clue: 'Because God sent disease, devout Christians believed genuine confession, fasting, and heartfelt prayer were the only reliable remedies.' }
    ],
    model_sentence: 'Rooted in <strong>Original sin & human fallen state</strong>, ordinary people accepted sickness as <strong>Divine punishment for sin</strong>, relying on <strong>Prayer & repentance as primary cure</strong>.'
  },
  {
    step: 2,
    date: 'c1280',
    para_ref: '[2.1–2.2]',
    heading: 'Why was leprosy viewed as visible proof of divine judgment?',
    title: 'Moral Taint: Leprosy & Social Exclusion',
    dates: 'c1280',
    focus_clue: 'Why was leprosy viewed as visible proof of divine judgment?',
    bullets: [
      'Biblical leprosy moral stigma',
      'Exile to isolated Lazar houses',
      'Warning wooden clappers & bells'
    ],
    words: [
      { term: 'Biblical leprosy moral stigma', clue: 'Lepers were believed to bear an outward physical sign of internal moral corruption, lust, and divine condemnation.' },
      { term: 'Exile to isolated Lazar houses', clue: 'Sufferers were legally cast out of towns and forced to live in isolated Lazar houses beyond city gates.' },
      { term: 'Warning wooden clappers & bells', clue: 'Lepers were forced to wear heavy hooded cloaks and sound wooden clappers or warning bells to alert healthy travellers.' }
    ],
    model_sentence: 'Bearing the painful <strong>Biblical leprosy moral stigma</strong>, victims faced <strong>Exile to isolated Lazar houses</strong> while sounding <strong>Warning wooden clappers & bells</strong>.'
  },
  {
    step: 3,
    date: '1345',
    para_ref: '[3.1–3.2]',
    heading: 'How did the Church reconcile astrology with Christian doctrine?',
    title: 'Astrological Explanations & The Zodiac Man',
    dates: '1345',
    focus_clue: 'How did the Church reconcile astrology with Christian doctrine?',
    bullets: [
      'Zodiac Man parchment wheels',
      '1345 planetary conjunction',
      'Mars, Saturn & Jupiter alignment'
    ],
    words: [
      { term: 'Zodiac Man parchment wheels', clue: 'Physicians consulted complex astrological parchment wheels linking each sign of the Zodiac to governing body parts before bleeding or purging.' },
      { term: '1345 planetary conjunction', clue: 'The conjunction of Mars, Jupiter, and Saturn under Aquarius in 1345 was widely cited by church scholars as the celestial trigger of the Black Death.' },
      { term: 'Mars, Saturn & Jupiter alignment', clue: 'Planetary alignments were viewed as instruments of God’s cosmic will, transmitting corrupting miasma through the night air.' }
    ],
    model_sentence: 'Medieval physicians consulted <strong>Zodiac Man parchment wheels</strong>, blaming the fateful <strong>1345 planetary conjunction</strong> and <strong>Mars, Saturn & Jupiter alignment</strong> for corrupting the air.'
  },
  {
    step: 4,
    date: 'c1350',
    para_ref: '[4.1–4.2]',
    heading: 'Why did sick people turn to pilgrimage shrines rather than doctors?',
    title: 'Spiritual Intercession, Relics & Pilgrimage',
    dates: 'c1350',
    focus_clue: 'Why did sick people turn to pilgrimage shrines rather than doctors?',
    bullets: [
      'Arduous pilgrimage to Canterbury',
      'Kissing holy relics of saints',
      'Chantry masses & sale of indulgences'
    ],
    words: [
      { term: 'Arduous pilgrimage to Canterbury', clue: 'Thousands of sick believers walked barefoot to holy shrines such as Thomas Becket’s tomb at Canterbury Cathedral in search of miraculous cures.' },
      { term: 'Kissing holy relics of saints', clue: 'Touching or kissing bone fragments, garments, and relics of holy saints was believed to channel divine healing grace.' },
      { term: 'Chantry masses & sale of indulgences', clue: 'Wealthy families founded chantry chapels and bought papal indulgences to shorten suffering in purgatory and secure physical recovery.' }
    ],
    model_sentence: 'Seeking miraculous cures, pilgrims undertook the <strong>Arduous pilgrimage to Canterbury</strong>, reverently <strong>Kissing holy relics of saints</strong> and funding <strong>Chantry masses & sale of indulgences</strong>.'
  },
  {
    step: 5,
    date: 'c1400',
    para_ref: '[5.1–5.2]',
    heading: 'Why did church enforcement of Galen prevent medical progress?',
    title: 'Monastic Scriptoria, Galen & Censorship',
    dates: 'c1400',
    focus_clue: 'Why did church enforcement of Galen prevent medical progress?',
    bullets: [
      'Monastic scriptoria Latin copying',
      'Galen purposeful creator dogma',
      'Roger Bacon imprisoned for heresy (1277)'
    ],
    words: [
      { term: 'Monastic scriptoria Latin copying', clue: 'Monks in scriptoria painstakingly hand-copied ancient Latin manuscripts, preserving traditional Galenic ideas without challenging or verifying them.' },
      { term: 'Galen purposeful creator dogma', clue: 'Because pagan Galen taught the human body was made by a purposeful divine designer, the Catholic Church treated his anatomical writings as indisputable sacred dogma.' },
      { term: 'Roger Bacon imprisoned for heresy (1277)', clue: 'Franciscan friar Roger Bacon was imprisoned by church authorities in 1277 after arguing that empirical observation should replace blind obedience to ancient texts.' }
    ],
    model_sentence: 'Through <strong>Monastic scriptoria Latin copying</strong> and enforcing <strong>Galen purposeful creator dogma</strong>, the Church suppressed empirical science, leaving <strong>Roger Bacon imprisoned for heresy (1277)</strong>.'
  }
];

fs.writeFileSync(medDataPath, JSON.stringify(medData, null, 2), 'utf8');
console.log('Successfully updated data/edexcel_medicine.json for lesson_1_1!');

