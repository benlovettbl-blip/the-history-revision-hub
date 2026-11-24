/**
 * Disciplinary & Conceptual Glossary Engine (Literacy Engine v2)
 *
 * Provides a corpus-mined, plain-English Tier 2 & Tier 3 vocabulary framework
 * across KS2, KS3, and GCSE (narrative prose + primary source extracts).
 *
 * Design principles:
 *  - Plain-English definitions (<= 18 words) so definitions never exceed the word's own reading age.
 *  - KS2 Bridge subset (`ks2: true`) enables concrete hover/tap scaffolding on Years 5–6 units.
 *  - Morphological matching (plurals, -ism/-ist, -y/-ies/-ic, -tion/-tive, past/present stems).
 *  - Priority ranking: Current Lesson Vocab (3) > Unit Vocab (2) > Master Glossary (1).
 *  - Baseline Tier-2/3 terms skip inside bold anchors (<strong> / **...**) to keep visual channels clean.
 */

export const MASTER_DISCIPLINARY_GLOSSARY = [
  // =========================================================================
  // 1. CORE TIER-2 ACADEMIC HISTORY VOCABULARY (Cross-Era Workhorses)
  // =========================================================================
  {
    term: 'Administrative',
    definition: 'Relating to the everyday running, record-keeping, and organisation of a government or empire.',
    syllables: 'ad-min-is-tra-tive',
    phonetic: 'ədˈmɪnɪstrətɪv',
    tier: '2',
    variants: ['administration', 'administrator', 'administrators'],
  },
  {
    term: 'Allegiance',
    definition: 'Loyalty and obedience owed by a person or group to a ruler, country, or cause.',
    syllables: 'al-le-giance',
    phonetic: 'əˈliːdʒəns',
    tier: '2',
    variants: ['oath of allegiance'],
  },
  {
    term: 'Assimilation',
    definition: 'Forcing or encouraging a minority group to adopt the culture and language of the majority.',
    syllables: 'as-sim-i-la-tion',
    phonetic: 'əˌsɪmɪˈleɪʃən',
    tier: '2',
    variants: ['assimilate', 'assimilated'],
  },
  {
    term: 'Austerity',
    definition: 'Strict government cuts to public spending and living standards during an economic crisis.',
    syllables: 'au-ster-i-ty',
    phonetic: 'ɔːˈsterəti',
    tier: '2',
    variants: ['austerity measures'],
  },
  {
    term: 'Autonomy',
    definition: 'The right of a region or group to govern its own affairs independently.',
    syllables: 'au-ton-o-my',
    phonetic: 'ɔːˈtɒnəmi',
    tier: '2',
    variants: ['autonomous'],
  },
  {
    term: 'Bias',
    definition: 'A one-sided viewpoint or preference that affects how someone reports an event.',
    syllables: 'bi-as',
    phonetic: 'ˈbaɪəs',
    tier: '2',
    ks2: true,
    variants: ['biased'],
  },
  {
    term: 'Bureaucracy',
    definition: 'A large system of government officials and rules used to run a state.',
    syllables: 'bu-reau-cra-cy',
    phonetic: 'bjʊəˈrɒkrəsi',
    tier: '2',
    variants: ['bureaucratic', 'bureaucrat', 'bureaucrats'],
  },
  {
    term: 'Catalyst',
    definition: 'An event or person that triggers sudden, major historical change.',
    syllables: 'cat-a-lyst',
    phonetic: 'ˈkætəlɪst',
    tier: '2',
    variants: ['catalysts'],
  },
  {
    term: 'Catastrophic',
    definition: 'Causing sudden, terrible disaster, destruction, or mass suffering.',
    syllables: 'cat-a-stroph-ic',
    phonetic: 'ˌkætəˈstrɒfɪk',
    tier: '2',
    variants: ['catastrophe'],
  },
  {
    term: 'Cemented',
    definition: 'Made a position, rule, or relationship firm, secure, and very hard to break.',
    syllables: 'ce-ment-ed',
    phonetic: 'sɪˈmentɪd',
    tier: '2',
    variants: ['cement'],
  },
  {
    term: 'Chronicle',
    definition: 'A written record of historical events listed in the order they happened.',
    syllables: 'chron-i-cle',
    phonetic: 'ˈkrɒnɪkəl',
    tier: '2',
    ks2: true,
    variants: ['chronicles', 'chronicler', 'chroniclers'],
  },
  {
    term: 'Chronology',
    definition: 'The arrangement of historical events in exact time order from earliest to latest.',
    syllables: 'chro-nol-o-gy',
    phonetic: 'krəˈnɒlədʒi',
    tier: '2',
    ks2: true,
    variants: ['chronological'],
  },
  {
    term: 'Coalition',
    definition: 'A temporary alliance of different political parties or countries working together.',
    syllables: 'co-a-li-tion',
    phonetic: 'ˌkəʊəˈlɪʃən',
    tier: '2',
    variants: ['coalitions', 'coalition government'],
  },
  {
    term: 'Coercion',
    definition: 'Using threats, force, or intimidation to make people obey.',
    syllables: 'co-er-cion',
    phonetic: 'kəʊˈɜːʃən',
    tier: '2',
    variants: ['coercive', 'coerce', 'coerced'],
  },
  {
    term: 'Commerce',
    definition: 'Large-scale buying, selling, and trading of goods between regions or countries.',
    syllables: 'com-merce',
    phonetic: 'ˈkɒmɜːs',
    tier: '2',
    variants: ['commercial'],
  },
  {
    term: 'Commissioned',
    definition: 'Officially ordered or hired someone to carry out a major task, survey, or building.',
    syllables: 'com-mis-sioned',
    phonetic: 'kəˈmɪʃənd',
    tier: '2',
    variants: ['commission', 'commissioners', 'commissioner'],
  },
  {
    term: 'Compromise',
    definition: 'An agreement reached when both sides give up part of what they wanted.',
    syllables: 'com-pro-mise',
    phonetic: 'ˈkɒmprəmaɪz',
    tier: '2',
    ks2: true,
    variants: ['compromises', 'compromised'],
  },
  {
    term: 'Compulsory',
    definition: 'Required by law or strict rule, leaving people with no choice.',
    syllables: 'com-pul-so-ry',
    phonetic: 'kəmˈpʌlsəri',
    tier: '2',
    variants: ['mandatory'],
  },
  {
    term: 'Concession',
    definition: 'Something given up or granted to another side to end an argument or avoid conflict.',
    syllables: 'con-ces-sion',
    phonetic: 'kənˈseʃən',
    tier: '2',
    variants: ['concessions'],
  },
  {
    term: 'Consolidate',
    definition: 'To strengthen and lock in power or control so rivals cannot easily overturn it.',
    syllables: 'con-sol-i-date',
    phonetic: 'kənˈsɒlɪdeɪt',
    tier: '2',
    variants: ['consolidated', 'consolidation', 'consolidating'],
  },
  {
    term: 'Corruption',
    definition: 'Dishonest behaviour by people in power, such as taking bribes or stealing public money.',
    syllables: 'cor-rup-tion',
    phonetic: 'kəˈrʌpʃən',
    tier: '2',
    variants: ['corrupt'],
  },
  {
    term: 'Decisive',
    definition: 'Having a clear, major effect that settles the final outcome of an event or war.',
    syllables: 'de-ci-sive',
    phonetic: 'dɪˈsaɪsɪv',
    tier: '2',
    variants: ['decisively'],
  },
  {
    term: 'Defiance',
    definition: 'Open, bold refusal to obey a ruler, law, or authority.',
    syllables: 'de-fi-ance',
    phonetic: 'dɪˈfaɪəns',
    tier: '2',
    variants: ['defiant', 'defy', 'defied'],
  },
  {
    term: 'Deportation',
    definition: 'Forcibly removing people from their homes or country and sending them elsewhere.',
    syllables: 'de-por-ta-tion',
    phonetic: 'ˌdiːpɔːˈteɪʃən',
    tier: '2',
    variants: ['deport', 'deported', 'deportations'],
  },
  {
    term: 'Devastating',
    definition: 'Causing severe, widespread destruction, grief, or ruin.',
    syllables: 'dev-as-tat-ing',
    phonetic: 'ˈdevəsteɪtɪŋ',
    tier: '2',
    variants: ['devastation', 'devastated'],
  },
  {
    term: 'Diplomacy',
    definition: 'Managing relations between countries through peaceful talks, deals, and ambassadors.',
    syllables: 'di-plo-ma-cy',
    phonetic: 'dɪˈpləʊməsi',
    tier: '2',
    variants: ['diplomatic', 'diplomat', 'diplomats'],
  },
  {
    term: 'Displaced',
    definition: 'Forced to leave your home or country because of war, persecution, or disaster.',
    syllables: 'dis-placed',
    phonetic: 'dɪsˈpleɪst',
    tier: '2',
    variants: ['displacement'],
  },
  {
    term: 'Dispossession',
    definition: 'Taking away someone’s land, home, or property by law or force.',
    syllables: 'dis-pos-ses-sion',
    phonetic: 'ˌdɪspəˈzeʃən',
    tier: '2',
    variants: ['dispossessed', 'dispossess'],
  },
  {
    term: 'Dissent',
    definition: 'Publicly disagreeing with or speaking out against official government policies.',
    syllables: 'dis-sent',
    phonetic: 'dɪˈsent',
    tier: '2',
    variants: ['dissenter', 'dissenters', 'dissident', 'dissidents'],
  },
  {
    term: 'Doctrine',
    definition: 'An official set of core beliefs or guiding rules followed by a government or church.',
    syllables: 'doc-trine',
    phonetic: 'ˈdɒktrɪn',
    tier: '2',
    variants: ['doctrines', 'dogma'],
  },
  {
    term: 'Empirical',
    definition: 'Based on direct observation, evidence, and testing rather than guesswork or tradition.',
    syllables: 'em-pir-i-cal',
    phonetic: 'ɪmˈpɪrɪkəl',
    tier: '2',
    variants: ['empiricism'],
  },
  {
    term: 'Espionage',
    definition: 'Secretly spying to gather political, military, or industrial secrets.',
    syllables: 'es-pi-o-nage',
    phonetic: 'ˈespiənɑːʒ',
    tier: '2',
    variants: ['spy', 'spies'],
  },
  {
    term: 'Exhaustive',
    definition: 'Extremely thorough and complete, checking every single detail without leaving anything out.',
    syllables: 'ex-haus-tive',
    phonetic: 'ɪɡˈzɔːstɪv',
    tier: '2',
    variants: ['exhaustively'],
  },
  {
    term: 'Exile',
    definition: 'Being forced to live away from your own country, usually for political reasons.',
    syllables: 'ex-ile',
    phonetic: 'ˈeksaɪl',
    tier: '2',
    variants: ['exiled', 'exiles'],
  },
  {
    term: 'Exploitation',
    definition: 'Treating workers, peoples, or land unfairly to make profit or gain power.',
    syllables: 'ex-ploi-ta-tion',
    phonetic: 'ˌeksplɔɪˈteɪʃən',
    tier: '2',
    variants: ['exploit', 'exploited', 'exploiting'],
  },
  {
    term: 'Eyewitness',
    definition: 'A person who personally saw an event happen and can give a first-hand account.',
    syllables: 'eye-wit-ness',
    phonetic: 'ˈaɪwɪtnəs',
    tier: '2',
    ks2: true,
    variants: ['eyewitnesses'],
  },
  {
    term: 'Faction',
    definition: 'A smaller, competing group within a larger political party, court, or movement.',
    syllables: 'fac-tion',
    phonetic: 'ˈfækʃən',
    tier: '2',
    variants: ['factions', 'factional'],
  },
  {
    term: 'Fiscal',
    definition: 'Relating to government taxes, public spending, and national money.',
    syllables: 'fis-cal',
    phonetic: 'ˈfɪskəl',
    tier: '2',
    variants: ['fiscal revenue', 'fiscal policy'],
  },
  {
    term: 'Grievance',
    definition: 'A deep sense of unfair treatment or complaint that fuels protest or anger.',
    syllables: 'griev-ance',
    phonetic: 'ˈɡriːvəns',
    tier: '2',
    variants: ['grievances'],
  },
  {
    term: 'Hegemony',
    definition: 'Dominant political, military, or cultural control held by one powerful state over others.',
    syllables: 'he-gem-o-ny',
    phonetic: 'hɪˈɡeməni',
    tier: '2',
    variants: ['hegemonic'],
  },
  {
    term: 'Hierarchy',
    definition: 'A social or political ladder ranking people from the most powerful at the top to the lowest.',
    syllables: 'hi-er-ar-chy',
    phonetic: 'ˈhaɪərɑːki',
    tier: '2',
    variants: ['hierarchies', 'hierarchical'],
  },
  {
    term: 'Infrastructure',
    definition: 'The basic physical networks a country needs to work, such as roads, railways, bridges, and sewers.',
    syllables: 'in-fra-struc-ture',
    phonetic: 'ˈɪnfrəstrʌktʃə',
    tier: '2',
    variants: ['infrastructures'],
  },
  {
    term: 'Innovation',
    definition: 'A major new invention, method, or idea that changes how things are done.',
    syllables: 'in-no-va-tion',
    phonetic: 'ˌɪnəˈveɪʃən',
    tier: '2',
    variants: ['innovations', 'innovative'],
  },
  {
    term: 'Legacy',
    definition: 'The lasting impact or long-term consequences left behind after an event or ruler.',
    syllables: 'leg-a-cy',
    phonetic: 'ˈleɡəsi',
    tier: '2',
    variants: ['legacies'],
  },
  {
    term: 'Legitimacy',
    definition: 'The accepted legal or moral right of a ruler or government to hold power.',
    syllables: 'le-git-i-ma-cy',
    phonetic: 'lɪˈdʒɪtɪməsi',
    tier: '2',
    variants: ['legitimate', 'illegitimate'],
  },
  {
    term: 'Municipal',
    definition: 'Relating to a local town or city council and the public services it runs.',
    syllables: 'mu-nic-i-pal',
    phonetic: 'mjuːˈnɪsɪpəl',
    tier: '2',
    variants: ['municipality'],
  },
  {
    term: 'Negotiation',
    definition: 'Formal discussions between opposing sides to try to reach a peaceful agreement.',
    syllables: 'ne-go-ti-a-tion',
    phonetic: 'nɪˌɡəʊʃiˈeɪʃən',
    tier: '2',
    variants: ['negotiations', 'negotiate', 'negotiated'],
  },
  {
    term: 'Oath',
    definition: 'A solemn, binding promise—often sworn before God—to tell the truth or stay loyal.',
    syllables: 'oath',
    phonetic: 'əʊθ',
    tier: '2',
    ks2: true,
    variants: ['oaths'],
  },
  {
    term: 'Oppression',
    definition: 'Cruel, unfair, and long-term control used by powerful groups to keep others down.',
    syllables: 'op-pres-sion',
    phonetic: 'əˈpreʃən',
    tier: '2',
    variants: ['oppressive', 'oppressed', 'oppress'],
  },
  {
    term: 'Persecution',
    definition: 'Cruel, persistent mistreatment of a group because of their religion, race, or beliefs.',
    syllables: 'per-se-cu-tion',
    phonetic: 'ˌpɜːsɪˈkjuːʃən',
    tier: '2',
    variants: ['persecute', 'persecuted'],
  },
  {
    term: 'Precedent',
    definition: 'An earlier decision or event used as a rule or example for future cases.',
    syllables: 'prec-e-dent',
    phonetic: 'ˈpresɪdənt',
    tier: '2',
    variants: ['precedents'],
  },
  {
    term: 'Radical',
    definition: 'Pushing for sudden, sweeping, or extreme change to politics or society.',
    syllables: 'rad-i-cal',
    phonetic: 'ˈrædɪkəl',
    tier: '2',
    variants: ['radicals', 'radicalism'],
  },
  {
    term: 'Reform',
    definition: 'Making gradual improvements to laws, institutions, or society without violent revolution.',
    syllables: 're-form',
    phonetic: 'rɪˈfɔːm',
    tier: '2',
    variants: ['reforms', 'reformer', 'reformers', 'reformed'],
  },
  {
    term: 'Regime',
    definition: 'A government or ruling system, especially an authoritarian or strict one.',
    syllables: 're-gime',
    phonetic: 'reɪˈʒiːm',
    tier: '2',
    variants: ['regimes'],
  },
  {
    term: 'Regressive',
    definition: 'A tax or policy that hits poorer people much harder than wealthy people.',
    syllables: 're-gres-sive',
    phonetic: 'rɪˈɡresɪv',
    tier: '2',
    variants: ['regressive tax'],
  },
  {
    term: 'Repression',
    definition: 'Using force, censorship, or arrests to crush protest and keep a population quiet.',
    syllables: 're-pres-sion',
    phonetic: 'rɪˈpreʃən',
    tier: '2',
    variants: ['repressive', 'repressed'],
  },
  {
    term: 'Resentment',
    definition: 'Deep, simmering bitterness and anger over perceived injustice or humiliation.',
    syllables: 're-sent-ment',
    phonetic: 'rɪˈzentmənt',
    tier: '2',
    variants: ['resented', 'resentful'],
  },
  {
    term: 'Resistance',
    definition: 'Refusing to accept control and actively fighting back against an occupier or ruler.',
    syllables: 're-sist-ance',
    phonetic: 'rɪˈzɪstəns',
    tier: '2',
    ks2: true,
    variants: ['resist', 'resisted'],
  },
  {
    term: 'Retaliation',
    definition: 'Striking back in revenge after being attacked or harmed.',
    syllables: 're-tal-i-a-tion',
    phonetic: 'rɪˌtæliˈeɪʃən',
    tier: '2',
    variants: ['retaliate', 'retaliatory', 'reprisal', 'reprisals'],
  },
  {
    term: 'Revenue',
    definition: 'The total money collected by a king or government through taxes, rents, and trade.',
    syllables: 'rev-e-nue',
    phonetic: 'ˈrevənjuː',
    tier: '2',
    variants: ['revenues', 'tax revenue'],
  },
  {
    term: 'Sabotage',
    definition: 'Deliberately damaging machinery, railways, or supplies to disrupt an enemy or employer.',
    syllables: 'sab-o-tage',
    phonetic: 'ˈsæbətɑːʒ',
    tier: '2',
    variants: ['sabotaged', 'saboteurs'],
  },
  {
    term: 'Secular',
    definition: 'Separate from religion; controlled by the state or everyday law rather than the Church.',
    syllables: 'sec-u-lar',
    phonetic: 'ˈsekjʊlə',
    tier: '2',
    variants: ['secularism'],
  },
  {
    term: 'Solidarity',
    definition: 'Unity and mutual support among people sharing a common struggle or goal.',
    syllables: 'sol-i-dar-i-ty',
    phonetic: 'ˌsɒlɪˈdærəti',
    tier: '2',
    variants: [],
  },
  {
    term: 'Strategic',
    definition: 'Carefully planned to gain a vital long-term military, geographic, or political advantage.',
    syllables: 'stra-te-gic',
    phonetic: 'strəˈtiːdʒɪk',
    tier: '2',
    variants: ['strategy', 'strategically'],
  },
  {
    term: 'Subjugation',
    definition: 'Conquering a people and forcing them under total obedience and control.',
    syllables: 'sub-ju-ga-tion',
    phonetic: 'ˌsʌbdʒʊˈɡeɪʃən',
    tier: '2',
    variants: ['subjugate', 'subjugated'],
  },
  {
    term: 'Surveillance',
    definition: 'Close, constant watching and record-keeping of people by rulers, police, or spies.',
    syllables: 'sur-veil-lance',
    phonetic: 'sɜːˈveɪləns',
    tier: '2',
    variants: ['state surveillance'],
  },
  {
    term: 'Systematic',
    definition: 'Carried out according to a deliberate, thorough, step-by-step plan rather than by chance.',
    syllables: 'sys-te-mat-ic',
    phonetic: 'ˌsɪstəˈmætɪk',
    tier: '2',
    variants: ['systematically'],
  },
  {
    term: 'Ultimatum',
    definition: 'A final demand backed by a threat of war or punishment if it is refused.',
    syllables: 'ul-ti-ma-tum',
    phonetic: 'ˌʌltɪˈmeɪtəm',
    tier: '2',
    variants: ['ultimatums'],
  },
  {
    term: 'Undermine',
    definition: 'To gradually weaken someone’s power, confidence, or authority from underneath.',
    syllables: 'un-der-mine',
    phonetic: 'ˌʌndəˈmaɪn',
    tier: '2',
    variants: ['undermined', 'undermining'],
  },
  {
    term: 'Unprecedented',
    definition: 'Never having happened before in history; completely new in scale or impact.',
    syllables: 'un-prec-e-dent-ed',
    phonetic: 'ʌnˈpresɪdentɪd',
    tier: '2',
    variants: [],
  },

  // =========================================================================
  // 2. MEDIEVAL, EARLY MODERN & EMPIRE TIER-3 CONCEPTS
  // =========================================================================
  {
    term: 'Feudalism',
    definition: 'The medieval system where the king lent land to lords in return for loyalty and knights.',
    syllables: 'feu-dal-ism',
    phonetic: 'ˈfjuːdəlɪzəm',
    tier: '3',
    variants: ['feudal', 'feudal system', 'feudal pyramid'],
  },
  {
    term: 'Vassal',
    definition: 'A medieval noble or knight who swore loyalty to a lord in exchange for land.',
    syllables: 'vas-sal',
    phonetic: 'ˈvæsəl',
    tier: '3',
    variants: ['vassals', 'vassalage'],
  },
  {
    term: 'Serfdom',
    definition: 'The system tying medieval peasants to a lord’s land, forcing them to work without pay.',
    syllables: 'serf-dom',
    phonetic: 'ˈsɜːfdəm',
    tier: '3',
    variants: ['serf', 'serfs'],
  },
  {
    term: 'Peasant',
    definition: 'A poor medieval farm labourer who worked the land for a local lord.',
    syllables: 'peas-ant',
    phonetic: 'ˈpezənt',
    tier: '2',
    ks2: true,
    variants: ['peasants', 'peasantry'],
  },
  {
    term: 'Manor',
    definition: 'A medieval lord’s landed estate, including the village, farmland, and manor house.',
    syllables: 'man-or',
    phonetic: 'ˈmænə',
    tier: '3',
    variants: ['manors', 'manorial'],
  },
  {
    term: 'Monastery',
    definition: 'A religious community where monks lived, prayed, copied books, and cared for the sick.',
    syllables: 'mon-as-ter-y',
    phonetic: 'ˈmɒnəstri',
    tier: '3',
    ks2: true,
    variants: ['monasteries', 'monastic', 'monk', 'monks'],
  },
  {
    term: 'Clergy',
    definition: 'Ordained church officials—such as priests, bishops, and monks—who led Christian worship.',
    syllables: 'cler-gy',
    phonetic: 'ˈklɜːdʒi',
    tier: '3',
    variants: ['clerical', 'cleric', 'clerics'],
  },
  {
    term: 'Papacy',
    definition: 'The office and authority of the Pope as head of the Roman Catholic Church.',
    syllables: 'pa-pa-cy',
    phonetic: 'ˈpeɪpəsi',
    tier: '3',
    variants: ['papal'],
  },
  {
    term: 'Archbishop',
    definition: 'The most senior bishop leading the Church across a major region or country.',
    syllables: 'arch-bish-op',
    phonetic: 'ˌɑːtʃˈbɪʃəp',
    tier: '3',
    variants: ['archbishops'],
  },
  {
    term: 'Excommunicate',
    definition: 'To officially expel someone from the Catholic Church, cutting them off from salvation.',
    syllables: 'ex-com-mu-ni-cate',
    phonetic: 'ˌekskəˈmjuːnɪkeɪt',
    tier: '3',
    variants: ['excommunicated', 'excommunication'],
  },
  {
    term: 'Interdict',
    definition: 'A papal punishment banning church services, weddings, and burials across an entire kingdom.',
    syllables: 'in-ter-dict',
    phonetic: 'ˈɪntədɪkt',
    tier: '3',
    variants: ['papal interdict'],
  },
  {
    term: 'Heresy',
    definition: 'Holding religious beliefs that directly contradict the official teachings of the Church.',
    syllables: 'her-e-sy',
    phonetic: 'ˈherəsi',
    tier: '3',
    variants: ['heretic', 'heretics', 'heretical'],
  },
  {
    term: 'Martyr',
    definition: 'Someone who is killed for refusing to give up their religious or political beliefs.',
    syllables: 'mar-tyr',
    phonetic: 'ˈmɑːtə',
    tier: '3',
    variants: ['martyrs', 'martyrdom'],
  },
  {
    term: 'Charter',
    definition: 'An official written grant of legal rights, freedoms, or land sealed by a monarch.',
    syllables: 'char-ter',
    phonetic: 'ˈtʃɑːtə',
    tier: '3',
    ks2: true,
    variants: ['charters', 'royal charter'],
  },
  {
    term: 'Baron',
    definition: 'A powerful medieval nobleman who held large estates directly from the king.',
    syllables: 'bar-on',
    phonetic: 'ˈbærən',
    tier: '3',
    variants: ['barons', 'baronial'],
  },
  {
    term: 'Dynasty',
    definition: 'A line of hereditary rulers from the same royal family, such as the Tudors.',
    syllables: 'dyn-as-ty',
    phonetic: 'ˈdɪnəsti',
    tier: '3',
    ks2: true,
    variants: ['dynasties', 'dynastic'],
  },
  {
    term: 'Succession',
    definition: 'The legal order and process by which the next king or queen inherits the throne.',
    syllables: 'suc-ces-sion',
    phonetic: 'səkˈseʃən',
    tier: '3',
    variants: ['heir', 'heirs'],
  },
  {
    term: 'Treason',
    definition: 'The crime of betraying your monarch or country, such as plotting rebellion or assassination.',
    syllables: 'trea-son',
    phonetic: 'ˈtriːzən',
    tier: '3',
    variants: ['treasonous', 'traitor', 'traitors'],
  },
  {
    term: 'Sedition',
    definition: 'Speech or writing that encourages people to rebel against the monarch or government.',
    syllables: 'se-di-tion',
    phonetic: 'sɪˈdɪʃən',
    tier: '3',
    variants: ['seditious'],
  },
  {
    term: 'Usurper',
    definition: 'Someone who seizes a throne or position of power illegally by force.',
    syllables: 'u-surp-er',
    phonetic: 'juːˈzɜːpə',
    tier: '3',
    variants: ['usurp', 'usurped'],
  },
  {
    term: 'Rebellion',
    definition: 'An organised, often armed uprising against a ruler or government.',
    syllables: 're-bel-lion',
    phonetic: 'rɪˈbeljən',
    tier: '2',
    ks2: true,
    variants: ['rebellions', 'revolt', 'revolts', 'uprising', 'uprisings'],
  },
  {
    term: 'Insurrection',
    definition: 'A violent, organised uprising aimed at overthrowing an existing government.',
    syllables: 'in-sur-rec-tion',
    phonetic: 'ˌɪnsəˈrekʃən',
    tier: '3',
    variants: ['insurrections', 'insurgency', 'insurgents'],
  },
  {
    term: 'Mutiny',
    definition: 'An open rebellion by soldiers or sailors against the orders of their commanding officers.',
    syllables: 'mu-ti-ny',
    phonetic: 'ˈmjuːtɪni',
    tier: '3',
    variants: ['mutinies', 'mutineers'],
  },
  {
    term: 'Conspiracy',
    definition: 'A secret plan made by a group of people to carry out an illegal or harmful act.',
    syllables: 'con-spir-a-cy',
    phonetic: 'kənˈspɪrəsi',
    tier: '2',
    variants: ['conspiracies', 'conspirators'],
  },
  {
    term: 'Assassination',
    definition: 'The deliberate murder of an important political or religious leader.',
    syllables: 'as-sas-si-na-tion',
    phonetic: 'əˌsæsɪˈneɪʃən',
    tier: '2',
    variants: ['assassinate', 'assassinated', 'assassin'],
  },
  {
    term: 'Siege',
    definition: 'Surrounding a castle or city with an army to cut off supplies until it surrenders.',
    syllables: 'siege',
    phonetic: 'siːdʒ',
    tier: '3',
    ks2: true,
    variants: ['sieges', 'besieged'],
  },
  {
    term: 'Garrison',
    definition: 'A body of troops stationed inside a fort, castle, or town to guard and control it.',
    syllables: 'gar-ri-son',
    phonetic: 'ˈɡærɪsən',
    tier: '3',
    variants: ['garrisons'],
  },
  {
    term: 'Cavalry',
    definition: 'Soldiers trained to fight on horseback for fast charges and scouting.',
    syllables: 'cav-al-ry',
    phonetic: 'ˈkævəlri',
    tier: '3',
    variants: [],
  },
  {
    term: 'Infantry',
    definition: 'Foot soldiers who march and fight on foot rather than on horseback or in tanks.',
    syllables: 'in-fan-try',
    phonetic: 'ˈɪnfəntri',
    tier: '3',
    variants: [],
  },
  {
    term: 'Artillery',
    definition: 'Heavy, large-calibre guns and cannons used to bombard enemy positions from a distance.',
    syllables: 'ar-til-ler-y',
    phonetic: 'ɑːˈtɪləri',
    tier: '3',
    variants: ['artillery barrage'],
  },
  {
    term: 'Armada',
    definition: 'A huge fleet of armed warships assembled for a major naval invasion.',
    syllables: 'ar-ma-da',
    phonetic: 'ɑːˈmɑːdə',
    tier: '3',
    variants: ['Spanish Armada'],
  },
  {
    term: 'Privateer',
    definition: 'An armed private ship given royal permission to attack and rob enemy vessels.',
    syllables: 'pri-va-teer',
    phonetic: 'ˌpraɪvəˈtɪə',
    tier: '3',
    variants: ['privateers', 'privateering'],
  },
  {
    term: 'Crusade',
    definition: 'A medieval religious military expedition launched by European Christians to capture the Holy Land.',
    syllables: 'cru-sade',
    phonetic: 'kruːˈseɪd',
    tier: '3',
    variants: ['crusades', 'crusaders'],
  },
  {
    term: 'Famine',
    definition: 'An extreme, widespread shortage of food causing mass starvation and death.',
    syllables: 'fam-ine',
    phonetic: 'ˈfæmɪn',
    tier: '2',
    ks2: true,
    variants: ['famines'],
  },
  {
    term: 'Plague',
    definition: 'A deadly, fast-spreading contagious disease, especially the 1348 Black Death.',
    syllables: 'plague',
    phonetic: 'pleɪɡ',
    tier: '2',
    ks2: true,
    variants: ['pestilence', 'bubonic plague'],
  },
  {
    term: 'Buboes',
    definition: 'Painful, egg-sized swollen black lumps in the armpits or groin caused by bubonic plague.',
    syllables: 'bu-boes',
    phonetic: 'ˈbjuːbəʊz',
    tier: '3',
    variants: ['bubo'],
  },
  {
    term: 'Gentry',
    definition: 'Wealthy landowners just below the nobility who ran local courts and sat in Parliament.',
    syllables: 'gen-try',
    phonetic: 'ˈdʒentri',
    tier: '3',
    variants: ['aristocracy', 'aristocratic'],
  },
  {
    term: 'Merchant',
    definition: 'A trader who buys and sells goods—often across seas—to make a profit.',
    syllables: 'mer-chant',
    phonetic: 'ˈmɜːtʃənt',
    tier: '2',
    ks2: true,
    variants: ['merchants'],
  },
  {
    term: 'Monopoly',
    definition: 'Exclusive legal control held by one company or person over all trade in a product.',
    syllables: 'mo-nop-o-ly',
    phonetic: 'məˈnɒpəli',
    tier: '3',
    variants: ['monopolies'],
  },
  {
    term: 'Plantation',
    definition: 'A large colonial estate growing cash crops like sugar or cotton using forced or enslaved labour.',
    syllables: 'plan-ta-tion',
    phonetic: 'plænˈteɪʃən',
    tier: '3',
    variants: ['plantations'],
  },
  {
    term: 'Abolition',
    definition: 'The official ending of a practice or law, especially the campaign to end slavery.',
    syllables: 'ab-o-li-tion',
    phonetic: 'ˌæbəˈlɪʃən',
    tier: '3',
    variants: ['abolitionist', 'abolitionists', 'abolish', 'abolished'],
  },
  {
    term: 'Emancipation',
    definition: 'Setting a group free from slavery, serfdom, or legal restrictions.',
    syllables: 'e-man-ci-pa-tion',
    phonetic: 'ɪˌmænsɪˈpeɪʃən',
    tier: '3',
    variants: ['emancipated'],
  },
  {
    term: 'Indentured',
    definition: 'Bound by a strict contract to work unpaid for several years to pay off travel or debt.',
    syllables: 'in-den-tured',
    phonetic: 'ɪnˈdentʃəd',
    tier: '3',
    variants: ['indentured servant', 'indentured labour'],
  },
  {
    term: 'Convict',
    definition: 'A person found guilty of a crime; Britain transported thousands to Australian penal colonies.',
    syllables: 'con-vict',
    phonetic: 'ˈkɒnvɪkt',
    tier: '2',
    variants: ['convicts'],
  },
  {
    term: 'Dominion',
    definition: 'A largely self-governing nation inside the British Empire, such as Canada or Australia.',
    syllables: 'do-min-ion',
    phonetic: 'dəˈmɪnjən',
    tier: '3',
    variants: ['dominions'],
  },
  {
    term: 'Mandate',
    definition: 'Official authority granted to a government or power to rule a territory or carry out a policy.',
    syllables: 'man-date',
    phonetic: 'ˈmændeɪt',
    tier: '3',
    variants: ['mandates', 'British Mandate', 'protectorate'],
  },
  {
    term: 'Partition',
    definition: 'Dividing one territory or country into two or more separate political states.',
    syllables: 'par-ti-tion',
    phonetic: 'pɑːˈtɪʃən',
    tier: '3',
    variants: ['partitioned'],
  },
  {
    term: 'Reformation',
    definition: 'The 16th-century split from the Catholic Church that created Protestantism across Europe.',
    syllables: 'ref-or-ma-tion',
    phonetic: 'ˌrefəˈmeɪʃən',
    tier: '3',
    variants: ['Protestant Reformation', 'English Reformation'],
  },
  {
    term: 'Enlightenment',
    definition: 'The 18th-century movement valuing science, reason, and human rights over blind tradition.',
    syllables: 'en-light-en-ment',
    phonetic: 'ɪnˈlaɪtnmənt',
    tier: '3',
    variants: ['Age of Enlightenment'],
  },

  // =========================================================================
  // 3. GOVERNANCE, LAW & ECONOMICS TIER-3 CONCEPTS
  // =========================================================================
  {
    term: 'Democracy',
    definition: 'A system of government where citizens elect their leaders in free, fair votes.',
    syllables: 'de-moc-ra-cy',
    phonetic: 'dɪˈmɒkrəsi',
    tier: '2',
    ks2: true,
    variants: ['democracies', 'democratic', 'multi-party democracy'],
  },
  {
    term: 'Dictatorship',
    definition: 'Rule by one leader or party with total power and no free elections or legal limits.',
    syllables: 'dic-ta-tor-ship',
    phonetic: 'dɪkˈteɪtəʃɪp',
    tier: '2',
    ks2: true,
    variants: ['dictators', 'dictator', 'dictatorial'],
  },
  {
    term: 'Totalitarianism',
    definition: 'A dictatorship that controls every part of public and private life and crushes all opposition.',
    syllables: 'to-tal-i-tar-i-an-ism',
    phonetic: 'təʊˌtælɪˈteəriənɪzəm',
    tier: '3',
    variants: ['totalitarian', 'totalitarian state'],
  },
  {
    term: 'Fascism',
    definition: 'A violent, extreme nationalist dictatorship demanding total obedience and crushing democracy.',
    syllables: 'fas-cism',
    phonetic: 'ˈfæʃɪzəm',
    tier: '3',
    variants: ['fascist', 'fascists'],
  },
  {
    term: 'Monarchy',
    definition: 'A system of government headed by a hereditary king, queen, or emperor.',
    syllables: 'mon-ar-chy',
    phonetic: 'ˈmɒnəki',
    tier: '2',
    ks2: true,
    variants: ['monarch', 'monarchs', 'monarchies', 'monarchical'],
  },
  {
    term: 'Constitutional Monarchy',
    definition: 'A kingdom where the monarch’s power is strictly limited by law and an elected parliament.',
    syllables: 'con-sti-tu-tion-al mon-ar-chy',
    phonetic: 'ˌkɒnstɪˈtjuːʃənl ˈmɒnəki',
    tier: '3',
    variants: ['constitutional monarch', 'limited monarchy'],
  },
  {
    term: 'Authoritarianism',
    definition: 'Strict rule demanding total obedience to the state while restricting personal freedoms.',
    syllables: 'au-thor-i-tar-i-an-ism',
    phonetic: 'ɔːˌθɒrɪˈteəriənɪzəm',
    tier: '3',
    variants: ['authoritarian', 'authoritarian regime', 'autocracy', 'autocratic', 'absolutism'],
  },
  {
    term: 'Tyranny',
    definition: 'Cruel, oppressive rule by a leader who abuses absolute power without legal limits.',
    syllables: 'tyr-an-ny',
    phonetic: 'ˈtɪrəni',
    tier: '2',
    variants: ['tyrant', 'tyrants', 'tyrannical'],
  },
  {
    term: 'Sovereignty',
    definition: 'A country’s supreme right to govern itself without outside interference.',
    syllables: 'sov-er-eign-ty',
    phonetic: 'ˈsɒvrənti',
    tier: '3',
    variants: ['sovereign', 'sovereign state'],
  },
  {
    term: 'Self-Determination',
    definition: 'The right of a people or nation to choose their own government and future freely.',
    syllables: 'self-de-ter-mi-na-tion',
    phonetic: 'self-dɪˌtɜːmɪˈneɪʃən',
    tier: '3',
    variants: ['national self-determination'],
  },
  {
    term: 'Parliament',
    definition: 'The law-making assembly of elected representatives that debates policies and approves taxes.',
    syllables: 'par-lia-ment',
    phonetic: 'ˈpɑːləmənt',
    tier: '2',
    ks2: true,
    variants: ['parliamentary', 'legislature'],
  },
  {
    term: 'Constitution',
    definition: 'The fundamental written rules setting out how a country is governed and citizens’ rights.',
    syllables: 'con-sti-tu-tion',
    phonetic: 'ˌkɒnstɪˈtjuːʃən',
    tier: '3',
    variants: ['constitutional'],
  },
  {
    term: 'Republic',
    definition: 'A country without a king or queen, led instead by an elected president or assembly.',
    syllables: 're-pub-lic',
    phonetic: 'rɪˈpʌblɪk',
    tier: '2',
    ks2: true,
    variants: ['republics', 'republican'],
  },
  {
    term: 'Statute',
    definition: 'A formal written law officially passed by Parliament or a ruler.',
    syllables: 'stat-ute',
    phonetic: 'ˈstætʃuːt',
    tier: '3',
    variants: ['statutes', 'legislation', 'ordinance'],
  },
  {
    term: 'Decree',
    definition: 'An official order issued directly by a ruler or dictator that immediately carries the force of law.',
    syllables: 'de-cree',
    phonetic: 'dɪˈkriː',
    tier: '3',
    variants: ['decrees', 'decreed', 'edict'],
  },
  {
    term: 'Jurisdiction',
    definition: 'The official legal power of a court or ruler to make decisions over a specific area or group.',
    syllables: 'ju-ris-dic-tion',
    phonetic: 'ˌdʒʊərɪsˈdɪkʃən',
    tier: '3',
    variants: ['judiciary'],
  },
  {
    term: 'Veto',
    definition: 'The constitutional power to block or reject an official decision or new law.',
    syllables: 've-to',
    phonetic: 'ˈviːtəʊ',
    tier: '3',
    variants: ['vetoed'],
  },
  {
    term: 'Ratify',
    definition: 'To formally sign and approve a treaty or agreement so it becomes legally binding.',
    syllables: 'rat-i-fy',
    phonetic: 'ˈrætɪfaɪ',
    tier: '3',
    variants: ['ratified', 'ratification'],
  },
  {
    term: 'Petition',
    definition: 'A formal written request signed by many people asking a ruler or Parliament for change.',
    syllables: 'pe-ti-tion',
    phonetic: 'pəˈtɪʃən',
    tier: '2',
    variants: ['petitions', 'petitioned'],
  },
  {
    term: 'Suffrage',
    definition: 'The legal right to vote in public political elections.',
    syllables: 'suf-frage',
    phonetic: 'ˈsʌfrɪdʒ',
    tier: '2',
    variants: ['suffragettes', 'suffragists', 'universal suffrage', 'franchise', 'enfranchisement'],
  },
  {
    term: 'Representation',
    definition: 'Having elected spokespeople in Parliament to voice your interests and vote on taxes.',
    syllables: 'rep-re-sen-ta-tion',
    phonetic: 'ˌreprɪzenˈteɪʃən',
    tier: '2',
    variants: ['representative', 'representatives'],
  },
  {
    term: 'Conservative',
    definition: 'Favouring traditional institutions, social order, and slow, cautious political change.',
    syllables: 'con-ser-va-tive',
    phonetic: 'kənˈsɜːvətɪv',
    tier: '2',
    variants: ['conservatives', 'conservatism'],
  },
  {
    term: 'Liberal',
    definition: 'Supporting individual freedom, free markets, tolerance, and constitutional reform.',
    syllables: 'lib-er-al',
    phonetic: 'ˈlɪbərəl',
    tier: '2',
    variants: ['liberals', 'liberalism'],
  },
  {
    term: 'Moderate',
    definition: 'Holding middle-ground political views and avoiding violent or extreme solutions.',
    syllables: 'mod-er-ate',
    phonetic: 'ˈmɒdərət',
    tier: '2',
    variants: ['moderates'],
  },
  {
    term: 'Taxation',
    definition: 'Money legally collected from citizens by a ruler or government to pay for armies and services.',
    syllables: 'tax-a-tion',
    phonetic: 'tækˈseɪʃən',
    tier: '2',
    ks2: true,
    variants: ['tariff', 'tariffs', 'subsidy', 'subsidies'],
  },
  {
    term: 'Inflation',
    definition: 'A rapid rise in prices that reduces how much everyday money can buy.',
    syllables: 'in-fla-tion',
    phonetic: 'ɪnˈfleɪʃən',
    tier: '3',
    variants: ['hyperinflation'],
  },
  {
    term: 'Economic Depression',
    definition: 'A long, severe economic crash causing mass unemployment, bank failures, and widespread poverty.',
    syllables: 'e-co-nom-ic de-pres-sion',
    phonetic: 'ˌekəˈnɒmɪk dɪˈpreʃən',
    tier: '3',
    variants: ['Great Depression', 'recession', 'bankruptcy'],
  },
  {
    term: 'Welfare',
    definition: 'Government support—such as healthcare, pensions, and benefits—to protect citizens from poverty.',
    syllables: 'wel-fare',
    phonetic: 'ˈwelfeə',
    tier: '2',
    variants: ['welfare state'],
  },
  {
    term: 'Nationalisation',
    definition: 'When a government takes private industries—like coal or railways—into public state ownership.',
    syllables: 'na-tion-al-i-sa-tion',
    phonetic: 'ˌnæʃnəlaɪˈzeɪʃən',
    tier: '3',
    variants: ['nationalised', 'nationalization'],
  },
  {
    term: 'Collectivisation',
    definition: 'Stalin’s policy forcing peasant farms to merge into large state-controlled collective farms.',
    syllables: 'col-lec-tiv-i-sa-tion',
    phonetic: 'kəˌlektɪvaɪˈzeɪʃən',
    tier: '3',
    variants: ['collectivised', 'collectivization'],
  },

  // =========================================================================
  // 4. COLD WAR, IDEOLOGY, WARFARE & MODERN SOCIETY TIER-3 CONCEPTS
  // =========================================================================
  {
    term: 'Capitalism',
    definition: 'An economic system based on private businesses, free markets, and making profit.',
    syllables: 'cap-i-tal-ism',
    phonetic: 'ˈkæpɪtəlɪzəm',
    tier: '3',
    variants: ['capitalist', 'capitalists', 'free-market capitalism', 'free market capitalism', 'free-market'],
  },
  {
    term: 'Socialism',
    definition: 'A political system where key industries and wealth are owned collectively or by the state.',
    syllables: 'so-cial-ism',
    phonetic: 'ˈsəʊʃəlɪzəm',
    tier: '3',
    variants: ['socialist', 'socialists', 'state socialism'],
  },
  {
    term: 'Communism',
    definition: 'A system inspired by Karl Marx aiming for a classless society with no private property.',
    syllables: 'com-mu-nism',
    phonetic: 'ˈkɒmjʊnɪzəm',
    tier: '3',
    variants: ['communist', 'communists', 'Marxist-Leninist', 'Marxist', 'Leninist', 'Bolshevik', 'Bolshevism'],
  },
  {
    term: 'Ideology',
    definition: 'A connected set of political beliefs and values that shapes how a government runs.',
    syllables: 'i-de-ol-o-gy',
    phonetic: 'ˌaɪdiˈɒlədʒi',
    tier: '2',
    variants: ['ideologies', 'ideological', 'ideologically'],
  },
  {
    term: 'Superpower',
    definition: 'A hugely dominant nation with global military, economic, and nuclear reach, like the USA or USSR.',
    syllables: 'su-per-pow-er',
    phonetic: 'ˈsuːpəpaʊə',
    tier: '2',
    variants: ['superpowers'],
  },
  {
    term: 'Containment',
    definition: 'The US Cold War policy of stopping Soviet communism from spreading into new countries.',
    syllables: 'con-tain-ment',
    phonetic: 'kənˈteɪnmənt',
    tier: '3',
    variants: ['contain', 'containment policy'],
  },
  {
    term: 'Coexistence',
    definition: 'Rival superpowers agreeing to live alongside each other peacefully without open war.',
    syllables: 'co-ex-ist-ence',
    phonetic: 'ˌkəʊɪɡˈzɪstəns',
    tier: '2',
    variants: ['peaceful coexistence'],
  },
  {
    term: 'Détente',
    definition: 'A period of relaxed tensions and improved diplomacy between the USA and USSR in the 1970s.',
    syllables: 'dé-tente',
    phonetic: 'deɪˈtɑːnt',
    tier: '3',
    variants: ['detente'],
  },
  {
    term: 'Brinkmanship',
    definition: 'Pushing a crisis right to the edge of war to force an opponent to back down.',
    syllables: 'brink-man-ship',
    phonetic: 'ˈbrɪŋkmənʃɪp',
    tier: '3',
    variants: ['brink of war'],
  },
  {
    term: 'Deterrence',
    definition: 'Keeping devastating weapons so an enemy fears instant retaliation and never attacks first.',
    syllables: 'de-ter-rence',
    phonetic: 'dɪˈterəns',
    tier: '3',
    variants: ['nuclear deterrence', 'deterrent'],
  },
  {
    term: 'Proxy War',
    definition: 'A war where superpowers arm and fund rival local sides instead of fighting each other directly.',
    syllables: 'prox-y war',
    phonetic: 'ˈprɒksi wɔː',
    tier: '3',
    variants: ['proxy wars', 'proxy conflict'],
  },
  {
    term: 'Domino Theory',
    definition: 'The US belief that if one country fell to communism, its neighbours would fall next.',
    syllables: 'dom-i-no the-o-ry',
    phonetic: 'ˈdɒmɪnəʊ ˈθɪəri',
    tier: '3',
    variants: ['domino effect'],
  },
  {
    term: 'Iron Curtain',
    definition: 'Churchill’s phrase for the political and military barrier dividing Soviet Eastern Europe from the West.',
    syllables: 'i-ron cur-tain',
    phonetic: 'ˈaɪən ˈkɜːtn',
    tier: '3',
    variants: ['iron curtain border'],
  },
  {
    term: 'Marshall Plan',
    definition: 'The $13 billion US aid programme (1948) to rebuild Western Europe and resist communism.',
    syllables: 'Mar-shall Plan',
    phonetic: 'ˈmɑːʃəl plæn',
    tier: '3',
    variants: ['European Recovery Program'],
  },
  {
    term: 'Truman Doctrine',
    definition: 'President Truman’s 1947 pledge to give US aid to countries resisting communist takeovers.',
    syllables: 'Tru-man Doc-trine',
    phonetic: 'ˈtruːmən ˈdɒktrɪn',
    tier: '3',
    variants: ['Truman doctrine speech'],
  },
  {
    term: 'NATO',
    definition: 'The North Atlantic Treaty Organisation (1949), a Western military alliance defending against Soviet attack.',
    syllables: 'NA-TO',
    phonetic: 'ˈneɪtəʊ',
    tier: '3',
    variants: ['North Atlantic Treaty', 'North Atlantic Treaty Organisation'],
  },
  {
    term: 'Warsaw Pact',
    definition: 'The 1955 Soviet-led military alliance of Eastern European communist states formed to rival NATO.',
    syllables: 'War-saw Pact',
    phonetic: 'ˈwɔːsɔː pækt',
    tier: '3',
    variants: ['Warsaw Treaty'],
  },
  {
    term: 'Glasnost',
    definition: 'Gorbachev’s 1985 policy of political openness, easing Soviet censorship and allowing public debate.',
    syllables: 'glas-nost',
    phonetic: 'ˈɡlæznɒst',
    tier: '3',
    variants: ['openness'],
  },
  {
    term: 'Perestroika',
    definition: 'Gorbachev’s late-1980s reform campaign to restructure the struggling Soviet economy.',
    syllables: 'per-e-stroi-ka',
    phonetic: 'ˌperəˈstrɔɪkə',
    tier: '3',
    variants: ['economic restructuring'],
  },
  {
    term: 'Satellite State',
    definition: 'A formally independent country heavily controlled by a neighbouring superpower like the USSR.',
    syllables: 'sat-el-lite state',
    phonetic: 'ˈsætəlaɪt steɪt',
    tier: '3',
    variants: ['satellite states', 'Soviet satellite'],
  },
  {
    term: 'Buffer Zone',
    definition: 'A strip of friendly or neutral countries kept between rival powers to protect against invasion.',
    syllables: 'buf-fer zone',
    phonetic: 'ˈbʌfə zəʊn',
    tier: '3',
    variants: ['buffer zones', 'buffer territory'],
  },
  {
    term: 'Spheres of Influence',
    definition: 'Regions where a dominant great power claims chief political and economic control.',
    syllables: 'spheres of in-flu-ence',
    phonetic: 'sfɪəz ɒv ˈɪnflʊəns',
    tier: '3',
    variants: ['sphere of influence'],
  },
  {
    term: 'Grand Alliance',
    definition: 'The Second World War partnership of Britain, the USA, and the USSR against Nazi Germany.',
    syllables: 'Grand Al-li-ance',
    phonetic: 'ɡrænd əˈlaɪəns',
    tier: '3',
    variants: ['Big Three alliance'],
  },
  {
    term: 'Mutually Assured Destruction',
    definition: 'The reality that a nuclear strike by either superpower would destroy both sides completely.',
    syllables: 'Mu-tu-al-ly As-sured De-struc-tion',
    phonetic: 'ˈmjuːtʃuəli əˈʃʊəd dɪˈstrʌkʃən',
    tier: '3',
    variants: ['MAD doctrine'],
  },
  {
    term: 'Imperialism',
    definition: 'Building an empire by conquering, ruling, or economically dominating foreign lands.',
    syllables: 'im-pe-ri-al-ism',
    phonetic: 'ɪmˈpɪəriəlɪzəm',
    tier: '3',
    variants: ['imperialist', 'imperialists', 'imperial'],
  },
  {
    term: 'Empire',
    definition: 'A large group of countries or territories ruled over by one powerful ruler or nation.',
    syllables: 'em-pire',
    phonetic: 'ˈempaɪə',
    tier: '2',
    ks2: true,
    variants: ['empires', 'emperor', 'emperors'],
  },
  {
    term: 'Colonialism',
    definition: 'Taking control of foreign territory, settling it, and using its people and resources for profit.',
    syllables: 'co-lo-ni-al-ism',
    phonetic: 'kəˈləʊniəlɪzəm',
    tier: '3',
    ks2: true,
    variants: ['colonial', 'colonies', 'colony', 'colonists', 'colonisation', 'colonization'],
  },
  {
    term: 'Allies',
    definition: 'Countries that sign an agreement to support and fight alongside each other in war.',
    syllables: 'al-lies',
    phonetic: 'ˈælaɪz',
    tier: '2',
    ks2: true,
    variants: ['alliance', 'alliances', 'allied'],
  },
  {
    term: 'Treaty',
    definition: 'A formal, legally binding written peace or trade agreement signed by countries.',
    syllables: 'trea-ty',
    phonetic: 'ˈtriːti',
    tier: '2',
    ks2: true,
    variants: ['treaties'],
  },
  {
    term: 'Armistice',
    definition: 'An official agreement between warring armies to stop fighting so peace talks can begin.',
    syllables: 'ar-mi-stice',
    phonetic: 'ˈɑːmɪstɪs',
    tier: '2',
    variants: ['armistices', 'ceasefire'],
  },
  {
    term: 'Reparations',
    definition: 'Compensation money or goods a defeated country is forced to pay victors for war damage.',
    syllables: 'rep-a-ra-tions',
    phonetic: 'ˌrepəˈreɪʃənz',
    tier: '3',
    variants: ['reparation', 'war reparations'],
  },
  {
    term: 'Annexation',
    definition: 'Forcibly taking over a foreign territory and making it part of your own country.',
    syllables: 'an-nex-a-tion',
    phonetic: 'ˌænekˈseɪʃən',
    tier: '3',
    variants: ['annex', 'annexed', 'annexing'],
  },
  {
    term: 'Appeasement',
    definition: 'Giving in to an aggressive leader’s demands in the hope of avoiding a wider war.',
    syllables: 'ap-pease-ment',
    phonetic: 'əˈpiːzmənt',
    tier: '3',
    variants: ['appease', 'appeased'],
  },
  {
    term: 'Militarism',
    definition: 'Glamourising the armed forces and building huge armies as the main way to solve disputes.',
    syllables: 'mil-i-ta-rism',
    phonetic: 'ˈmɪlɪtərɪzəm',
    tier: '3',
    variants: ['militaristic'],
  },
  {
    term: 'Nationalism',
    definition: 'Intense pride in your nation and the belief it should rule itself independently.',
    syllables: 'na-tion-al-ism',
    phonetic: 'ˈnæʃnəlɪzəm',
    tier: '2',
    variants: ['nationalist', 'nationalists'],
  },
  {
    term: 'Propaganda',
    definition: 'Biased posters, speeches, or news spread by leaders to shape what the public believes.',
    syllables: 'prop-a-gan-da',
    phonetic: 'ˌprɒpəˈɡændə',
    tier: '2',
    ks2: true,
    variants: ['propagandist', 'state propaganda'],
  },
  {
    term: 'Censorship',
    definition: 'Officially banning, cutting, or controlling books, newspapers, and broadcasts.',
    syllables: 'cen-sor-ship',
    phonetic: 'ˈsensəʃɪp',
    tier: '2',
    variants: ['censored', 'press censorship'],
  },
  {
    term: 'Conscription',
    definition: 'Forcing eligible citizens by law to join the armed forces during a war.',
    syllables: 'con-scrip-tion',
    phonetic: 'kənˈskrɪpʃən',
    tier: '3',
    variants: ['conscripted', 'military draft'],
  },
  {
    term: 'Coup d’État',
    definition: 'The sudden, illegal overthrow of a government by the army or a rival political group.',
    syllables: 'coup d’é-tat',
    phonetic: 'ˌkuː deɪˈtɑː',
    tier: '3',
    variants: ['coup', 'military coup'],
  },
  {
    term: 'Blockade',
    definition: 'Using warships or troops to seal off a country so food and supplies cannot get in.',
    syllables: 'block-ade',
    phonetic: 'blɒˈkeɪd',
    tier: '2',
    variants: ['blockades', 'blockaded'],
  },
  {
    term: 'Embargo',
    definition: 'An official government ban stopping trade with a specific country as political pressure.',
    syllables: 'em-bar-go',
    phonetic: 'ɪmˈbɑːɡəʊ',
    tier: '3',
    variants: ['embargoes', 'sanction', 'sanctions'],
  },
  {
    term: 'Mobilisation',
    definition: 'Calling up soldiers and preparing armies, weapons, and transport for immediate war.',
    syllables: 'mo-bi-li-sa-tion',
    phonetic: 'ˌməʊbəlaɪˈzeɪʃən',
    tier: '3',
    variants: ['mobilization', 'mobilise', 'mobilised'],
  },
  {
    term: 'Stalemate',
    definition: 'A deadlock in war where neither side can advance or win a clear victory.',
    syllables: 'stale-mate',
    phonetic: 'ˈsteɪlmeɪt',
    tier: '2',
    variants: [],
  },
  {
    term: 'Attrition',
    definition: 'Wearing an enemy down slowly through constant attacks until they run out of soldiers or supplies.',
    syllables: 'at-tri-tion',
    phonetic: 'əˈtrɪʃən',
    tier: '3',
    variants: ['war of attrition'],
  },
  {
    term: 'Guerrilla',
    definition: 'Small bands of irregular fighters using surprise ambushes and hit-and-run tactics.',
    syllables: 'guer-ril-la',
    phonetic: 'ɡəˈrɪlə',
    tier: '3',
    variants: ['guerrillas', 'guerrilla warfare'],
  },
  {
    term: 'Neutrality',
    definition: 'Refusing to take sides or join the fighting in a war between other countries.',
    syllables: 'neu-tral-i-ty',
    phonetic: 'njuːˈtræləti',
    tier: '2',
    variants: ['neutral', 'isolationism'],
  },
  {
    term: 'Genocide',
    definition: 'The deliberate, planned attempt to wipe out an entire ethnic, racial, or religious people.',
    syllables: 'gen-o-cide',
    phonetic: 'ˈdʒenəsaɪd',
    tier: '3',
    variants: ['genocidal'],
  },
  {
    term: 'Pogrom',
    definition: 'An organised violent mob attack targeting Jewish communities, homes, and shops.',
    syllables: 'po-grom',
    phonetic: 'ˈpɒɡrəm',
    tier: '3',
    variants: ['pogroms'],
  },
  {
    term: 'Ghetto',
    definition: 'A restricted, overcrowded city district where minority groups—especially Jews—were forced to live.',
    syllables: 'ghet-to',
    phonetic: 'ˈɡetəʊ',
    tier: '3',
    variants: ['ghettos'],
  },
  {
    term: 'Atrocity',
    definition: 'An extremely cruel, shocking act of violence, especially against civilians or prisoners.',
    syllables: 'a-troc-i-ty',
    phonetic: 'əˈtrɒsəti',
    tier: '2',
    variants: ['atrocities', 'massacre', 'massacres'],
  },
  {
    term: 'Refugee',
    definition: 'Someone forced to flee their home country to escape war, violence, or persecution.',
    syllables: 'ref-u-gee',
    phonetic: 'ˌrefjʊˈdʒiː',
    tier: '2',
    ks2: true,
    variants: ['refugees'],
  },
  {
    term: 'Internment',
    definition: 'Holding people prisoner without a trial, usually during wartime or political unrest.',
    syllables: 'in-tern-ment',
    phonetic: 'ɪnˈtɜːnmənt',
    tier: '3',
    variants: ['interned'],
  },
  {
    term: 'Rationing',
    definition: 'Limiting each person to a fixed weekly share of food or fuel during wartime shortages.',
    syllables: 'ra-tion-ing',
    phonetic: 'ˈræʃənɪŋ',
    tier: '2',
    ks2: true,
    variants: ['ration', 'rations', 'rationed'],
  },
  {
    term: 'Evacuation',
    definition: 'Moving children and civilians away from dangerous cities to safer countryside areas.',
    syllables: 'e-vac-u-a-tion',
    phonetic: 'ɪˌvækjuˈeɪʃən',
    tier: '2',
    ks2: true,
    variants: ['evacuee', 'evacuees', 'evacuated'],
  },
  {
    term: 'The Blitz',
    definition: 'Nazi Germany’s sustained night-time bombing campaign against British cities in 1940–41.',
    syllables: 'the blitz',
    phonetic: 'ðə blɪts',
    tier: '3',
    ks2: true,
    variants: ['air raid', 'air raids'],
  },
  {
    term: 'Proletariat',
    definition: 'Industrial wage-earning factory workers who do not own the businesses they work in.',
    syllables: 'pro-le-tar-i-at',
    phonetic: 'ˌprəʊlɪˈteəriət',
    tier: '3',
    variants: ['proletarian'],
  },
  {
    term: 'Bourgeoisie',
    definition: 'The wealthy middle class who own factories, banks, and major businesses.',
    syllables: 'bour-geoi-sie',
    phonetic: 'ˌbʊəʒwɑːˈziː',
    tier: '3',
    variants: ['bourgeois'],
  },
  {
    term: 'Industrialisation',
    definition: 'The shift from farming and handcrafts to steam power, factories, and mass manufacturing.',
    syllables: 'in-dus-tri-al-i-sa-tion',
    phonetic: 'ɪnˌdʌstriəlaɪˈzeɪʃən',
    tier: '3',
    variants: ['industrialise', 'industrialised', 'industrialization', 'industrial revolution'],
  },
  {
    term: 'Urbanisation',
    definition: 'The rapid growth of cities as huge numbers of people move from the countryside for factory work.',
    syllables: 'ur-ban-i-sa-tion',
    phonetic: 'ˌɜːbənaɪˈzeɪʃən',
    tier: '3',
    variants: ['urbanise', 'urbanised', 'urbanization'],
  },
  {
    term: 'Trade Union',
    definition: 'An organisation of workers who unite to negotiate better pay, hours, and safety.',
    syllables: 'trade un-ion',
    phonetic: 'treɪd ˈjuːnjən',
    tier: '2',
    variants: ['trade unions', 'labour union'],
  },
  {
    term: 'Segregation',
    definition: 'Enforced legal separation of racial groups in schools, buses, housing, and public spaces.',
    syllables: 'seg-re-ga-tion',
    phonetic: 'ˌseɡrɪˈɡeɪʃən',
    tier: '3',
    variants: ['segregated', 'racial segregation'],
  },
  {
    term: 'Civil Rights',
    definition: 'Basic legal rights guaranteeing equal treatment, voting access, and freedom from discrimination.',
    syllables: 'civ-il rights',
    phonetic: 'ˈsɪvəl raɪts',
    tier: '2',
    variants: ['civil liberties'],
  },

  // =========================================================================
  // 5. HISTORY OF MEDICINE & PUBLIC HEALTH TIER-3 CONCEPTS
  // =========================================================================
  {
    term: 'Anatomy',
    definition: 'The scientific study of the inside structure of the human body, learned through dissection.',
    syllables: 'a-nat-o-my',
    phonetic: 'əˈnætəmi',
    tier: '3',
    variants: ['anatomical', 'anatomist', 'dissection', 'dissect', 'dissecting'],
  },
  {
    term: 'Physiology',
    definition: 'The study of how organs and systems—like blood circulation—actually work inside the body.',
    syllables: 'phys-i-ol-o-gy',
    phonetic: 'ˌfɪziˈɒlədʒi',
    tier: '3',
    variants: ['physiological'],
  },
  {
    term: 'Miasma',
    definition: 'The old false belief that bad smells and rotting air directly caused infectious diseases.',
    syllables: 'mi-as-ma',
    phonetic: 'maɪˈæzmə',
    tier: '3',
    variants: ['miasmas'],
  },
  {
    term: 'Sanitation',
    definition: 'Clean water supplies, sewers, and waste disposal that keep towns healthy and stop disease.',
    syllables: 'san-i-ta-tion',
    phonetic: 'ˌsænɪˈteɪʃən',
    tier: '2',
    variants: ['sewage', 'public health'],
  },
  {
    term: 'Quarantine',
    definition: 'Keeping infected people or ships strictly separated from others to stop disease spreading.',
    syllables: 'quar-an-tine',
    phonetic: 'ˈkwɒrəntiːn',
    tier: '2',
    variants: ['quarantined'],
  },
  {
    term: 'Antiseptic',
    definition: 'A germ-killing chemical (like carbolic acid) used on wounds and tools to prevent infection.',
    syllables: 'an-ti-sep-tic',
    phonetic: 'ˌæntiˈseptɪk',
    tier: '3',
    variants: ['antiseptics', 'antiseptic surgery', 'aseptic', 'aseptic surgery'],
  },
  {
    term: 'Anaesthetic',
    definition: 'A drug (like ether or chloroform) that puts patients to sleep so surgery is painless.',
    syllables: 'an-aes-thet-ic',
    phonetic: 'ˌænəsˈθetɪk',
    tier: '3',
    variants: ['anaesthetics', 'anesthetic', 'anesthetics', 'anesthesia'],
  },
  {
    term: 'Pathogen',
    definition: 'A microscopic germ—such as a bacterium or virus—that causes infectious disease.',
    syllables: 'path-o-gen',
    phonetic: 'ˈpæθədʒən',
    tier: '3',
    variants: ['pathogens', 'microbe', 'microbes', 'germ theory'],
  },
  {
    term: 'Epidemic',
    definition: 'A sudden, rapid outbreak of an infectious disease affecting many people across a region.',
    syllables: 'ep-i-dem-ic',
    phonetic: 'ˌepɪˈdemɪk',
    tier: '2',
    variants: ['epidemics', 'pandemic'],
  },
  {
    term: 'Vaccination',
    definition: 'Giving a safe dose of a weakened germ to train the immune system to fight a disease.',
    syllables: 'vac-ci-na-tion',
    phonetic: 'ˌvæksɪˈneɪʃən',
    tier: '3',
    variants: ['vaccine', 'vaccines', 'inoculation', 'inoculate'],
  },

  // =========================================================================
  // 6. KS2 CORE HISTORICAL BRIDGE VOCABULARY
  // =========================================================================
  {
    term: 'Archaeology',
    definition: 'Learning about past peoples by digging up and studying ancient buildings and objects.',
    syllables: 'ar-chae-ol-o-gy',
    phonetic: 'ˌɑːkiˈɒlədʒi',
    tier: '3',
    ks2: true,
    variants: ['archaeologist', 'archaeologists', 'archaeological'],
  },
  {
    term: 'Artefact',
    definition: 'An object made or used by humans in the past—such as a pot, coin, or weapon.',
    syllables: 'ar-te-fact',
    phonetic: 'ˈɑːtɪfækt',
    tier: '3',
    ks2: true,
    variants: ['artefacts', 'artifact', 'artifacts'],
  },
  {
    term: 'Civilisation',
    definition: 'An advanced ancient society with cities, laws, farming, writing, and shared culture.',
    syllables: 'civ-i-li-sa-tion',
    phonetic: 'ˌsɪvəlaɪˈzeɪʃən',
    tier: '2',
    ks2: true,
    variants: ['civilisations', 'civilization', 'civilizations'],
  },
  {
    term: 'Invasion',
    definition: 'When an army crosses into another country by force to conquer or control it.',
    syllables: 'in-va-sion',
    phonetic: 'ɪnˈveɪʒən',
    tier: '2',
    ks2: true,
    variants: ['invasions', 'conquest'],
  },
  {
    term: 'Surrender',
    definition: 'Admitting defeat and agreeing to stop fighting.',
    syllables: 'sur-ren-der',
    phonetic: 'səˈrendə',
    tier: '2',
    ks2: true,
    variants: ['surrendered'],
  },
  {
    term: 'Citizen',
    definition: 'A legally recognised member of a city-state or country who holds rights and duties.',
    syllables: 'cit-i-zen',
    phonetic: 'ˈsɪtɪzən',
    tier: '2',
    ks2: true,
    variants: ['citizens', 'citizenship'],
  },
  {
    term: 'Senate',
    definition: 'The powerful council of wealthy Roman leaders who advised rulers and debated laws.',
    syllables: 'sen-ate',
    phonetic: 'ˈsenət',
    tier: '3',
    ks2: true,
    variants: ['senator', 'senators'],
  },
  {
    term: 'Legion',
    definition: 'A large, disciplined Roman army division of around 5,000 professional soldiers.',
    syllables: 'le-gion',
    phonetic: 'ˈliːdʒən',
    tier: '3',
    ks2: true,
    variants: ['legions', 'legionary', 'legionaries'],
  },
  {
    term: 'Pharaoh',
    definition: 'The supreme king or queen of Ancient Egypt, worshipped as a living god on Earth.',
    syllables: 'pha-raoh',
    phonetic: 'ˈfeərəʊ',
    tier: '3',
    ks2: true,
    variants: ['pharaohs'],
  },
  {
    term: 'Gladiator',
    definition: 'A trained Ancient Roman fighter—often enslaved—who fought in public arenas for crowds.',
    syllables: 'glad-i-a-tor',
    phonetic: 'ˈɡlædieɪtə',
    tier: '3',
    ks2: true,
    variants: ['gladiators'],
  },
  {
    term: 'Longship',
    definition: 'A fast, narrow Viking wooden ship with oars and a sail built for ocean and river raids.',
    syllables: 'long-ship',
    phonetic: 'ˈlɒŋʃɪp',
    tier: '3',
    ks2: true,
    variants: ['longships'],
  },
];

/**
 * Builds a comprehensive, unified vocabulary dictionary for a given lesson
 * by merging:
 * 1. The Master Disciplinary Glossary (full secondary set, or KS2-friendly subset for KS2 units)
 * 2. The unit-wide vocabulary pool (all terms across all lessons in the unit)
 * 3. The current lesson's specific vocabulary (highest priority)
 * 4. Automatic plural, stem, and morphological derivatives
 */
function normalizeGlossaryKey(str) {
  return String(str || '')
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function stripParentheticalSuffix(str) {
  return String(str || '')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildComprehensiveVocabDict(lesson, unitData) {
  const vocabDict = {};

  const setKey = (rawKey, meta) => {
    const k = normalizeGlossaryKey(rawKey);
    if (!k || k.length < 2) return;
    const existing = vocabDict[k];
    if (!existing || meta.priority >= existing.priority) {
      vocabDict[k] = meta;
    }
  };

  const registerItem = (
    term,
    def,
    syllables = '',
    phonetic = '',
    tier = '2',
    variants = [],
    priority = 1,
  ) => {
    if (!term || !def) return;
    const baseTerm = String(term).trim();
    const cleanRoot =
      normalizeGlossaryKey(stripParentheticalSuffix(baseTerm)) || normalizeGlossaryKey(baseTerm);
    const meta = {
      term: baseTerm,
      rootKey: cleanRoot,
      definition: def,
      syllables: syllables || '',
      phonetic: phonetic || '',
      tier: String(tier || '2'),
      priority,
    };

    const candidateKeys = new Set([normalizeGlossaryKey(baseTerm)]);
    const stripped = stripParentheticalSuffix(baseTerm);
    if (stripped && stripped.length >= 3) {
      candidateKeys.add(normalizeGlossaryKey(stripped));
    }

    // Extract clean uppercase acronym inside parentheses e.g. "Palestine Liberation Organisation (PLO)" -> "plo"
    const parenMatches = baseTerm.match(/\(([A-Z]{2,7})\)/g);
    if (parenMatches) {
      parenMatches.forEach((pm) => {
        const inner = pm.slice(1, -1).trim();
        if (/^[A-Z]{2,7}$/.test(inner)) {
          candidateKeys.add(inner.toLowerCase());
        }
      });
    }

    if (Array.isArray(variants)) {
      variants.forEach((v) => {
        const vNorm = normalizeGlossaryKey(v);
        if (vNorm) candidateKeys.add(vNorm);
        const vStripped = normalizeGlossaryKey(stripParentheticalSuffix(v));
        if (vStripped && vStripped.length >= 3) candidateKeys.add(vStripped);
      });
    }

    candidateKeys.forEach((termKey) => {
      setKey(termKey, meta);

      // Auto-register regular plurals for single words
      if (!termKey.endsWith('s') && !termKey.includes(' ') && termKey.length >= 4) {
        setKey(termKey + 's', meta);
      }

      // Auto-register common historical adjective/stem derivatives
      if (termKey.endsWith('ism') && termKey.length >= 6) {
        const stem = termKey.slice(0, -3);
        setKey(stem + 'ist', meta);
        setKey(stem + 'ists', meta);
      }
      if (termKey.endsWith('y') && !termKey.includes(' ') && termKey.length >= 5) {
        const stem = termKey.slice(0, -1);
        setKey(stem + 'ies', meta);
        setKey(stem + 'ic', meta);
        setKey(stem + 'ical', meta);
      }
      if (termKey.endsWith('tion') && termKey.length >= 7) {
        const stem = termKey.slice(0, -4);
        setKey(stem + 'tive', meta);
      }
    });
  };

  const unitIdStr = String((unitData && unitData.id) || '').toLowerCase();
  const isKs2Unit = Boolean(
    unitIdStr.startsWith('ks2_') ||
      (unitData &&
        (unitData.is_ks2 || unitData.keyStage === 'KS2' || unitData.keyStage === 'Key Stage 2')) ||
      (lesson && lesson.is_ks2),
  );

  // 1. Master Disciplinary Glossary (priority 1 — KS2 gets curated ks2-friendly bridge terms; KS3/GCSE gets full set)
  MASTER_DISCIPLINARY_GLOSSARY.forEach((item) => {
    if (isKs2Unit && !item.ks2) return;
    registerItem(
      item.term,
      item.definition,
      item.syllables,
      item.phonetic,
      item.tier,
      item.variants,
      1,
    );
  });

  // 2. Unit-wide vocabulary pool from all lessons in the active unit (priority 2)
  if (unitData && Array.isArray(unitData.lessons)) {
    unitData.lessons.forEach((l) => {
      const vArr = (l.vocab || l.vocabulary || []).concat(
        !l.vocab && !l.vocabulary && l.flashcards ? l.flashcards : [],
      );
      vArr.forEach((v) => {
        if (!v) return;
        registerItem(
          v.term,
          v.definition || v.def || v.desc,
          v.syllables,
          v.phonetic,
          v.tier,
          v.variants,
          2,
        );
      });
    });
  }

  // 3. Current lesson vocabulary (priority 3 — highest priority & overrides)
  const currentVocab = (lesson && (lesson.vocab || lesson.vocabulary || [])) || [];
  currentVocab.forEach((v) => {
    if (!v) return;
    registerItem(
      v.term,
      v.definition || v.def || v.desc,
      v.syllables,
      v.phonetic,
      v.tier,
      v.variants,
      3,
    );
  });

  return vocabDict;
}

/**
 * Annotates historical narrative prose or primary source extracts with ambient vocabulary lens markup.
 * Matches terms against HTML while strictly skipping existing tags, protected tokens, links,
 * and (for baseline Tier-2/3 terms) bold factual anchors so visual channels stay crisp and uncluttered.
 *
 * @param {string} text - Raw narrative or primary-source text
 * @param {Object} vocabDict - Comprehensive vocabulary dictionary
 * @param {number|Object} maxPerBlockOrOptions - Max terms per block, or options { maxPerBlock, seenRoots, excludedTerms, skipInsideBold }
 * @returns {string} HTML with embedded .vocab-lens-term spans
 */
export function highlightGlossaryInProse(text, vocabDict, maxPerBlockOrOptions = 4) {
  if (!text || typeof text !== 'string') return text || '';
  if (!vocabDict || Object.keys(vocabDict).length === 0) return text;

  const opts =
    typeof maxPerBlockOrOptions === 'object' && maxPerBlockOrOptions !== null
      ? maxPerBlockOrOptions
      : { maxPerBlock: typeof maxPerBlockOrOptions === 'number' ? maxPerBlockOrOptions : 4 };

  const maxPerBlock = typeof opts.maxPerBlock === 'number' ? opts.maxPerBlock : 4;
  const lessonSeenRoots = opts.seenRoots instanceof Set ? opts.seenRoots : null;
  const excludedTerms = opts.excludedTerms instanceof Set ? opts.excludedTerms : null;
  const skipInsideBoldForBaseline = opts.skipInsideBold !== false;

  let processedText = text;
  let blockCount = 0;

  // Sort by pedagogical priority FIRST (Current Lesson > Unit > Master Glossary), then phrase length
  const sortedTerms = Object.keys(vocabDict).sort((a, b) => {
    const prioDiff = (vocabDict[b]?.priority || 1) - (vocabDict[a]?.priority || 1);
    if (prioDiff !== 0) return prioDiff;
    return b.length - a.length;
  });

  const matchedRootsInBlock = new Set();

  for (const term of sortedTerms) {
    if (blockCount >= maxPerBlock) break;
    const vocabItem = vocabDict[term];
    if (!vocabItem || !vocabItem.definition) continue;

    const normTerm = normalizeGlossaryKey(term);
    const rootKey = vocabItem.rootKey || normalizeGlossaryKey(vocabItem.term);

    if (matchedRootsInBlock.has(rootKey)) continue;
    if (lessonSeenRoots && lessonSeenRoots.has(rootKey)) continue;
    if (excludedTerms && (excludedTerms.has(normTerm) || excludedTerms.has(rootKey))) {
      continue;
    }

    // Escape regex special chars, then allow straight or curly apostrophes interchangeably
    const escapedTerm = term
      .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      .replace(/['’]/g, "['’]");

    // Short uppercase acronyms (2–4 chars like PLO, UN, NHS) match case-sensitively so e.g. 'un' never matches
    const isShortAcronym = term.length <= 4 && vocabItem.term.toUpperCase() === vocabItem.term;
    const flags = isShortAcronym ? 'g' : 'gi';
    const wordPattern = isShortAcronym ? escapedTerm.toUpperCase() : escapedTerm;

    // For baseline priority-1 master terms, avoid stacking dotted underlines inside <strong> or **bold** anchors
    const protectBold = skipInsideBoldForBaseline && (vocabItem.priority || 1) === 1;
    const regex = protectBold
      ? new RegExp(
          `(@@[A-Z0-9_]+@@)|(<a\\b[^>]*>[\\s\\S]*?<\\/a>)|(<span\\b[^>]*class=["'][^"']*vocab-[^"']*["'][^>]*>[\\s\\S]*?<\\/span>)|(<strong\\b[^>]*>[\\s\\S]*?<\\/strong>|\\*\\*[^*]+\\*\\*)|(<[^>]+>)|\\b(${wordPattern})\\b`,
          flags,
        )
      : new RegExp(
          `(@@[A-Z0-9_]+@@)|(<a\\b[^>]*>[\\s\\S]*?<\\/a>)|(<span\\b[^>]*class=["'][^"']*vocab-[^"']*["'][^>]*>[\\s\\S]*?<\\/span>)|()(<[^>]+>)|\\b(${wordPattern})\\b`,
          flags,
        );

    let didMatch = false;

    processedText = processedText.replace(
      regex,
      (match, protectedToken, anchorTag, existingVocabSpan, boldSpan, htmlTag, word) => {
        if (protectedToken) return protectedToken;
        if (anchorTag) return anchorTag;
        if (existingVocabSpan) return existingVocabSpan;
        if (boldSpan) return boldSpan;
        if (htmlTag) return htmlTag;

        if (word && !didMatch && blockCount < maxPerBlock) {
          didMatch = true;
          blockCount++;
          const safeDef = vocabItem.definition.replace(/"/g, '&quot;');
          const safeSyllables = (vocabItem.syllables || '').replace(/"/g, '&quot;');
          const safePhonetic = (vocabItem.phonetic || '').replace(/"/g, '&quot;');
          const safeTier = vocabItem.tier || '2';
          const safeTerm = vocabItem.term.replace(/"/g, '&quot;');
          return `<span class="vocab-word vocab-lens-term" tabindex="0" role="button" data-term="${safeTerm}" data-definition="${safeDef}" data-syllables="${safeSyllables}" data-phonetic="${safePhonetic}" data-tier="${safeTier}">${word}</span>`;
        }
        return match;
      },
    );

    if (didMatch) {
      matchedRootsInBlock.add(rootKey);
      if (lessonSeenRoots) {
        lessonSeenRoots.add(rootKey);
      }
    }
  }

  return processedText;
}
