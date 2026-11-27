/**
 * History Revision Hub — All-Through Master Substantive Golden Threads (KS2 → KS3 → GCSE)
 *
 * Grounded in Christine Counsell's principles of vertical curriculum coherence and "hinterland" schema building.
 * Tracks 4 overarching substantive & disciplinary Golden Threads across all 30 live courses:
 *   • Key Stage 2 Primary (12 Courses • Ages 7–11)
 *   • Key Stage 3 Secondary (12 Courses • Ages 11–14)
 *   • Key Stage 4 Pearson Edexcel GCSE 9–1 (6 Courses • Ages 14–16)
 */

const MASTER_DISCIPLINARY_STRANDS = [
  {
    id: 'sovereignty_state_power',
    name: 'Power, Democracy & The State',
    icon: 'fa-solid fa-landmark-dome',
    color: '#1e3a8a',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    badge: 'Power & Governance',
    description:
      'Tracing how human societies organise authority—from Egyptian Pharaohs, Athenian direct democracy, Roman Emperors, and Anglo-Saxon burhs to Magna Carta, Parliamentary sovereignty, and modern democratic vs totalitarian states.',
  },
  {
    id: 'trade_technology_empire',
    name: 'Trade, Technology & Empire',
    icon: 'fa-solid fa-compass-drafting',
    color: '#0369a1',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    badge: 'Trade, Tech & Empire',
    description:
      'Following how tools, engineering, and global trade reshape power—from Bronze/Iron smelting, Roman roads, Silk Road Baghdad, and Viking Jorvik to oceanic empires, steam industrialisation, and Cold War technology.',
  },
  {
    id: 'ideology_faith_causation',
    name: 'Belief, Science & Worldviews',
    icon: 'fa-solid fa-scale-balanced',
    color: '#b91c1c',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    badge: 'Belief & Science',
    description:
      'Exploring how Sacred myths, organised religions, scientific breakthroughs, and political ideologies explain the world—from Stonehenge solstices, Egyptian Ma’at, the House of Wisdom, and Maya calendars to the Reformation, Germ Theory, and Cold War ideologies.',
  },
  {
    id: 'resistance_agency_rights',
    name: 'Everyday Life, Agency & Rights',
    icon: 'fa-solid fa-people-group',
    color: '#15803d',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    badge: 'Agency & Rights',
    description:
      'Uncovering lived childhood, women’s agency, resistance, and the struggle for human rights—from Boudicca, Vindolanda families, and Kindertransport rescuers to the Peasants’ Revolt, abolitionism, Holocaust resistance, and US Civil Rights.',
  },
];

const CANONICAL_ALL_THROUGH_UNITS = [
  // Key Stage 2 (12 Courses)
  { unitId: 'ks2_stone_to_iron_age', phase: 'KS2', cohort: 'Lower KS2 (Y3–4)', displayTitle: 'Stone Age to Iron Age Britain (c. 800,000 BC–AD 43)' },
  { unitId: 'ks2_ancient_egypt', phase: 'KS2', cohort: 'Lower KS2 (Y3–4)', displayTitle: 'Ancient Egypt & River Cradles (c. 3100–30 BC)' },
  { unitId: 'ks2_ancient_greece', phase: 'KS2', cohort: 'Lower KS2 (Y3–4)', displayTitle: 'Ancient Greece: City-States & Democracy (c. 800–146 BC)' },
  { unitId: 'ks2_romans', phase: 'KS2', cohort: 'Lower KS2 (Y3–4)', displayTitle: 'The Romans in Britain (55 BC–AD 410)' },
  { unitId: 'ks2_anglo_saxons_vikings', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'Anglo-Saxons & Vikings to 1066 (AD 410–1066)' },
  { unitId: 'ks2_early_islamic_baghdad', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'Early Islamic Baghdad (c. AD 750–1258)' },
  { unitId: 'ks2_local_history_detective', phase: 'KS2', cohort: 'Lower KS2 (Y3–4)', displayTitle: 'History on Our Doorstep: Local Detective Study' },
  { unitId: 'ks2_victorian_britain', phase: 'KS2', cohort: 'Lower KS2 (Y3–4)', displayTitle: 'Victorian Britain (1837–1901)' },
  { unitId: 'ks2_kingdom_of_benin', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'The Kingdom of Benin (c. AD 900–1897)' },
  { unitId: 'ks2_maya_civilisation', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'The Ancient Maya (c. 2000 BC–AD 1500)' },
  { unitId: 'ks2_crime_and_punishment', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'Crime & Punishment Through Time (AD 43–Present)' },
  { unitId: 'ks2_ww2', phase: 'KS2', cohort: 'Upper KS2 (Y5–6)', displayTitle: 'World War II & The Home Front (1933–1945)' },

  // Key Stage 3 (12 Courses)
  { unitId: 'water_and_sanitation', phase: 'KS3', cohort: 'Year 7', displayTitle: 'Water & Sanitation Through Time (1250–Present)' },
  { unitId: 'medieval_england', phase: 'KS3', cohort: 'Year 7', displayTitle: 'Medieval England (1066–1485)' },
  { unitId: 'monarchy_religion_power', phase: 'KS3', cohort: 'Year 8', displayTitle: 'Crown, Church & Parliament (1517–1689)' },
  { unitId: 'first_british_empire', phase: 'KS3', cohort: 'Year 8', displayTitle: 'The First British Empire (1600–1783)' },
  { unitId: 'industrialisation_and_empire', phase: 'KS3', cohort: 'Year 8', displayTitle: 'Industrialisation, Empire & Power (1750–1900)' },
  { unitId: 'second_british_empire', phase: 'KS3', cohort: 'Year 8', displayTitle: 'The Second British Empire (1783–1914)' },
  { unitId: 'australia', phase: 'KS3', cohort: 'Year 8', displayTitle: 'Invasion & Survival in Australia (1770–1901)' },
  { unitId: 'great_war', phase: 'KS3', cohort: 'Year 9', displayTitle: 'Causes of the Great War (1870–1914)' },
  { unitId: 'great_war_part2', phase: 'KS3', cohort: 'Year 9', displayTitle: 'The Great War: Western Front & Aftermath (1914–1919)' },
  { unitId: 'the_shoah', phase: 'KS3', cohort: 'Year 9', displayTitle: 'The Shoah (1933–1948)' },
  { unitId: 'cold_war', phase: 'KS3', cohort: 'Year 9', displayTitle: 'The Cold War (1945–1991)' },
  { unitId: 'post_war_britain', phase: 'KS3', cohort: 'Year 9', displayTitle: 'Rights, Protest & Post-War Britain (1945–1990s)' },

  // Key Stage 4 / GCSE (6 Courses)
  { unitId: 'edexcel_medicine', phase: 'GCSE', cohort: 'Paper 1 (Y10–11)', displayTitle: 'Medicine in Britain & Western Front (c1250–Present)' },
  { unitId: 'eee', phase: 'GCSE', cohort: 'Paper 2B (Y10–11)', displayTitle: 'Early Elizabethan England (1558–1588)' },
  { unitId: 'gcse_cold_war', phase: 'GCSE', cohort: 'Paper 2P (Y10–11)', displayTitle: 'Superpower Relations & Cold War (1941–1991)' },
  { unitId: 'cme_new', phase: 'GCSE', cohort: 'Paper 2P (Y10–11)', displayTitle: 'Conflict in the Middle East (1945–1995)' },
  { unitId: 'weimar_nazi_germany', phase: 'GCSE', cohort: 'Paper 3 (Y10–11)', displayTitle: 'Weimar & Nazi Germany (1918–1939)' },
  { unitId: 'usa', phase: 'GCSE', cohort: 'Paper 3 (Y10–11)', displayTitle: 'The USA: Civil Rights & Vietnam (1954–1975)' },
];

const UNIT_THEMATIC_STRANDS = {
  // =============================================================
  // KEY STAGE 2 PRIMARY UNITS (12 COURSES)
  // =============================================================
  ks2_stone_to_iron_age: [
    {
      id: 'sovereignty_state_power',
      title: 'Bands, Chieftains & Hillforts',
      color: '#1e3a8a',
      trajectory: 'Nomadic hunter bands → Communal Stonehenge labour → Iron Age tribal hillforts like Maiden Castle (L1, L3, L6)',
      lessonsCovered: [1, 3, 6],
    },
    {
      id: 'trade_technology_empire',
      title: 'Flint, Bronze & Iron Revolutions',
      color: '#0369a1',
      trajectory: 'Chipped flint handaxes → European copper-tin bronze smelting → Iron Age furnaces & gold torcs (L1, L4, L6)',
      lessonsCovered: [1, 4, 6],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Solstice Skies & Ancestor Monuments',
      color: '#b91c1c',
      trajectory: 'Star Carr antler masks → Stonehenge winter/summer solstice alignment → Flag Fen water offerings (L1, L3, L5)',
      lessonsCovered: [1, 3, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Everyday Survival & Community Care',
      color: '#15803d',
      trajectory: 'Skara Brae stone homes → Caring for the injured Amesbury Archer → Must Farm family roundhouses (L2, L4, L5)',
      lessonsCovered: [2, 4, 5],
    },
  ],

  ks2_ancient_egypt: [
    {
      id: 'sovereignty_state_power',
      title: 'Divine Pharaohs & Unification',
      color: '#1e3a8a',
      trajectory: 'Narmer uniting Upper & Lower Egypt → Hatshepsut’s female kingship → Ramesses II’s Kadesh peace treaty (L1, L5, L6)',
      lessonsCovered: [1, 5, 6],
    },
    {
      id: 'trade_technology_empire',
      title: 'Nile Irrigation, Pyramids & Punt Trade',
      color: '#0369a1',
      trajectory: 'Shaduf canals & papyrus boats → Giza limestone engineering → Red Sea expeditions to Punt (L1, L2, L5)',
      lessonsCovered: [1, 2, 5],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Ma’at, Mummification & The Afterlife',
      color: '#b91c1c',
      trajectory: 'Hieroglyphic sacred script → Natron embalming & Book of the Dead → Weighing the Heart against Ma’at (L3, L4, L6)',
      lessonsCovered: [3, 4, 6],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Tomb Builders, Scribes & Royal Women',
      color: '#15803d',
      trajectory: 'Paid Giza artisan villages (not enslaved labour) → Peasant flood-season service → Hatshepsut & Cleopatra VII (L2, L3, L5, L6)',
      lessonsCovered: [2, 3, 5, 6],
    },
  ],

  ks2_ancient_greece: [
    {
      id: 'sovereignty_state_power',
      title: 'Direct Democracy vs Oligarchy',
      color: '#1e3a8a',
      trajectory: 'Independent mountain poleis → Athenian Pnyx voting & ostraka vs Spartan dual kings & council (L1, L2, L4)',
      lessonsCovered: [1, 2, 4],
    },
    {
      id: 'trade_technology_empire',
      title: 'Triremes, Architecture & Hellenistic Reach',
      color: '#0369a1',
      trajectory: 'Aegean maritime colonies → Salamis trireme ramming fleets → Alexander’s cities & Library of Alexandria (L1, L4, L6)',
      lessonsCovered: [1, 4, 6],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Olympian Myth to Rational Philosophy',
      color: '#b91c1c',
      trajectory: 'Twelve Olympians & Olympic Sacred Truce → Socrates, Plato & Aristotle → Hippocratic clinical observation (L3, L5, L6)',
      lessonsCovered: [3, 5, 6],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Citizenship Limits, Women & Civic Voice',
      color: '#15803d',
      trajectory: 'Exclusion of women, metics & enslaved people in Athens vs Spartan women’s property rights & education (L2, L5)',
      lessonsCovered: [2, 5],
    },
  ],

  ks2_romans: [
    {
      id: 'sovereignty_state_power',
      title: 'Imperial Conquest & Provincial Rule',
      color: '#1e3a8a',
      trajectory: 'Claudius’s AD 43 invasion → Client kingdoms & Roman governors → AD 410 imperial withdrawal (L2, L3, L6)',
      lessonsCovered: [2, 3, 6],
    },
    {
      id: 'trade_technology_empire',
      title: 'Roads, Aqueducts, Baths & Walls',
      color: '#0369a1',
      trajectory: 'Legionary armour & Watling Street → 73-mile Hadrian’s Wall → Hypocaust villas, aqueducts & coinage (L2, L4, L5)',
      lessonsCovered: [2, 4, 5],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Druids, Roman Gods & Early Christianity',
      color: '#b91c1c',
      trajectory: 'Celtic Druids → Sulis Minerva temple fusion at Bath → Late Roman Christian hoards & Latin literacy (L1, L5, L6)',
      lessonsCovered: [1, 5, 6],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Boudicca’s Revolt & Diverse Frontier Lives',
      color: '#15803d',
      trajectory: 'Boudicca’s AD 60–61 Iceni uprising → Syrian, North African & European soldiers/families along Hadrian’s Wall (L3, L4)',
      lessonsCovered: [3, 4],
    },
  ],

  ks2_anglo_saxons_vikings: [
    {
      id: 'sovereignty_state_power',
      title: 'Heptarchy, Danelaw & Uniting England',
      color: '#1e3a8a',
      trajectory: 'Seven Saxon kingdoms → Alfred’s burhs & Danelaw treaty → Athelstan’s united England, Witan & 1066 (L1, L4, L6)',
      lessonsCovered: [1, 4, 6],
    },
    {
      id: 'trade_technology_empire',
      title: 'Clinker Longships, Burhs & Global Jorvik',
      color: '#0369a1',
      trajectory: 'Shallow-draught Viking longships → Fortified burh market towns → Jorvik workshops trading to Baghdad (L3, L4, L5)',
      lessonsCovered: [3, 4, 5],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Pagan Burials to Christian Monasteries',
      color: '#b91c1c',
      trajectory: 'Sutton Hoo ship burial → Canterbury, Iona & Lindisfarne Gospels → Gosforth Cross Norse-Christian fusion (L2, L3, L5)',
      lessonsCovered: [2, 3, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Thing Law-Assemblies & Female Leadership',
      color: '#15803d',
      trajectory: 'Outdoor Viking Thing law-courts & women’s property rights → Aethelflaed, Lady of the Mercians (L5, L6)',
      lessonsCovered: [5, 6],
    },
  ],

  ks2_early_islamic_baghdad: [
    {
      id: 'sovereignty_state_power',
      title: 'Abbasid Caliphate & Planned Round City',
      color: '#1e3a8a',
      trajectory: 'Caliph al-Mansur’s AD 762 Round City → Abbasid civic administration → 1258 Mongol siege & survival of scholarship (L1, L6)',
      lessonsCovered: [1, 6],
    },
    {
      id: 'trade_technology_empire',
      title: 'Paper Mills, Silk Roads & Viking Dirhams',
      color: '#0369a1',
      trajectory: 'Samarkand paper-making → Silk Road caravanserais & Indian Ocean dhows → Silver dirhams buried in Viking York (L2, L4, L5)',
      lessonsCovered: [2, 4, 5],
    },
    {
      id: 'ideology_faith_causation',
      title: 'House of Wisdom, Algebra, Optics & Medicine',
      color: '#b91c1c',
      trajectory: 'Multi-faith Translation Movement → Al-Khwarizmi’s algebra & 0–9 numerals → Astrolabes, optics & bimaristan hospitals (L2, L3, L6)',
      lessonsCovered: [2, 3, 6],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Free Hospital Care & Female Scholars',
      color: '#15803d',
      trajectory: 'Free treatment for rich and poor in bimaristan wards → Mariam al-Asturlabi’s precision brass astrolabes (L2, L3)',
      lessonsCovered: [2, 3],
    },
  ],

  ks2_maya_civilisation: [
    {
      id: 'sovereignty_state_power',
      title: 'Rainforest City-States & Divine Rulers',
      color: '#1e3a8a',
      trajectory: 'Rival city-states (Tikal, Calakmul, Palenque) → King Pakal & Lady Six Sky → Post-AD 900 northern Yucatán centres (L2, L6)',
      lessonsCovered: [2, 6],
    },
    {
      id: 'trade_technology_empire',
      title: 'Cenote Reservoirs, Terraces & Cacao Trade',
      color: '#0369a1',
      trajectory: 'Limestone cenote storage & Three Sisters farming → Obsidian blades, jade & cacao bean currency (L1, L4)',
      lessonsCovered: [1, 4],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Glyphs, Base-20 Zero & Equinox Astronomy',
      color: '#b91c1c',
      trajectory: '800+ Maya glyphs & bark codices → Independent invention of zero & interlocking calendars → Popol Vuh & Chichén Itzá (L3, L5)',
      lessonsCovered: [3, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Cultural Resilience & 7 Million Maya Today',
      color: '#15803d',
      trajectory: 'Adapting after c. AD 900 southern drought → Preserving 30+ Mayan languages, weaving & traditions today (L4, L6)',
      lessonsCovered: [4, 6],
    },
  ],

  ks2_kingdom_of_benin: [
    {
      id: 'sovereignty_state_power',
      title: 'Ogiso Rulers, Sacred Obas & Palace Guilds',
      color: '#1e3a8a',
      trajectory: 'Early Ogiso rainforest rulers → Oba Eweka I & Oba Ewuare’s nine-gated capital → Oba Esigie & Queen Mother Idia’s counsel (L1, L2, L4)',
      lessonsCovered: [1, 2, 4],
    },
    {
      id: 'trade_technology_empire',
      title: '16,000 km Earthworks, Lost-Wax Bronzes & Manillas',
      color: '#0369a1',
      trajectory: 'Hand-dug red-clay Iya ramparts → Igun Street lost-wax brass plaques → 1485 Gwato trade with Portugal & 1897 British invasion (L1, L3, L5, L6)',
      lessonsCovered: [1, 3, 5, 6],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Sacred Kingship, Leopards & Igue Ceremonies',
      color: '#b91c1c',
      trajectory: 'Sacred Ife origins → Royal leopard & mudfish symbolism on ivory/brass → Annual Igue coral-bead renewal festival (L2, L3, L4)',
      lessonsCovered: [2, 3, 4],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Queen Mother Idia, 1897 Resistance & Restitution',
      color: '#15803d',
      trajectory: 'Iyoba Idia’s leadership → Oba Ovonramwen defending Benin sovereignty in 1897 → Nigerian scholars leading modern museum restitution (L4, L6)',
      lessonsCovered: [4, 6],
    },
  ],

  ks2_victorian_britain: [
    {
      id: 'sovereignty_state_power',
      title: 'Constitutional Monarchy & Social Reform Laws',
      color: '#1e3a8a',
      trajectory: 'Queen Victoria’s 1837–1901 reign → 1834 Poor Law Workhouses → Parliament’s 1842 Mines Act, 1847 Ten Hours Act & 1870–1891 Education Acts (L1, L3, L4)',
      lessonsCovered: [1, 3, 4],
    },
    {
      id: 'trade_technology_empire',
      title: 'Steam Railways, Cottonopolis & 1851 Inventions',
      color: '#0369a1',
      trajectory: 'Brunel’s Great Western Railway & 1840 Penny Black → Steam-powered mills & pits → 1851 Crystal Palace, telegraph, Swan’s bulb & Babbage/Lovelace (L1, L2, L5)',
      lessonsCovered: [1, 2, 5],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Self-Help vs Philanthropy & Universal Schooling',
      color: '#b91c1c',
      trajectory: 'Harsh Workhouse deterrence vs Shaftesbury & Barnardo’s Christian philanthropy → Compulsory secular & board schooling in the Three Rs (L3, L4)',
      lessonsCovered: [3, 4],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Working Children’s Voices & Pioneering Women',
      color: '#15803d',
      trajectory: 'Eight-year-old Sarah Gooder’s 1842 pit testimony → Barnardo’s East End rescues → Mary Seacole & Ada Lovelace breaking barriers (L2, L3, L5, L6)',
      lessonsCovered: [2, 3, 5, 6],
    },
  ],

  ks2_local_history_detective: [
    {
      id: 'sovereignty_state_power',
      title: 'Domesday Survey, Royal Cyphers & Civic Halls',
      color: '#1e3a8a',
      trajectory: 'Roman castra & 1086 Domesday Book entries → Victorian town halls & royal postbox cyphers (V.R. to CIIIR) → 1947 Listed Building protection (L1, L2, L6)',
      lessonsCovered: [1, 2, 6],
    },
    {
      id: 'trade_technology_empire',
      title: 'Turnpikes, Canals, Steam Stations & OS Maps',
      color: '#0369a1',
      trajectory: 'Market crosses, watermills & 1805 canal locks → 1840s railway stations & 1880s Ordnance Survey maps → 1960s Beeching closures (L1, L4)',
      lessonsCovered: [1, 4],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Parish Registers, Civic Pride & Remembrance',
      color: '#b91c1c',
      trajectory: '1538 parish church registers → Victorian Mechanics’ Institutes → 1919+ town War Memorials & Sir Fabian Ware’s equal CWGC headstones (L2, L3, L5)',
      lessonsCovered: [2, 3, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Everyday Households, Heritage & Living Memory',
      color: '#15803d',
      trajectory: '1881 Census families & 1862 School Logbook children → Octavia Hill’s 1895 National Trust → Diverse post-war oral history memories (L3, L5, L6)',
      lessonsCovered: [3, 5, 6],
    },
  ],

  ks2_crime_and_punishment: [
    {
      id: 'sovereignty_state_power',
      title: 'Rule of Law, Royal Courts & Twelve-Person Juries',
      color: '#1e3a8a',
      trajectory: 'Roman Twelve Tables & Saxon wergild → Henry II’s Common Law juries & 1215 Magna Carta → 1605 High Treason deterrence (L1–L4)',
      lessonsCovered: [1, 2, 3, 4],
    },
    {
      id: 'trade_technology_empire',
      title: 'From Superstitious Ordeals to DNA Forensics',
      color: '#0369a1',
      trajectory: 'Bath curse tablets & hot-iron ordeals → 1660 Royal Society, 1901 Scotland Yard fingerprints & 1984 Leicester DNA (L1, L2, L4, L6)',
      lessonsCovered: [1, 2, 4, 6],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Church Sanctuary, Witch Panics & Quaker Reform',
      color: '#b91c1c',
      trajectory: 'Durham sanctuary knockers & 1215 ordeal ban → 1645–1647 witch panics → Elizabeth Fry’s Quaker prison schooling (L2–L5)',
      lessonsCovered: [2, 3, 4, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Social Crime, Merciful Juries & Policing by Consent',
      color: '#15803d',
      trajectory: 'Norman poaching & Cornish smuggling → Reluctant Bloody Code juries → Peel’s 1829 unarmed Bobbies & 1965 abolition (L3, L5, L6)',
      lessonsCovered: [3, 5, 6],
    },
  ],

  ks2_ww2: [
    {
      id: 'sovereignty_state_power',
      title: 'Democracy Under Threat & Wartime State',
      color: '#1e3a8a',
      trajectory: '1939 outbreak & ARP blackout → Operation Pied Piper evacuation & rationing → 1945 VE Day & post-war welfare rebuilding (L1, L2, L7, L10)',
      lessonsCovered: [1, 2, 7, 10],
    },
    {
      id: 'trade_technology_empire',
      title: 'Air Defence, Atlantic Convoys & Enigma',
      color: '#0369a1',
      trajectory: 'Anderson/Morrison shelter engineering → Dig for Victory food security → Bletchley Park Bombe & Colossus codebreaking (L6, L7, L9)',
      lessonsCovered: [6, 7, 9],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Nazi Persecution vs Civic Solidarity',
      color: '#b91c1c',
      trajectory: '1933–38 loss of Jewish civil rights → Fair-shares Home Front solidarity → Post-war remembrance & human rights (L3, L7, L10)',
      lessonsCovered: [3, 7, 10],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Kindertransport Upstanders, Women & Healing',
      color: '#15803d',
      trajectory: 'Kindertransport rescuers (Winton, Warriner, Chadwick) → Women’s Land Army & WRNS → Windermere Children recovery (L4, L5, L8, L11)',
      lessonsCovered: [4, 5, 8, 11],
    },
  ],

  // =============================================================
  // KEY STAGE 3 SECONDARY UNITS (12 COURSES)
  // =============================================================
  water_and_sanitation: [
    {
      id: 'sovereignty_state_power',
      title: 'Public Health & State Power',
      color: '#1e3a8a',
      trajectory: 'Roman civic governance → Medieval municipal neglect → 1848 & 1875 Public Health Acts (L1, L2, L4, L6)',
      lessonsCovered: [1, 2, 4, 6],
    },
    {
      id: 'trade_technology_empire',
      title: 'Sanitary Engineering & Infrastructure',
      color: '#0369a1',
      trajectory: 'Roman aqueducts → Monastic Laver conduits → Joseph Bazalgette’s London interceptor sewers (L1, L2, L6)',
      lessonsCovered: [1, 2, 6],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Miasma to Epidemiological Proof',
      color: '#b91c1c',
      trajectory: 'Humoural & miasma theories → John Snow’s 1854 Broad Street cholera map → Pasteur’s Germ Theory (L3, L5, L6)',
      lessonsCovered: [3, 5, 6],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Urban Reformers & Clean-Water Rights',
      color: '#15803d',
      trajectory: 'Industrial slum crisis → Chadwick’s sanitary reports → Universal municipal clean water supply (L4, L5, L6)',
      lessonsCovered: [4, 5, 6],
    },
  ],

  medieval_england: [
    {
      id: 'sovereignty_state_power',
      title: 'Crown, Barons & Magna Carta',
      color: '#1e3a8a',
      trajectory: '1066 Norman Conquest & Domesday → Henry II vs Becket → 1215 Magna Carta constitutional limits (L1, L2, L3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'trade_technology_empire',
      title: 'Castles, Land Audits & Post-Plague Wages',
      color: '#0369a1',
      trajectory: 'Motte-and-bailey castles → 1086 Domesday valuation → Post-1348 labour shortage & wage pressure (L1, L2, L4, L5)',
      lessonsCovered: [1, 2, 4, 5],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Medieval Church Authority & Plague Beliefs',
      color: '#b91c1c',
      trajectory: 'Papal authority & Becket’s martyrdom → Doom paintings → Supernatural vs miasmic Black Death explanations (L3, L4)',
      lessonsCovered: [3, 4],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Baronial Revolt & The 1381 Peasants’ Revolt',
      color: '#15803d',
      trajectory: 'Saxon resistance → Runnymede baronial charter → Wat Tyler, John Ball & the 1381 Rising against serfdom (L2, L3, L5)',
      lessonsCovered: [2, 3, 5],
    },
  ],

  monarchy_religion_power: [
    {
      id: 'sovereignty_state_power',
      title: 'Divine Right to Constitutional Monarchy',
      color: '#1e3a8a',
      trajectory: 'Henry VIII’s Royal Supremacy → 1649 Regicide of Charles I → 1689 Glorious Revolution & Bill of Rights (L1, L4, L5)',
      lessonsCovered: [1, 4, 5],
    },
    {
      id: 'trade_technology_empire',
      title: 'Printing Press, Naval Defence & Taxation',
      color: '#0369a1',
      trajectory: 'Protestant print networks → 1588 defeat of the Spanish Armada → Ship Money & parliamentary finance (L1, L2, L3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Reformation Rollercoaster & Puritan Zeal',
      color: '#b91c1c',
      trajectory: 'Luther & Break with Rome → Elizabeth’s 1559 Religious Settlement → Puritanism & Gunpowder Plot tensions (L1, L2, L3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Parliamentary Resistance & Radical Voices',
      color: '#15803d',
      trajectory: 'Parliamentary challenge to Stuart rule → New Model Army debates & Leveller demands (L3, L4, L5)',
      lessonsCovered: [3, 4, 5],
    },
  ],

  first_british_empire: [
    {
      id: 'sovereignty_state_power',
      title: 'Colonial Charters to American Independence',
      color: '#1e3a8a',
      trajectory: 'Jamestown & Thirteen Colonies → East India Company rule in Bengal → 1776 Declaration of Independence (L1, L2, L5)',
      lessonsCovered: [1, 2, 5],
    },
    {
      id: 'trade_technology_empire',
      title: 'Mercantilism, EIC & Transatlantic Trade',
      color: '#0369a1',
      trajectory: 'Joint-stock monopolies → Plassey & Bengal Diwani taxation → Atlantic plantation commodities (L1, L2, L3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Enlightenment Liberty vs Racial Slavery',
      color: '#b91c1c',
      trajectory: 'Puritan & mercantile colonisation ideas → Racialised plantation codes vs Enlightenment natural rights (L1, L3, L5)',
      lessonsCovered: [1, 3, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Indigenous, Enslaved & Colonial Resistance',
      color: '#15803d',
      trajectory: 'Indigenous diplomacy & conflict → Maroon wars, Equiano & enslaved resistance → 1773–83 American Revolution (L1, L4, L5)',
      lessonsCovered: [1, 4, 5],
    },
  ],

  industrialisation_and_empire: [
    {
      id: 'sovereignty_state_power',
      title: 'Parliamentary Reform & Factory Regulation',
      color: '#1e3a8a',
      trajectory: 'Laissez-faire mill governance → 1833 Factory Act & Sadler Inquiry → Victorian parliamentary reform (L2, L3, L5)',
      lessonsCovered: [2, 3, 5],
    },
    {
      id: 'trade_technology_empire',
      title: 'Steam, Iron, Cotton Mills & Railways',
      color: '#0369a1',
      trajectory: 'Cort’s iron puddling & Watt steam → Arkwright’s Cromford factory system → Stephenson & Brunel railways (L1, L2, L4)',
      lessonsCovered: [1, 2, 4],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Free Trade, Progress & Abolitionist Conscience',
      color: '#b91c1c',
      trajectory: 'Industrial capitalism & time-discipline → Humanitarian Factory & Abolition campaigns (L2, L3, L5)',
      lessonsCovered: [2, 3, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Child Workers, Trade Unions & Chartists',
      color: '#15803d',
      trajectory: 'Apprentice mill & mine testimonies → Luddites, Chartist petitions & working-class suffrage struggle (L3, L5)',
      lessonsCovered: [3, 5],
    },
  ],

  second_british_empire: [
    {
      id: 'sovereignty_state_power',
      title: 'Company Rule to Crown Raj & Partition',
      color: '#1e3a8a',
      trajectory: '1858 Government of India Act & British Raj → 1884–85 Berlin Conference & Scramble for Africa (L1, L3, L4)',
      lessonsCovered: [1, 3, 4],
    },
    {
      id: 'trade_technology_empire',
      title: 'Steamships, Suez, Telegraph & Extraction',
      color: '#0369a1',
      trajectory: 'Free-trade imperialism → Suez Canal, quinine, Maxim guns & colonial railway extraction (L1, L2, L4)',
      lessonsCovered: [1, 2, 4],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Imperial "Civilising Mission" & Historiography',
      color: '#b91c1c',
      trajectory: 'Social Darwinism & Victorian imperial propaganda → Post-colonial critique of imperial legacies (L3, L4, L5)',
      lessonsCovered: [3, 4, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: '1857 Indian Rebellion & Anti-Colonial Resistance',
      color: '#15803d',
      trajectory: 'Rani Lakshmibai & the 1857 Uprising → Ashanti, Zulu & anti-colonial nationalist movements (L2, L3, L5)',
      lessonsCovered: [2, 3, 5],
    },
  ],

  australia: [
    {
      id: 'sovereignty_state_power',
      title: 'Terra Nullius, Penal Colonies & 1901 Federation',
      color: '#1e3a8a',
      trajectory: '65,000+ years of First Nations custodial law → 1788 First Fleet penal colony → 1901 Federation (L1, L2, L5)',
      lessonsCovered: [1, 2, 5],
    },
    {
      id: 'trade_technology_empire',
      title: 'Pastoral Expansion, Wool & Gold Rushes',
      color: '#0369a1',
      trajectory: 'First Nations fire-stick farming → Settler sheep stations → 1850s Victorian Gold Rush boom (L1, L3, L4)',
      lessonsCovered: [1, 3, 4],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Dreaming Country vs Settler Colonialism',
      color: '#b91c1c',
      trajectory: 'Connection to Country & Songlines → Legal fiction of Terra Nullius → White Australia policy & reconciliation (L1, L2, L5)',
      lessonsCovered: [1, 2, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Pemulwuy, Frontier Wars & Eureka Stockade',
      color: '#15803d',
      trajectory: 'Pemulwuy & First Nations frontier resistance → Convict survival → 1854 Eureka Stockade & land rights (L2, L3, L4, L5)',
      lessonsCovered: [2, 3, 4, 5],
    },
  ],

  great_war: [
    {
      id: 'sovereignty_state_power',
      title: 'Great Power Alliances & The July Crisis',
      color: '#1e3a8a',
      trajectory: '1871 German unification → Triple Alliance vs Triple Entente → July 1914 diplomatic breakdown (L1, L2, L6)',
      lessonsCovered: [1, 2, 6],
    },
    {
      id: 'trade_technology_empire',
      title: 'Anglo-German Dreadnought & Colonial Rivalry',
      color: '#0369a1',
      trajectory: '1906 HMS Dreadnought naval race → Moroccan crises & imperial competition → Mobilisation railway timetables (L2, L3, L6)',
      lessonsCovered: [2, 3, 6],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Militarism, Nationalism & Balkan Powder Keg',
      color: '#b91c1c',
      trajectory: 'Popular militarism → Pan-Slavism & Austro-Hungarian tension → Sarajevo assassination trigger (L1, L4, L5)',
      lessonsCovered: [1, 4, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Balkan Self-Determination & Anti-War Voices',
      color: '#15803d',
      trajectory: 'Bosnian/Serbian nationalist movements → European socialist peace appeals overwhelmed in August 1914 (L4, L5, L6)',
      lessonsCovered: [4, 5, 6],
    },
  ],

  great_war_part2: [
    {
      id: 'sovereignty_state_power',
      title: 'Total War State, Conscription & Versailles',
      color: '#1e3a8a',
      trajectory: '1914 recruitment → 1916 Conscription & DORA → 1918 Armistice & 1919 Treaty of Versailles (L1, L3, L5)',
      lessonsCovered: [1, 3, 5],
    },
    {
      id: 'trade_technology_empire',
      title: 'Trench Attrition, Artillery, Poison Gas & Tanks',
      color: '#0369a1',
      trajectory: 'Western Front trench systems → Somme artillery & creeping barrage → Imperial troops, tanks & 1918 Hundred Days (L1, L2, L4)',
      lessonsCovered: [1, 2, 4],
    },
    {
      id: 'ideology_faith_causation',
      title: 'War Poetry, Morale & The Haig Debate',
      color: '#b91c1c',
      trajectory: 'Patriotic enlistment → Trench disillusionment → Historiographical debate over British generalship (L1, L2, L5)',
      lessonsCovered: [1, 2, 5],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Empire Soldiers, Munitionettes & Objectors',
      color: '#15803d',
      trajectory: 'Indian, Caribbean & Dominion soldiers → Female munitions workers & 1918 suffrage → Conscientious objectors (L3, L4)',
      lessonsCovered: [3, 4],
    },
  ],

  the_shoah: [
    {
      id: 'sovereignty_state_power',
      title: 'Legal Dictatorship to Continental Genocide',
      color: '#1e3a8a',
      trajectory: '1935 Nuremberg Laws → Wartime ghetto administration → 1942 Wannsee coordination & Nuremberg Trials (L2, L3, L5, L7)',
      lessonsCovered: [2, 3, 5, 7],
    },
    {
      id: 'trade_technology_empire',
      title: 'Bureaucracy, Railways & Industrial Murder',
      color: '#0369a1',
      trajectory: 'Census cards & confiscated property → Reichsbahn deportation timetables → Operation Reinhard & Auschwitz-Birkenau (L2, L5, L6)',
      lessonsCovered: [2, 5, 6],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Racial Antisemitism, Complicity & Bystanders',
      color: '#b91c1c',
      trajectory: 'Pre-war Jewish cultural richness vs racial ideology → Einsatzgruppen & local collaboration across Europe (L1, L4, L6)',
      lessonsCovered: [1, 4, 6],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Spiritual & Armed Jewish Resistance & Rescue',
      color: '#15803d',
      trajectory: 'Oneg Shabbat secret archive → Warsaw Ghetto Uprising & Roza Robota → Danish rescue & survivor rebuilding (L3, L5, L6, L7)',
      lessonsCovered: [3, 5, 6, 7],
    },
  ],

  cold_war: [
    {
      id: 'sovereignty_state_power',
      title: 'Superpower Spheres, Alliances & Collapse',
      color: '#1e3a8a',
      trajectory: 'Yalta/Potsdam & Iron Curtain → NATO vs Warsaw Pact & Berlin Wall → 1989 Revolutions & 1991 USSR dissolution (L1, L3, L7)',
      lessonsCovered: [1, 3, 7],
    },
    {
      id: 'trade_technology_empire',
      title: 'Nuclear Arms Race, Berlin Airlift & Space Race',
      color: '#0369a1',
      trajectory: '1945 Atom Bomb & Marshall Aid → Sputnik, ICBMs & Cuban quarantine → Economic stagnation vs SDI pressure (L1, L2, L4, L7)',
      lessonsCovered: [1, 2, 4, 7],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Capitalist Democracy vs Soviet Communism',
      color: '#b91c1c',
      trajectory: 'Truman Doctrine & Containment → Domino Theory in Asia → Gorbachev’s Glasnost & Perestroika (L1, L5, L7)',
      lessonsCovered: [1, 5, 7],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Eastern Bloc Dissent & Global Proxy Struggles',
      color: '#15803d',
      trajectory: '1956 Hungarian & 1968 Prague uprisings → Peace/CND movements → Solidarity & 1989 fall of the Berlin Wall (L3, L6, L7)',
      lessonsCovered: [3, 6, 7],
    },
  ],

  post_war_britain: [
    {
      id: 'sovereignty_state_power',
      title: 'Welfare State, Decolonisation & Modern Britain',
      color: '#1e3a8a',
      trajectory: '1945 Labour landslide & Beveridge Report → 1948 NHS & nationalisation → Post-imperial constitutional change (L1, L2, L5)',
      lessonsCovered: [1, 2, 5],
    },
    {
      id: 'trade_technology_empire',
      title: 'Post-War Reconstruction, Housing & Deindustrialisation',
      color: '#0369a1',
      trajectory: 'Austerity rebuilding & New Towns → Commonwealth labour recruitment → 1970s–80s industrial transformation (L1, L2, L5)',
      lessonsCovered: [1, 2, 5],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Social Consensus, Youth Culture & Equalities Law',
      color: '#b91c1c',
      trajectory: 'Cradle-to-grave welfare ideal → 1960s social liberalisation → Race Relations, Equal Pay & Equality Acts (L1, L3, L4)',
      lessonsCovered: [1, 3, 4],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Windrush Generation, Bristol Bus Boycott & Equal Rights',
      color: '#15803d',
      trajectory: '1948 HMT Empire Windrush → 1963 Bristol Bus Boycott → Dagenham women’s strike, LGBTQ+ & disability rights (L2, L3, L4, L5)',
      lessonsCovered: [2, 3, 4, 5],
    },
  ],

  // =============================================================
  // KEY STAGE 4 / GCSE SPECIFICATION UNITS (6 COURSES)
  // =============================================================
  edexcel_medicine: [
    {
      id: 'sovereignty_state_power',
      title: 'Laissez-Faire to 1875 Public Health & 1948 NHS',
      color: '#1e3a8a',
      trajectory: 'Medieval royal non-intervention → 1875 Public Health Act → 1948 NHS, mass vaccination & anti-smoking laws (KT1, KT3, KT4)',
      lessonsCovered: [1, 3, 4],
    },
    {
      id: 'trade_technology_empire',
      title: 'Printing, Microscopes, Antiseptics & Western Front Surgery',
      color: '#0369a1',
      trajectory: 'Renaissance printing press → Jenner, Simpson & Lister → 1914–18 X-rays, Thomas splint, blood bank & mass penicillin (KT2–KT5)',
      lessonsCovered: [2, 3, 4, 5],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Four Humours & Church to Germ Theory & DNA',
      color: '#b91c1c',
      trajectory: 'Galenic Four Humours & miasma → Vesalius & Harvey → Pasteur’s 1861 Germ Theory, Koch & Crick/Watson/Franklin DNA (KT1–KT4)',
      lessonsCovered: [1, 2, 3, 4],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Nursing Reform, RAMC/FANY & Universal Healthcare',
      color: '#15803d',
      trajectory: 'Nightingale’s hospital reforms → FANY & RAMC stretcher-bearers on the Western Front → Free NHS access for all (KT3, KT4, KT5)',
      lessonsCovered: [3, 4, 5],
    },
  ],

  eee: [
    {
      id: 'sovereignty_state_power',
      title: 'Female Monarchy, Privy Council & Catholic Plots',
      color: '#1e3a8a',
      trajectory: '1558 legitimacy & Privy Council → 1569 Revolt of Northern Earls, Ridolfi, Throckmorton & Babington Plots (KT1, KT2)',
      lessonsCovered: [1, 2],
    },
    {
      id: 'trade_technology_empire',
      title: 'Galleon Design, Drake’s Circumnavigation & Virginia',
      color: '#0369a1',
      trajectory: 'Astrolabes & race-built galleons → Drake’s 1577–80 voyage & Cadiz raid → Raleigh’s Roanoke colonies & 1588 Armada defeat (KT2, KT3)',
      lessonsCovered: [2, 3],
    },
    {
      id: 'ideology_faith_causation',
      title: '1559 Religious Settlement vs Puritan & Papal Challenges',
      color: '#b91c1c',
      trajectory: 'Acts of Supremacy & Uniformity → Puritan crucifix/vestment controversies → 1570 Papal Bull & Jesuit missions (KT1, KT2)',
      lessonsCovered: [1, 2],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Education, Pastimes, Vagabondage & Poor Relief Laws',
      color: '#15803d',
      trajectory: 'Enclosure & rising vagabondage → 1563 Statute of Artificers, 1572 Vagabonds Act & 1576 Poor Relief Act (KT3)',
      lessonsCovered: [3],
    },
  ],

  gcse_cold_war: [
    {
      id: 'sovereignty_state_power',
      title: 'Grand Alliance Breakdown to Soviet Collapse (1941–91)',
      color: '#1e3a8a',
      trajectory: 'Tehran/Yalta/Potsdam & satellite states → Berlin Ultimatum/Wall & Brezhnev Doctrine → 1989–91 Warsaw Pact & USSR collapse (KT1–KT3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'trade_technology_empire',
      title: 'Marshall Plan, Comecon, Missiles, Détente & SDI',
      color: '#0369a1',
      trajectory: 'Marshall Aid vs Comecon → Berlin Airlift, Cuban missiles & Test Ban Treaty → SALT 1, Helsinki & Reagan’s SDI (KT1–KT3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Truman Doctrine, Brezhnev Doctrine & Gorbachev’s New Thinking',
      color: '#b91c1c',
      trajectory: 'Long/Novikov telegrams & Cominform → Brezhnev Doctrine → Carter Doctrine, Evil Empire & Gorbachev’s New Thinking (KT1–KT3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'resistance_agency_rights',
      title: '1956 Hungary, 1968 Prague Spring & 1989 Berlin Wall',
      color: '#15803d',
      trajectory: 'Nagy’s 1956 Hungarian Uprising → Dubček’s 1968 Socialism with a Human Face → Helsinki Basket 3 & November 1989 Berlin Wall fall (KT1–KT3)',
      lessonsCovered: [1, 2, 3],
    },
  ],

  cme_new: [
    {
      id: 'sovereignty_state_power',
      title: 'British Mandate, Partition, Wars & Peace Accords',
      color: '#1e3a8a',
      trajectory: '1947 UN Partition & 1948–49 War → 1967 Six-Day War territorial shifts → 1978 Camp David & 1993–95 Oslo I/II Accords (KT1–KT3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'trade_technology_empire',
      title: 'Suez Canal, Cold War Arms & 1973 Oil Weapon',
      color: '#0369a1',
      trajectory: '1956 Suez nationalisation → US/Soviet superpower arms transfers → 1973 Yom Kippur War & OPEC oil embargo (KT1–KT3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Zionism, Pan-Arab Nationalism & Competing Claims',
      color: '#b91c1c',
      trajectory: 'Post-Holocaust Jewish statehood & Arab nationalism → Nasserism, PLO Charter, Hamas & Israeli settler politics (KT1–KT3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Refugees, Fedayeen, First Intifada & Peace Diplomacy',
      color: '#15803d',
      trajectory: 'Palestinian & Jewish refugee crises → Arafat & PLO → 1987 First Intifada grassroots resistance & Rabin-Arafat talks (KT1–KT3)',
      lessonsCovered: [1, 2, 3],
    },
  ],

  weimar_nazi_germany: [
    {
      id: 'sovereignty_state_power',
      title: 'Weimar Democracy to Hitler’s Totalitarian Dictatorship',
      color: '#1e3a8a',
      trajectory: '1919 Weimar Constitution & Article 48 → 1933 Reichstag Fire, Enabling Act & 1934 Night of the Long Knives (KT1–KT3)',
      lessonsCovered: [1, 2, 3],
    },
    {
      id: 'trade_technology_empire',
      title: 'Hyperinflation, Stresemann Recovery, Depression & Rearmament',
      color: '#0369a1',
      trajectory: '1923 Ruhr & hyperinflation → Rentenmark, Dawes/Young Plans → 1929 Wall Street Crash & Nazi Autobahn/rearmament economy (KT1, KT2, KT4)',
      lessonsCovered: [1, 2, 4],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Propaganda, Church Control, Youth & Racial Persecution',
      color: '#b91c1c',
      trajectory: 'Stab-in-the-Back myth → Goebbels censorship, Hitler Youth & League of German Maidens → 1935 Nuremberg Laws & Kristallnacht (KT1, KT3, KT4)',
      lessonsCovered: [1, 3, 4],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Weimar Women’s Freedoms vs Opposition to Nazi Control',
      color: '#15803d',
      trajectory: '1920s female voting & cultural freedom → Niemöller’s Confessional Church, Edelweiss Pirates & Swing Youth opposition (KT1, KT3, KT4)',
      lessonsCovered: [1, 3, 4],
    },
  ],

  usa: [
    {
      id: 'sovereignty_state_power',
      title: 'Federal Law vs Jim Crow States & Presidential War Powers',
      color: '#1e3a8a',
      trajectory: '1954 Brown v. Topeka & Little Rock federal intervention → 1964 Civil Rights & 1965 Voting Rights Acts → Tonkin Resolution & Watergate (KT1–KT4)',
      lessonsCovered: [1, 2, 3, 4],
    },
    {
      id: 'trade_technology_empire',
      title: 'Economic Boycotts & Asymmetric Vietnam Warfare',
      color: '#0369a1',
      trajectory: '1955–56 Montgomery Bus Boycott → US helicopters, Operation Rolling Thunder & napalm vs Ho Chi Minh Trail & Vietcong tunnels (KT1, KT3)',
      lessonsCovered: [1, 3],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Non-Violent Direct Action, Black Power & Domino Theory',
      color: '#b91c1c',
      trajectory: 'King’s Christian non-violence vs Malcolm X & Black Panthers → Cold War Domino Theory vs televised Tet Offensive shock (KT1–KT4)',
      lessonsCovered: [1, 2, 3, 4],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Grassroots Civil Rights Activists & Anti-Vietnam Protest',
      color: '#15803d',
      trajectory: 'Rosa Parks, Greensboro sit-ins, Freedom Riders & Selma → Student, draft-resistance, Kent State & veteran peace movements (KT1, KT2, KT4)',
      lessonsCovered: [1, 2, 4],
    },
  ],
};

// Backward-compatible legacy aliases (non-enumerable so vertical progression never double-counts)
Object.defineProperties(UNIT_THEMATIC_STRANDS, {
  medicine_through_time: { value: UNIT_THEMATIC_STRANDS.edexcel_medicine, enumerable: false },
  conflict_middle_east: { value: UNIT_THEMATIC_STRANDS.cme_new, enumerable: false },
});

/**
 * Returns the 4 Thematic Strands for any unit, falling back cleanly if unlisted.
 */
function getThematicStrandsForUnit(unitId) {
  if (UNIT_THEMATIC_STRANDS[unitId]) {
    return UNIT_THEMATIC_STRANDS[unitId];
  }
  return [
    {
      id: 'sovereignty_state_power',
      title: 'Power, Democracy & State',
      color: '#1e3a8a',
      trajectory: 'State institutions, governance, authority and constitutional development',
      lessonsCovered: [],
    },
    {
      id: 'trade_technology_empire',
      title: 'Trade, Technology & Empire',
      color: '#0369a1',
      trajectory: 'Economic engines, technical innovations and global connections',
      lessonsCovered: [],
    },
    {
      id: 'ideology_faith_causation',
      title: 'Belief, Science & Worldviews',
      color: '#b91c1c',
      trajectory: 'Religious beliefs, scientific breakthroughs and drivers of historical change',
      lessonsCovered: [],
    },
    {
      id: 'resistance_agency_rights',
      title: 'Everyday Life, Agency & Rights',
      color: '#15803d',
      trajectory: 'Lived experience, social struggle, rights development and human agency',
      lessonsCovered: [],
    },
  ];
}

/**
 * Returns ordered All-Through vertical progression (KS2 → KS3 → GCSE) for a specific strand.
 */
function getVerticalProgression(strandId) {
  const result = [];
  for (const meta of CANONICAL_ALL_THROUGH_UNITS) {
    const strands = UNIT_THEMATIC_STRANDS[meta.unitId];
    if (!strands) continue;
    const match = strands.find((s) => s.id === strandId);
    if (match) {
      result.push({
        unitId: meta.unitId,
        phase: meta.phase,
        cohort: meta.cohort,
        displayTitle: meta.displayTitle,
        ...match,
      });
    }
  }
  return result;
}

if (typeof window !== 'undefined') {
  window.CurriculumStrands = {
    MASTER_DISCIPLINARY_STRANDS,
    CANONICAL_ALL_THROUGH_UNITS,
    UNIT_THEMATIC_STRANDS,
    getThematicStrandsForUnit,
    getVerticalProgression,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MASTER_DISCIPLINARY_STRANDS, CANONICAL_ALL_THROUGH_UNITS, UNIT_THEMATIC_STRANDS, getThematicStrandsForUnit, getVerticalProgression };
}
