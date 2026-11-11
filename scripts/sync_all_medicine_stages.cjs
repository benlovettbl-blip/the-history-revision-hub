const fs = require('fs');
const path = require('path');

// Master dictionary of all 130 canonical stages for Edexcel Medicine (KT1 - KT5)
// Extracted from the 5 official Gold Standard workbook scripts:
// - scripts/render_medicine_medieval_twopage_workbook.cjs
// - scripts/render_medicine_renaissance_twopage_workbook.cjs
// - scripts/render_medicine_18th_19th_twopage_workbook.cjs
// - scripts/render_medicine_modern_twopage_workbook.cjs
// - scripts/render_medicine_western_front_twopage_workbook.cjs

const MEDICINE_CANONICAL_STAGES = {
  // ==========================================
  // KEY TOPIC 1: MEDIEVAL ENGLAND (c1250–c1500)
  // ==========================================
  "lesson_1_1": [
    {
      step: 1,
      title: "Supernatural & Religious Explanations of Disease",
      heading: "Why was disease believed to be a direct punishment sent by God?",
      bullets: ["Divine punishment for sin", "Original sin & human fallen state", "Prayer & repentance as primary cure"],
      model: "Rooted in <strong>Original sin & human fallen state</strong>, ordinary people accepted sickness as <strong>Divine punishment for sin</strong>, relying on <strong>Prayer & repentance as primary cure</strong>."
    },
    {
      step: 2,
      title: "Moral Taint: Leprosy & Social Stigma",
      heading: "Why were leprosy sufferers banished from medieval communities?",
      bullets: ["Biblical leprosy moral stigma", "Exile to isolated Lazar houses", "Warning wooden clappers & bells"],
      model: "Bearing the painful <strong>Biblical leprosy moral stigma</strong>, victims faced <strong>Exile to isolated Lazar houses</strong> while sounding <strong>Warning wooden clappers & bells</strong>."
    },
    {
      step: 3,
      title: "Astrological Influences & The Zodiac Man",
      heading: "How did physicians use planetary movements to diagnose illness?",
      bullets: ["Zodiac Man parchment wheels", "1345 planetary conjunction", "Mars, Saturn & Jupiter alignment"],
      model: "Medieval physicians consulted <strong>Zodiac Man parchment wheels</strong>, blaming the fateful <strong>1345 planetary conjunction</strong> and <strong>Mars, Saturn & Jupiter alignment</strong> for corrupting the air."
    },
    {
      step: 4,
      title: "Spiritual Intercession, Relics & Pilgrimage",
      heading: "Why did sick people travel to saintly shrines seeking divine healing?",
      bullets: ["Arduous pilgrimage to Canterbury", "Kissing holy relics of saints", "Chantry masses & sale of indulgences"],
      model: "Seeking miraculous cures, pilgrims undertook the <strong>Arduous pilgrimage to Canterbury</strong>, reverently <strong>Kissing holy relics of saints</strong> and funding <strong>Chantry masses & sale of indulgences</strong>."
    },
    {
      step: 5,
      title: "Monastic Scriptoria, Galen & Censorship",
      heading: "How did the Church maintain absolute control over medical education?",
      bullets: ["Monastic scriptoria Latin copying", "Galen purposeful creator dogma", "Roger Bacon imprisoned for heresy (1277)"],
      model: "Through <strong>Monastic scriptoria Latin copying</strong> and enforcing <strong>Galen purposeful creator dogma</strong>, the Church suppressed empirical science, leaving <strong>Roger Bacon imprisoned for heresy (1277)</strong>."
    }
  ],
  "lesson_1_2": [
    {
      step: 1,
      title: "Rational Explanations: Hippocrates & Clinical Method",
      heading: "How did Greek observation challenge supernatural beliefs?",
      bullets: ["Hippocratic clinical method", "Rejection of gods", "Hippocratic Oath ethics"],
      model: "By establishing the <strong>Hippocratic clinical method</strong>, Greek physicians pioneered the <strong>Rejection of gods</strong> as direct causes of illness, binding practitioners to <strong>Hippocratic Oath ethics</strong>."
    },
    {
      step: 2,
      title: "The Four Bodily Humours",
      heading: "How did humoral balance explain health and disease?",
      bullets: ["Four bodily humours", "Blood, phlegm & biles", "Seasonal balance system"],
      model: "Medieval rational medicine relied on the <strong>Four bodily humours</strong>, asserting that health required balancing <strong>Blood, phlegm & biles</strong> within a strict <strong>Seasonal balance system</strong>."
    },
    {
      step: 3,
      title: "Galen’s Theory of Opposites",
      heading: "How did Galen extend Hippocratic humoral theory?",
      bullets: ["Galen Theory of Opposites", "Contraries cure contraries", "Animal dissection errors"],
      model: "Building on Hippocrates, <strong>Galen Theory of Opposites</strong> taught that <strong>Contraries cure contraries</strong>, though his anatomical authority was deeply flawed by uncorrected <strong>Animal dissection errors</strong>."
    },
    {
      step: 4,
      title: "The Matula & Diagnostic Uroscopy",
      heading: "Why was urine inspection central to medieval diagnosis?",
      bullets: ["Uroscopy urine flask (matula)", "Urine diagnostic wheel", "Zodiac Man alignment"],
      model: "Physicians inspected patient samples using a glass <strong>Uroscopy urine flask (matula)</strong>, matching colour against a <strong>Urine diagnostic wheel</strong> alongside <strong>Zodiac Man alignment</strong>."
    },
    {
      step: 5,
      title: "Miasma Theory & Foul Vapours",
      heading: "Why was bad air blamed for spreading epidemic disease?",
      bullets: ["Miasma theory (bad air)", "Cesspool stench fears", "Unbalanced bodily fluids"],
      model: "Believing in <strong>Miasma theory (bad air)</strong>, medieval communities associated <strong>Cesspool stench fears</strong> with poisonous airborne vapours that corrupted <strong>Unbalanced bodily fluids</strong>."
    }
  ],
  "lesson_1_3": [
    {
      step: 1,
      title: "Religious Rituals, Prayer & Penance",
      heading: "How did Christians attempt to prevent illness through devotion?",
      bullets: ["Penance & fasting", "Chanted Latin prayers", "Flagellant whipping processions"],
      model: "To avert God's wrath, the medieval Church prescribed strict <strong>Penance & fasting</strong> alongside <strong>Chanted Latin prayers</strong>, inspiring extreme <strong>Flagellant whipping processions</strong> during plague crises."
    },
    {
      step: 2,
      title: "Humoral Phlebotomy (Bloodletting)",
      heading: "Why was bloodletting the most common medieval surgical treatment?",
      bullets: ["Phlebotomy vein incision", "Iron fleams & leeches", "Cupping & pewter bowls"],
      model: "To restore humoral balance, barber-surgeons performed <strong>Phlebotomy vein incision</strong> using <strong>Iron fleams & leeches</strong>, collecting expelled blood in <strong>Cupping & pewter bowls</strong>."
    },
    {
      step: 3,
      title: "Purging, Vomiting & Enemas",
      heading: "How did digestive evacuation treat humoral imbalance?",
      bullets: ["Emetics (black hellebore)", "Laxatives & clysters", "Humoural fluid evacuation"],
      model: "Sufferers took toxic <strong>Emetics (black hellebore)</strong> and administered <strong>Laxatives & clysters</strong> to force immediate <strong>Humoural fluid evacuation</strong> from congested organs."
    },
    {
      step: 4,
      title: "Herbal Apothecary Remedies & Theriac",
      heading: "How were plant mixtures and Theriac used to combat sickness?",
      bullets: ["Herbal Materia Medica", "Theriac (70 ingredients)", "Local apothecaries remedies"],
      model: "Drawing on ancient <strong>Herbal Materia Medica</strong>, compounders mixed complex <strong>Theriac (70 ingredients)</strong> to supply <strong>Local apothecaries remedies</strong> against acute disease."
    },
    {
      step: 5,
      title: "The Regimen Sanitatis & Clean Air",
      heading: "What rules did wealthy elites follow to preserve personal health?",
      bullets: ["Regimen Sanitatis rules", "Sweet pomander scents", "Lavender & burning tar"],
      model: "Wealthy citizens followed <strong>Regimen Sanitatis rules</strong> by carrying <strong>Sweet pomander scents</strong> and fumigating bedchambers with <strong>Lavender & burning tar</strong> to repel bad air."
    }
  ],
  "lesson_1_4": [
    {
      step: 1,
      title: "University Physicians & High Consultation Fees",
      heading: "Why were trained physicians inaccessible to the poor?",
      bullets: ["University-trained physicians", "Latin texts & star charts", "High diagnostic fees"],
      model: "Wealthy elites consulted <strong>University-trained physicians</strong> who diagnosed illness through ancient <strong>Latin texts & star charts</strong> while charging <strong>High diagnostic fees</strong> without performing surgery."
    },
    {
      step: 2,
      title: "Guild Apothecaries & Spicers",
      heading: "How did apothecaries provide affordable urban remedies?",
      bullets: ["Apothecary guild trade", "Herbal preparations sold", "Cheaper urban access"],
      model: "Ordinary townspeople turned to the <strong>Apothecary guild trade</strong>, where retail shopfronts and <strong>Herbal preparations sold</strong> provided far <strong>Cheaper urban access</strong> to medical care."
    },
    {
      step: 3,
      title: "Barber-Surgeons & Wound Care",
      heading: "What manual procedures did barber-surgeons carry out?",
      bullets: ["Barber-surgeon guild", "Bloodletting & tooth pulling", "Cauterisation & amputation"],
      model: "Manual operations fell to the <strong>Barber-surgeon guild</strong>, who conducted routine <strong>Bloodletting & tooth pulling</strong> as well as traumatic <strong>Cauterisation & amputation</strong> without anaesthetics."
    },
    {
      step: 4,
      title: "Monastic Hospitals: Care Not Cure",
      heading: "Why did medieval hospitals prioritize spiritual comfort over healing?",
      bullets: ["Monastic charity hospitals", "Care not cure philosophy", "Bed rest & prayer"],
      model: "Run by nuns and monks, <strong>Monastic charity hospitals</strong> operated under a strict <strong>Care not cure philosophy</strong>, offering poor pilgrims shelter, warm broth, <strong>Bed rest & prayer</strong>."
    },
    {
      step: 5,
      title: "Women Healers & Household Care",
      heading: "What vital medical role did women play in local villages?",
      bullets: ["Domestic women healers", "Local herb gardening", "Midwifery & home care"],
      model: "The vast majority of everyday treatment was delivered by <strong>Domestic women healers</strong>, who practiced <strong>Local herb gardening</strong> to provide village <strong>Midwifery & home care</strong>."
    }
  ],
  "lesson_1_5": [
    {
      step: 1,
      title: "Arrival of the Pestilence at Melcombe Regis",
      heading: "How did the Black Death reach England in 1348?",
      bullets: ["Melcombe Regis port (1348)", "Yersinia pestis bacteria", "Black rats & fleas"],
      model: "The Black Death arrived at <strong>Melcombe Regis port (1348)</strong> carrying deadly <strong>Yersinia pestis bacteria</strong> concealed on merchant trade ships inside <strong>Black rats & fleas</strong>."
    },
    {
      step: 2,
      title: "Buboes & Pneumonic Terror",
      heading: "What symptoms made the Black Death so terrifyingly lethal?",
      bullets: ["Bubonic groin swellings (buboes)", "Pneumonic bloody coughing", "Mortality in three days"],
      model: "Victims developed agonizing <strong>Bubonic groin swellings (buboes)</strong> or suffered <strong>Pneumonic bloody coughing</strong>, leading to rapid <strong>Mortality in three days</strong>."
    },
    {
      step: 3,
      title: "Desperate Treatments & Strapped Chickens",
      heading: "Why were medieval cures powerless against the plague?",
      bullets: ["Divine wrath & miasma", "Lancing buboes & live hens", "Bleeding & crushed emeralds"],
      model: "Because people attributed the plague to <strong>Divine wrath & miasma</strong>, desperate treatments ranged from <strong>Lancing buboes & live hens</strong> to desperate <strong>Bleeding & crushed emeralds</strong>."
    },
    {
      step: 4,
      title: "King Edward III’s Cleanliness Order",
      heading: "How did town authorities attempt to halt the spread of contagion?",
      bullets: ["Quarantine isolation rules", "Cleaning town butchery waste", "Street fire smoke barriers"],
      model: "Authorities attempted crisis prevention through <strong>Quarantine isolation rules</strong>, ordering the <strong>Cleaning town butchery waste</strong> and lighting pungent <strong>Street fire smoke barriers</strong>."
    },
    {
      step: 5,
      title: "Mass Burial Pits & Demographic Collapse",
      heading: "How did the Black Death transform medieval English society?",
      bullets: ["Mass burial trenches", "Third to half population lost", "Labour shortage & wage rises"],
      model: "Churchyards overflowed into emergency <strong>Mass burial trenches</strong> as a <strong>Third to half population lost</strong> caused severe <strong>Labour shortage & wage rises</strong> across England."
    }
  ],

  // ==========================================
  // KEY TOPIC 2: RENAISSANCE ENGLAND (c1500–c1700)
  // ==========================================
  "lesson_2_1": [
    {
      step: 1,
      title: "The Printing Press & Information Revolution",
      heading: "How did movable type break the Church's monopoly on learning?",
      bullets: ["Gutenberg printing press", "Movable metal type", "Rapid book mass-production"],
      model: "Invented around 1440, the <strong>Gutenberg printing press</strong> utilized <strong>Movable metal type</strong> to enable <strong>Rapid book mass-production</strong>, stripping the Church of its monopoly on medical texts."
    },
    {
      step: 2,
      title: "Renaissance Humanism & Ancient Texts",
      heading: "How did Humanism challenge medieval Galenic dogma?",
      bullets: ["Humanism scholarly inquiry", "Original Greek translations", "Challenging Galenic dogma"],
      model: "The rise of <strong>Humanism scholarly inquiry</strong> led scholars to rediscover <strong>Original Greek translations</strong>, inspiring medical pioneers into <strong>Challenging Galenic dogma</strong> through direct observation."
    },
    {
      step: 3,
      title: "Foundation of the Royal Society",
      heading: "Why was the Royal Society's motto 'Nullius in Verba' so revolutionary?",
      bullets: ["Royal Society founded (1660)", "Royal charter Charles II", "'Nullius in Verba' motto"],
      model: "When the <strong>Royal Society founded (1660)</strong> secured its <strong>Royal charter Charles II</strong>, it adopted the famous <strong>'Nullius in Verba' motto</strong> ('take nobody's word for it') to champion empirical experiment."
    },
    {
      step: 4,
      title: "Philosophical Transactions & Peer Review",
      heading: "How did scientific journals accelerate medical collaboration?",
      bullets: ["Philosophical Transactions (1665)", "Scientific paper peer-sharing", "Empirical laboratory debates"],
      model: "Through the launch of <strong>Philosophical Transactions (1665)</strong>, scientists established international <strong>Scientific paper peer-sharing</strong> to encourage rigorous <strong>Empirical laboratory debates</strong>."
    },
    {
      step: 5,
      title: "Early Microscopes & Animalcules",
      heading: "How did optical technology reveal microscopic biological structures?",
      bullets: ["Compound light microscopes", "Robert Hooke Micrographia", "Leeuwenhoek 'animalcules'"],
      model: "Technological breakthroughs in <strong>Compound light microscopes</strong> enabled <strong>Robert Hooke Micrographia</strong> and Antonie van <strong>Leeuwenhoek 'animalcules'</strong>, proving invisible organisms existed."
    }
  ],
  "lesson_2_2": [
    {
      step: 1,
      title: "Thomas Sydenham & Bedside Observation",
      heading: "Why was Sydenham called the 'English Hippocrates'?",
      bullets: ["Thomas Sydenham bedside", "Close clinical observation", "Detailed symptom logging"],
      model: "Known as the 'English Hippocrates', <strong>Thomas Sydenham bedside</strong> practice emphasized <strong>Close clinical observation</strong> and <strong>Detailed symptom logging</strong> rather than relying on ancient Galenic books."
    },
    {
      step: 2,
      title: "Observationes Medicae & Disease Classification",
      heading: "How did Sydenham classify diseases as separate species?",
      bullets: ["Medical botany taxonomy", "Differential disease diagnosis", "Observationes Medicae (1676)"],
      model: "Classifying illnesses like plants through <strong>Medical botany taxonomy</strong>, Sydenham advanced <strong>Differential disease diagnosis</strong> in his landmark treatise <strong>Observationes Medicae (1676)</strong>."
    },
    {
      step: 3,
      title: "Quinine & Cinchona Bark for Malaria",
      heading: "How did specific remedies challenge humoral balance?",
      bullets: ["Cinchona bark (quinine)", "Specific cures ague", "Challenging humour balance"],
      model: "By demonstrating that imported <strong>Cinchona bark (quinine)</strong> acted as a <strong>Specific cures ague</strong>, Sydenham succeeded in directly <strong>Challenging humour balance</strong> theory."
    },
    {
      step: 4,
      title: "Cool Therapy for Smallpox Fevers",
      heading: "Why did Sydenham reject traditional heating treatments?",
      bullets: ["Cool therapy treatment", "Fresh bedroom ventilation", "Avoiding heavy blankets"],
      model: "Sydenham overturned traditional heating cures by prescribing <strong>Cool therapy treatment</strong>, insisting on <strong>Fresh bedroom ventilation</strong> and strictly <strong>Avoiding heavy blankets</strong> for smallpox fevers."
    },
    {
      step: 5,
      title: "Conservative Resistance & Continuing Continuity",
      heading: "Why were Sydenham's ideas slow to change everyday medical practice?",
      bullets: ["Conservative medical opposition", "Continued purging reliance", "Slow professional shift"],
      model: "Despite his clinical successes, widespread <strong>Conservative medical opposition</strong> and a <strong>Continued purging reliance</strong> meant that Sydenham's bedside method caused only a <strong>Slow professional shift</strong>."
    }
  ],
  "lesson_2_3": [
    {
      step: 1,
      title: "Andreas Vesalius & Padua Anatomical Dissections",
      heading: "How did Vesalius challenge Galen's anatomical authority?",
      bullets: ["Padua dissection theatre", "Direct personal dissection", "Challenging Galen's 300 errors"],
      model: "Working in his famous <strong>Padua dissection theatre</strong>, Vesalius insisted on <strong>Direct personal dissection</strong> of human corpses, famously <strong>Challenging Galen's 300 errors</strong>."
    },
    {
      step: 2,
      title: "Publication of De Humani Corporis Fabrica (1543)",
      heading: "Why was De Humani Corporis Fabrica an international masterpiece?",
      bullets: ["De Humani Corporis Fabrica", "Johannes Oporinus Basel printing", "Titian studio woodcut plates"],
      model: "In 1543, Vesalius published <strong>De Humani Corporis Fabrica</strong>, working with <strong>Johannes Oporinus Basel printing</strong> and dynamic <strong>Titian studio woodcut plates</strong> to set a new visual standard."
    },
    {
      step: 3,
      title: "Key Corrected Errors: Jawbone, Septum & Sternum",
      heading: "What specific anatomical mistakes did Vesalius correct?",
      bullets: ["Human jawbone single bone", "Missing heart septum pores", "Sternum three segments"],
      model: "Vesalius proved the <strong>Human jawbone single bone</strong>, demonstrated the <strong>Missing heart septum pores</strong>, and verified that the human <strong>Sternum three segments</strong> rather than seven."
    },
    {
      step: 4,
      title: "Backlash from Galenists & Resignation from Padua",
      heading: "Why did traditional professors reject Vesalius's discoveries?",
      bullets: ["Vicious traditional backlash", "Sylvius Galenic loyalty", "Resignation from Padua"],
      model: "Vesalius faced <strong>Vicious traditional backlash</strong> from established professors like <strong>Sylvius Galenic loyalty</strong>, eventually forcing his bitter <strong>Resignation from Padua</strong>."
    },
    {
      step: 5,
      title: "Long-Term Impact on Surgery & Barber-Surgeon Training",
      heading: "How did Vesalius's work transform English surgery?",
      bullets: ["Thomas Geminus Compendiosa", "English barber-surgeon training", "Anatomical dissection foundation"],
      model: "Through <strong>Thomas Geminus Compendiosa</strong>, Vesalius's illustrations revolutionized <strong>English barber-surgeon training</strong> and laid the permanent <strong>Anatomical dissection foundation</strong> for surgery."
    }
  ],
  "lesson_2_4": [
    {
      step: 1,
      title: "William Harvey & Venous Valves",
      heading: "How did Fabricius's valves inspire Harvey's research on blood?",
      bullets: ["Girolamo Fabricius valves", "One-way blood flow", "Cold frog dissections"],
      model: "Studying under Fabricius, Harvey investigated <strong>Girolamo Fabricius valves</strong>, conducting <strong>Cold frog dissections</strong> to observe the heart and establish <strong>One-way blood flow</strong>."
    },
    {
      step: 2,
      title: "The Mechanical Pump & Mathematical Proof",
      heading: "How did calculations prove that blood circulates continuously?",
      bullets: ["Circulation mathematical proof", "Heart mechanical pump", "Galenic liver theory refuted"],
      model: "By calculating blood volume in a brilliant <strong>Circulation mathematical proof</strong>, Harvey proved the <strong>Heart mechanical pump</strong>, leaving <strong>Galenic liver theory refuted</strong>."
    },
    {
      step: 3,
      title: "Publication of De Motu Cordis (1628)",
      heading: "How did the forearm ligature experiment prove circulation?",
      bullets: ["De Motu Cordis (1628)", "Forearm tight-ligature test", "Venous valve demonstration"],
      model: "Harvey published his findings in <strong>De Motu Cordis (1628)</strong>, using his famous <strong>Forearm tight-ligature test</strong> as a visual <strong>Venous valve demonstration</strong>."
    },
    {
      step: 4,
      title: "Opposition from 'Galenists' & Professional Skepticism",
      heading: "Why did physicians mock Harvey's circulatory theory?",
      bullets: ["Conservative medical opposition", "Losing private clients", "Slow university adoption"],
      model: "Harvey met fierce <strong>Conservative medical opposition</strong> from established doctors, temporarily <strong>Losing private clients</strong> and facing a very <strong>Slow university adoption</strong> across Europe."
    },
    {
      step: 5,
      title: "Marcello Malpighi Confirms Capillaries (1661)",
      heading: "How did the microscope provide the final missing link in circulation?",
      bullets: ["Marcello Malpighi (1661)", "Microscopic capillary vessels", "Circulatory proof complete"],
      model: "Four years after Harvey died, <strong>Marcello Malpighi (1661)</strong> used early microscopes to discover <strong>Microscopic capillary vessels</strong>, rendering the <strong>Circulatory proof complete</strong>."
    }
  ],
  "lesson_2_5": [
    {
      step: 1,
      title: "Outbreak in St Giles & Flight of the Wealthy",
      heading: "How did the Great Plague of 1665 impact London?",
      bullets: ["Great Plague (1665)", "Charles II court flight", "St Giles parish outbreak"],
      model: "The devastating <strong>Great Plague (1665)</strong> began with a suburban <strong>St Giles parish outbreak</strong> before spreading rapidly, triggering the hasty <strong>Charles II court flight</strong> into the countryside."
    },
    {
      step: 2,
      title: "Continuity of Supernatural & Humoral Treatments",
      heading: "Why did treatments in 1665 mirror those of the 1348 Black Death?",
      bullets: ["Wrath of God & miasma", "Plague water & pomanders", "Pigeon bubo remedies"],
      model: "Treatments remained rooted in beliefs about the <strong>Wrath of God & miasma</strong>, as Londoners relied on <strong>Plague water & pomanders</strong> alongside bizarre plucked <strong>Pigeon bubo remedies</strong>."
    },
    {
      step: 3,
      title: "Lord Mayor's Orders: Red Crosses & Watchmen",
      heading: "How did government quarantine attempt to halt transmission?",
      bullets: ["Mayor quarantine orders", "Red cross marked doors", "Parish pest houses"],
      model: "The city enforced strict <strong>Mayor quarantine orders</strong>, locking families inside homes behind <strong>Red cross marked doors</strong> and confining infectious paupers to isolated <strong>Parish pest houses</strong>."
    },
    {
      step: 4,
      title: "Culling Animals & Smoking Fires",
      heading: "Why were street fires and culling pets ineffective countermeasures?",
      bullets: ["Culling dogs & cats", "Street barrel fires", "Tobacco smoke warding"],
      model: "Mayoral edicts mistakenly ordered the <strong>Culling dogs & cats</strong>, while wardens lit smoking <strong>Street barrel fires</strong> and encouraged <strong>Tobacco smoke warding</strong> against foul vapours."
    },
    {
      step: 5,
      title: "The Dead Carts & East Smithfield Pits",
      heading: "What was the devastating demographic toll of the 1665 plague?",
      bullets: ["London dead carts", "100,000 plague deaths", "Bills of Mortality records"],
      model: "Rattling through deserted streets, <strong>London dead carts</strong> collected corpses as over <strong>100,000 plague deaths</strong> were grimly documented in weekly <strong>Bills of Mortality records</strong>."
    }
  ],

  // ==========================================
  // KEY TOPIC 3: 18th & 19th CENTURY (c1700–c1900)
  // ==========================================
  "lesson_3_1": [
    {
      step: 1,
      title: "Spontaneous Generation & Miasma Orthodoxy",
      heading: "What did scientists believe caused disease before Germ Theory?",
      bullets: ["Spontaneous generation theory", "Miasma stench blamed", "Pre-bacteriology limits"],
      model: "Before the 1860s, orthodox science upheld <strong>Spontaneous generation theory</strong> and <strong>Miasma stench blamed</strong> for epidemics, highlighting the severe <strong>Pre-bacteriology limits</strong> of medicine."
    },
    {
      step: 2,
      title: "Louis Pasteur's Swan-Neck Flask Experiments",
      heading: "How did Pasteur prove that microbes cause decay?",
      bullets: ["Louis Pasteur (1861)", "Swan-neck flask test", "Airborne microbes proved"],
      model: "In 1861, French chemist <strong>Louis Pasteur (1861)</strong> conducted his famous <strong>Swan-neck flask test</strong>, through which <strong>Airborne microbes proved</strong> that decaying matter did not generate life."
    },
    {
      step: 3,
      title: "British Medical Scepticism & John Tyndall",
      heading: "Why did British doctors resist Pasteur's Germ Theory?",
      bullets: ["British medical scepticism", "John Tyndall experiments", "Charlton Bastian opposition"],
      model: "Pasteur encountered persistent <strong>British medical scepticism</strong> led by <strong>Charlton Bastian opposition</strong>, until physicist <strong>John Tyndall experiments</strong> helped vindicate germ theory."
    },
    {
      step: 4,
      title: "Robert Koch & Staining Specific Microbes",
      heading: "How did Koch identify specific bacterial culprits?",
      bullets: ["Robert Koch bacteriology", "Agar jelly plates", "Methyl violet stains"],
      model: "In Germany, <strong>Robert Koch bacteriology</strong> revolutionized diagnosis by culturing microbes on solid <strong>Agar jelly plates</strong> and staining bacteria with visible <strong>Methyl violet stains</strong>."
    },
    {
      step: 5,
      title: "Discovery of Tuberculosis & Cholera Bacteria",
      heading: "Why was isolating tuberculosis and cholera microbes so vital?",
      bullets: ["Tuberculosis bacteria (1882)", "Cholera microbe (1883)", "High-resolution microphotography"],
      model: "Koch identified the deadly <strong>Tuberculosis bacteria (1882)</strong> and the <strong>Cholera microbe (1883)</strong>, publishing definitive proof using <strong>High-resolution microphotography</strong>."
    }
  ],
  "lesson_3_2": [
    {
      step: 1,
      title: "Smallpox Variolation & Suttonian Inoculation",
      heading: "How did 18th-century doctors attempt to prevent smallpox?",
      bullets: ["Smallpox variolation inoculation", "Suttonian method fees", "Infection risk remains"],
      model: "Throughout the 1700s, doctors practiced <strong>Smallpox variolation inoculation</strong> and charged lucrative <strong>Suttonian method fees</strong>, even though a deadly <strong>Infection risk remains</strong>."
    },
    {
      step: 2,
      title: "Edward Jenner & The James Phipps Vaccination",
      heading: "How did Jenner discover that cowpox protects against smallpox?",
      bullets: ["Edward Jenner (1796)", "James Phipps vaccination", "Cowpox blister pus"],
      model: "In 1796, country doctor <strong>Edward Jenner (1796)</strong> performed the historic <strong>James Phipps vaccination</strong> by deliberately inoculating the boy with harmless <strong>Cowpox blister pus</strong>."
    },
    {
      step: 3,
      title: "Skepticism from the Royal Society & Caricaturists",
      heading: "Why was Jenner's vaccine opposed by doctors and the public?",
      bullets: ["Royal Society scepticism", "Anti-vaccine cartoon satire", "Cowpox contamination fears"],
      model: "Jenner encountered fierce <strong>Royal Society scepticism</strong> and popular <strong>Anti-vaccine cartoon satire</strong>, as critics stoked hysterical <strong>Cowpox contamination fears</strong>."
    },
    {
      step: 4,
      title: "Parliamentary Grants & The 1840 Vaccination Act",
      heading: "How did the British government support Jenner's vaccine?",
      bullets: ["Parliamentary grants (£30,000)", "1840 Vaccination Act", "Inoculation banned legally"],
      model: "Convinced by Jenner's evidence, Parliament awarded <strong>Parliamentary grants (£30,000)</strong>, passed the <strong>1840 Vaccination Act</strong>, and ensured dangerous variolation <strong>Inoculation banned legally</strong>."
    },
    {
      step: 5,
      title: "Compulsory Vaccination & Global Eradication",
      heading: "Why did smallpox vaccination become mandatory in Britain?",
      bullets: ["Compulsory Vaccination (1853)", "1871 Enforcement Act", "Dramatic smallpox eradication"],
      model: "The passage of the <strong>Compulsory Vaccination (1853)</strong> and the <strong>1871 Enforcement Act</strong> successfully curbed epidemics, leading to the <strong>Dramatic smallpox eradication</strong>."
    }
  ],
  "lesson_3_3": [
    {
      step: 1,
      title: "Hospital Squalor & The 'Betsy Prig' Reputation",
      heading: "Why were early 19th-century hospitals known as death traps?",
      bullets: ["Pauper hospital squalor", "Untrained nurse reputation", "Cross-infection septic wards"],
      model: "Early Victorian healthcare suffered from <strong>Pauper hospital squalor</strong> and a notorious <strong>Untrained nurse reputation</strong>, which produced lethal <strong>Cross-infection septic wards</strong>."
    },
    {
      step: 2,
      title: "Florence Nightingale at Scutari Hospital (1854)",
      heading: "How did Nightingale reduce the mortality rate in the Crimea?",
      bullets: ["Crimean War (1854)", "Scutari hospital sanitation", "Death rate plummeted (42% to 2%)"],
      model: "Sent to the <strong>Crimean War (1854)</strong>, Florence Nightingale enforced rigorous <strong>Scutari hospital sanitation</strong>, ensuring the soldier <strong>Death rate plummeted (42% to 2%)</strong>."
    },
    {
      step: 3,
      title: "Notes on Nursing & Statistical Reforms",
      heading: "How did Nightingale use statistics to reform hospital design?",
      bullets: ["Notes on Nursing (1859)", "Sanitary statistical charts", "Pavilion hospital architecture"],
      model: "Returning to Britain, Nightingale published <strong>Notes on Nursing (1859)</strong>, using pioneering <strong>Sanitary statistical charts</strong> to advocate modern <strong>Pavilion hospital architecture</strong>."
    },
    {
      step: 4,
      title: "The Pavilion Plan Hospital Design",
      heading: "What architectural features made pavilion hospitals sanitary?",
      bullets: ["Separate pavilion wards", "Cross-ventilation high windows", "Tiled washable surfaces"],
      model: "The pavilion design featured <strong>Separate pavilion wards</strong> with <strong>Cross-ventilation high windows</strong> and easily sanitized, <strong>Tiled washable surfaces</strong> to prevent airborne contagion."
    },
    {
      step: 5,
      title: "St Thomas' School & Professional Matrons",
      heading: "How did Nightingale establish nursing as a respected profession?",
      bullets: ["St Thomas' Training School", "Nightingale Fund (£44,000)", "Professional disciplined matrons"],
      model: "Financed by the <strong>Nightingale Fund (£44,000)</strong>, Nightingale founded <strong>St Thomas' Training School</strong>, elevating nursing into an elite career led by <strong>Professional disciplined matrons</strong>."
    }
  ],
  "lesson_3_4": [
    {
      step: 1,
      title: "Speed Surgery, Shock & Early Inhaled Gases",
      heading: "Why was pre-anaesthetic surgery limited by pain and shock?",
      bullets: ["Speed-focused surgery pain", "Surgical shock mortality", "Ether & nitrous oxide"],
      model: "Early surgery was characterized by agonizing <strong>Speed-focused surgery pain</strong> and fatal <strong>Surgical shock mortality</strong>, despite primitive trials with <strong>Ether & nitrous oxide</strong>."
    },
    {
      step: 2,
      title: "James Simpson & The Discovery of Chloroform",
      heading: "How did James Simpson discover chloroform anaesthesia in 1847?",
      bullets: ["James Simpson (1847)", "Chloroform anaesthetic vapour", "Queen Victoria childbirth (1853)"],
      model: "In 1847, Edinburgh surgeon <strong>James Simpson (1847)</strong> discovered the power of <strong>Chloroform anaesthetic vapour</strong>, which gained national acceptance after <strong>Queen Victoria childbirth (1853)</strong>."
    },
    {
      step: 3,
      title: "The 'Black Period' of Surgery & High Infection",
      heading: "Why did death rates rise immediately after anaesthetics were introduced?",
      bullets: ["'Black Period' surgery", "Deeper invasive operations", "Hospital gangrene surge"],
      model: "Anaesthesia initially led to the dangerous <strong>'Black Period' surgery</strong>, as surgeons attempted <strong>Deeper invasive operations</strong> without antisepsis, causing a lethal <strong>Hospital gangrene surge</strong>."
    },
    {
      step: 4,
      title: "Joseph Lister & Carbolic Acid Spray",
      heading: "How did Joseph Lister apply Germ Theory to wound infection?",
      bullets: ["Joseph Lister (1865)", "Carbolic acid spray", "Compound fracture antisepsis"],
      model: "Inspired by Pasteur's germ theory, <strong>Joseph Lister (1865)</strong> applied a diluted <strong>Carbolic acid spray</strong> to achieve dramatic <strong>Compound fracture antisepsis</strong> without infection."
    },
    {
      step: 5,
      title: "From Antiseptic to Aseptic Operating Theatres",
      heading: "How did surgeons create completely germ-free operating environments?",
      bullets: ["Aseptic surgical theatre", "Autoclave steam sterilisation", "Sterile gloves & masks"],
      model: "Antiseptic techniques soon evolved into the modern <strong>Aseptic surgical theatre</strong>, relying on <strong>Autoclave steam sterilisation</strong> alongside mandatory <strong>Sterile gloves & masks</strong>."
    }
  ],
  "lesson_3_5": [
    {
      step: 1,
      title: "Cholera Epidemics & Laissez-Faire Inaction",
      heading: "Why was early Victorian government reluctant to intervene in public health?",
      bullets: ["Cholera epidemics (1831–1854)", "Laissez-faire government policy", "Permissive 1848 Health Act"],
      model: "Devastating <strong>Cholera epidemics (1831–1854)</strong> met with stubborn <strong>Laissez-faire government policy</strong>, as clean water remained optional under the weak, <strong>Permissive 1848 Health Act</strong>."
    },
    {
      step: 2,
      title: "John Snow & The Broad Street Pump Handle",
      heading: "How did Dr John Snow prove cholera was waterborne in 1854?",
      bullets: ["John Snow Soho (1854)", "Broad Street spot map", "Pump handle removed"],
      model: "Investigating the 1854 Soho outbreak, <strong>John Snow Soho (1854)</strong> plotted deaths on his <strong>Broad Street spot map</strong>, ending the local epidemic after the <strong>Pump handle removed</strong>."
    },
    {
      step: 3,
      title: "Water Company Comparison & Statistical Proof",
      heading: "How did water supply statistics confirm Snow's theory?",
      bullets: ["Water company comparison", "Southwark vs Lambeth", "Waterborne transmission proved"],
      model: "Snow's statistical <strong>Water company comparison</strong> between contaminated <strong>Southwark vs Lambeth</strong> water customers conclusively delivered <strong>Waterborne transmission proved</strong>."
    },
    {
      step: 4,
      title: "The Great Stink & Bazalgette's London Sewers",
      heading: "How did the Great Stink of 1858 force government action?",
      bullets: ["Great Stink (1858)", "Joseph Bazalgette sewers", "Underground London interceptors"],
      model: "When the sweltering <strong>Great Stink (1858)</strong> overwhelmed Parliament, politicians funded engineer <strong>Joseph Bazalgette sewers</strong>, constructing vast <strong>Underground London interceptors</strong>."
    },
    {
      step: 5,
      title: "The 1875 Public Health Act & End of Laissez-Faire",
      heading: "Why did the 1875 Public Health Act mark a turning point in state policy?",
      bullets: ["1875 Public Health Act", "Compulsory town sewers", "End of laissez-faire"],
      model: "The landmark <strong>1875 Public Health Act</strong> forced local councils to install <strong>Compulsory town sewers</strong>, marking the permanent <strong>End of laissez-faire</strong> public health in Britain."
    }
  ],

  // ==========================================
  // KEY TOPIC 4: MODERN MEDICINE (c1900–present)
  // ==========================================
  "lesson_4_1": [
    {
      step: 1,
      title: "Mendel & Early Genetics",
      heading: "Why did early doctors struggle to explain hereditary traits?",
      bullets: ["Gregor Mendel genetics", "Chromosomes observed", "Unknown hereditary mechanism"],
      model: "Although <strong>Gregor Mendel genetics</strong> and microscopic research ensured <strong>Chromosomes observed</strong> in cell nuclei, doctors struggled because the <strong>Unknown hereditary mechanism</strong> was overlooked."
    },
    {
      step: 2,
      title: "Franklin & Photograph 51",
      heading: "How did Photograph 51 prove DNA’s helical structure?",
      bullets: ["Rosalind Franklin", "X-ray crystallography", "Photograph 51 (1952)"],
      model: "At King's College London, physical chemist <strong>Rosalind Franklin</strong> used specialized <strong>X-ray crystallography</strong> to capture the historic <strong>Photograph 51 (1952)</strong> showing an X-shaped diffraction pattern."
    },
    {
      step: 3,
      title: "Watson & Crick’s Model",
      heading: "How did base pairing explain hereditary replication?",
      bullets: ["Watson & Crick model", "Double helix structure", "DNA base pairing"],
      model: "Using Franklin's data, the Cambridge <strong>Watson & Crick model</strong> unlocked the <strong>Double helix structure</strong>, demonstrating how chemical <strong>DNA base pairing</strong> enables genetic replication."
    },
    {
      step: 4,
      title: "Human Genome Project",
      heading: "Why was mapping 3 billion base pairs a medical milestone?",
      bullets: ["Human Genome Project", "Mapped 3bn base pairs", "International teamwork"],
      model: "Launched in 1990, the global <strong>Human Genome Project</strong> relied on <strong>International teamwork</strong> across six nations, successfully having <strong>Mapped 3bn base pairs</strong> of human DNA by 2003."
    },
    {
      step: 5,
      title: "Screening & Treatment Gap",
      heading: "Why did understanding causes outpace finding cures?",
      bullets: ["Genetic screening", "BRCA1/2 gene testing", "Gene therapy lag"],
      model: "Mapping human DNA transformed preventive <strong>Genetic screening</strong> through targeted <strong>BRCA1/2 gene testing</strong>, even though effective clinical <strong>Gene therapy lag</strong> remained a persistent challenge."
    }
  ],
  "lesson_4_2": [
    {
      step: 1,
      title: "Röntgen & Early X-Rays",
      heading: "How did X-rays transform surgical trauma diagnosis in WWI?",
      bullets: ["Wilhelm Röntgen (1895)", "Marie Curie mobile vans", "Shrapnel detection"],
      model: "The 1895 discovery of X-rays by <strong>Wilhelm Röntgen (1895)</strong> was mobilized on the Western Front via <strong>Marie Curie mobile vans</strong> to allow accurate, non-invasive <strong>Shrapnel detection</strong>."
    },
    {
      step: 2,
      title: "Blood Labs & Endoscopy",
      heading: "Why was fiber-optic endoscopy superior to exploratory surgery?",
      bullets: ["Blood tests & typing", "Centrifuges & biopsy", "Fiber-optic endoscopes"],
      model: "Modern diagnostic clinics adopted routine <strong>Blood tests & typing</strong> and laboratory <strong>Centrifuges & biopsy</strong> alongside flexible <strong>Fiber-optic endoscopes</strong> to inspect internal organs safely."
    },
    {
      step: 3,
      title: "Hounsfield’s CT & MRI",
      heading: "Why did CT scans transform internal soft-tissue diagnosis?",
      bullets: ["Godfrey Hounsfield (1971)", "EMI CT body scanning", "MRI magnetic imaging"],
      model: "British engineer <strong>Godfrey Hounsfield (1971)</strong> invented 3D <strong>EMI CT body scanning</strong>, which was soon complemented by radiation-free <strong>MRI magnetic imaging</strong> to pinpoint brain tumours."
    },
    {
      step: 4,
      title: "Epidemiological Shift",
      heading: "What drove the shift from infectious to lifestyle diseases?",
      bullets: ["Antibiotics curb fevers", "Higher life expectancy", "Cancers & heart disease"],
      model: "Because post-war <strong>Antibiotics curb fevers</strong> and delivered a <strong>Higher life expectancy</strong>, modern Britain experienced an epidemiological shift toward chronic <strong>Cancers & heart disease</strong>."
    },
    {
      step: 5,
      title: "State Lifestyle Campaigns",
      heading: "How has government public health shifted to behavioural prevention?",
      bullets: ["1983 Seatbelt legislation", "2007 Public smoking ban", "Sugar tax & Change4Life"],
      model: "Government preventative health shifted to lifestyle legislation, progressing from the <strong>1983 Seatbelt legislation</strong> to the landmark <strong>2007 Public smoking ban</strong> and the <strong>Sugar tax & Change4Life</strong> campaigns."
    }
  ],
  "lesson_4_3": [
    {
      step: 1,
      title: "Paul Ehrlich & Salvarsan 606",
      heading: "How did Paul Ehrlich discover the first 'magic bullet' for syphilis?",
      bullets: ["Paul Ehrlich research", "Magic bullet concept", "Salvarsan 606 (1909)"],
      model: "German scientist <strong>Paul Ehrlich research</strong> pioneered the chemical <strong>Magic bullet concept</strong>, discovering that arsenic compound <strong>Salvarsan 606 (1909)</strong> targeted syphilis without poisoning patients."
    },
    {
      step: 2,
      title: "Gerhard Domagk & Prontosil (1932)",
      heading: "How did Prontosil red dye launch the sulfa drug revolution?",
      bullets: ["Gerhard Domagk (1932)", "Prontosil red dye", "Sulfa drug revolution"],
      model: "In 1932, <strong>Gerhard Domagk (1932)</strong> discovered that <strong>Prontosil red dye</strong> cured lethal streptococcal infections in mice, launching the multi-purpose <strong>Sulfa drug revolution</strong>."
    },
    {
      step: 3,
      title: "The Beveridge Report & Welfare Blueprint (1942)",
      heading: "How did the Beveridge Report plan post-war healthcare reform?",
      bullets: ["1942 Beveridge Report", "Five Giant Evils", "Post-war welfare state"],
      model: "During wartime bombing, the <strong>1942 Beveridge Report</strong> vowed to defeat the <strong>Five Giant Evils</strong> (including Disease and Want), creating the blueprint for Britain's <strong>Post-war welfare state</strong>."
    },
    {
      step: 4,
      title: "Aneurin Bevan & The Launch of the NHS (1948)",
      heading: "How did Aneurin Bevan overcome BMA doctor opposition to create the NHS?",
      bullets: ["Aneurin Bevan (1948)", "BMA doctor compromise", "Free universal healthcare"],
      model: "Health Minister <strong>Aneurin Bevan (1948)</strong> secured a pragmatic <strong>BMA doctor compromise</strong> to successfully launch the NHS and guarantee <strong>Free universal healthcare</strong> for all citizens."
    },
    {
      step: 5,
      title: "High-Tech Care & Financial Pressures",
      heading: "Why did advanced medical treatments strain the NHS budget?",
      bullets: ["Kidney dialysis units", "Hip replacement surgery", "Rising NHS cost pressures"],
      model: "Technological breakthroughs like artificial <strong>Kidney dialysis units</strong> and routine <strong>Hip replacement surgery</strong> vastly improved quality of life while triggering <strong>Rising NHS cost pressures</strong>."
    }
  ],
  "lesson_4_4": [
    {
      step: 1,
      title: "Fleming & The Staph Halo (1928)",
      heading: "How did Alexander Fleming accidentally discover penicillin in 1928?",
      bullets: ["Alexander Fleming (1928)", "Penicillium notatum mould", "Staphylococcus halo"],
      model: "In 1928, Scottish bacteriologist <strong>Alexander Fleming (1928)</strong> returned from holiday to discover stray <strong>Penicillium notatum mould</strong> creating a bacteria-free <strong>Staphylococcus halo</strong> on a Petri dish."
    },
    {
      step: 2,
      title: "Florey & Chain at Oxford",
      heading: "How did Florey and Chain overcome the challenge of purifying penicillin?",
      bullets: ["Florey & Chain (Oxford)", "Purifying active penicillin", "Norman Heatley apparatus"],
      model: "A decade later, Oxford researchers <strong>Florey & Chain (Oxford)</strong> overcame financial shortages in <strong>Purifying active penicillin</strong> by building homemade <strong>Norman Heatley apparatus</strong> out of hospital bedpans."
    },
    {
      step: 3,
      title: "Mice Trials & Albert Alexander",
      heading: "Why was Alexander’s trial both a success and a tragedy?",
      bullets: ["1940 Lethal mice trial", "Albert Alexander (1941)", "Supply exhaustion death"],
      model: "Following a triumphant <strong>1940 Lethal mice trial</strong>, doctors treated policeman <strong>Albert Alexander (1941)</strong>, but tragic <strong>Supply exhaustion death</strong> proved mass manufacture was urgently required."
    },
    {
      step: 4,
      title: "US Government & Mass Production",
      heading: "How did US industrial mass-production transform wartime supply?",
      bullets: ["US government funding", "Deep fermentation tanks", "2.3m D-Day doses"],
      model: "Wartime industrial intervention via <strong>US government funding</strong> pioneered industrial <strong>Deep fermentation tanks</strong>, successfully producing over <strong>2.3m D-Day doses</strong> to save Allied wounded."
    },
    {
      step: 5,
      title: "D-Day & Superbugs",
      heading: "Why did Fleming warn that antibiotic overuse causes resistance?",
      bullets: ["Allied troop survival", "1945 Nobel Prize", "MRSA superbug threat"],
      model: "While penicillin transformed <strong>Allied troop survival</strong> and earned Fleming, Florey and Chain the <strong>1945 Nobel Prize</strong>, modern overuse has unleashed the dangerous <strong>MRSA superbug threat</strong>."
    }
  ],
  "lesson_4_5": [
    {
      step: 1,
      title: "The Diagnostic Challenge",
      heading: "Why is early lung cancer so difficult to detect?",
      bullets: ["Few pain receptors", "Asymptomatic growth", "Late Stage 3/4 detection"],
      model: "Because human lungs possess <strong>Few pain receptors</strong>, malignant tumours expand through silent <strong>Asymptomatic growth</strong>, resulting in dangerous <strong>Late Stage 3/4 detection</strong>."
    },
    {
      step: 2,
      title: "High-Tech Diagnostic Scans",
      heading: "How do CT and PET scans improve cancer detection?",
      bullets: ["High-resolution CT scans", "PET-CT tracer imaging", "Bronchoscopy & biopsy"],
      model: "Modern diagnostic oncology deploys <strong>High-resolution CT scans</strong> and functional <strong>PET-CT tracer imaging</strong> before performing a <strong>Bronchoscopy & biopsy</strong> to extract physical tumour cells."
    },
    {
      step: 3,
      title: "Keyhole Surgery & CyberKnife",
      heading: "How has technology reduced treatment trauma?",
      bullets: ["VATS keyhole lobectomy", "Chest cracking avoided", "CyberKnife pinpoint rays"],
      model: "Surgeons execute <strong>VATS keyhole lobectomy</strong> ensuring painful <strong>Chest cracking avoided</strong>, while robotic <strong>CyberKnife pinpoint rays</strong> irradiate deep inoperable tumours with extreme accuracy."
    },
    {
      step: 4,
      title: "Targeted Genetic Oncology",
      heading: "How does immunotherapy harness the immune system?",
      bullets: ["Tumour DNA sequencing", "Targeted pharmacotherapy", "Targeted immunotherapy"],
      model: "Modern genetics utilizes <strong>Tumour DNA sequencing</strong> to prescribe customized <strong>Targeted pharmacotherapy</strong> and <strong>Targeted immunotherapy</strong> that trains the patient's immune system to destroy cancer cells."
    },
    {
      step: 5,
      title: "Government Statutory Action",
      heading: "Why has state legislation proved more effective than cure?",
      bullets: ["2007 Public smoking ban", "2016 Plain packaging", "Smoke-free generation law"],
      model: "Realizing prevention is far cheaper than cure, Parliament passed the <strong>2007 Public smoking ban</strong> and <strong>2016 Plain packaging</strong> regulations, advancing toward a historic <strong>Smoke-free generation law</strong>."
    }
  ],

  // ==========================================
  // KEY TOPIC 5: THE WESTERN FRONT (1914–1918)
  // ==========================================
  "lesson_5_1": [
    {
      step: 1,
      title: "Ypres Salient & Hill 60 Mines",
      heading: "Why was the Ypres Salient so difficult to defend?",
      bullets: ["Ypres Salient vulnerable geography", "Hill 60 mine warfare", "Passchendaele liquid mud"],
      model: "The British sector faced the <strong>Ypres Salient vulnerable geography</strong>, resulting in subterranean <strong>Hill 60 mine warfare</strong> and the treacherous, drowning quagmire of <strong>Passchendaele liquid mud</strong>."
    },
    {
      step: 2,
      title: "The Battle of the Somme (1916)",
      heading: "Why did the first day of the Somme cause unprecedented casualties?",
      bullets: ["1916 Somme casualty catastrophe", "57,000 first-day casualties", "Creeping barrage trauma"],
      model: "The bloodiest trial began with the <strong>1916 Somme casualty catastrophe</strong>, which produced <strong>57,000 first-day casualties</strong> as infantry advanced behind the experimental <strong>Creeping barrage trauma</strong>."
    },
    {
      step: 3,
      title: "Arras Underground Caves (1917)",
      heading: "How did underground chalk quarries shelter soldiers and hospitals?",
      bullets: ["Arras underground chalk tunnels", "Thompson's Cave 700-bed hospital", "Electric lighting & water"],
      model: "Before the 1917 battle, New Zealand miners excavated <strong>Arras underground chalk tunnels</strong>, constructing <strong>Thompson's Cave 700-bed hospital</strong> fully equipped with <strong>Electric lighting & water</strong>."
    },
    {
      step: 4,
      title: "The Battle of Cambrai (1917)",
      heading: "How did massed tank assaults strain medical evacuation?",
      bullets: ["1917 Cambrai massed tank assault", "Surprise artillery barrage", "Mass casualty triage strain"],
      model: "The <strong>1917 Cambrai massed tank assault</strong> relied on a devastating <strong>Surprise artillery barrage</strong>, putting immense <strong>Mass casualty triage strain</strong> on frontline medical units."
    },
    {
      step: 5,
      title: "Trench System Anatomy & Bottlenecks",
      heading: "How did trench architecture delay stretcher-bearer transport?",
      bullets: ["Trench network zig-zag layout", "Firebays & communication lines", "Stretcher bearer bottlenecks"],
      model: "Defensive trenches featured a <strong>Trench network zig-zag layout</strong> with reinforced <strong>Firebays & communication lines</strong> that created agonizing <strong>Stretcher bearer bottlenecks</strong> when evacuating wounded."
    }
  ],
  "lesson_5_2": [
    {
      step: 1,
      title: "Trench Foot: Mud & Gangrene",
      heading: "How did waterlogged trenches cause trench foot?",
      bullets: ["Waterlogged standing mud", "Constricted numb feet", "Whale oil & dry socks"],
      model: "Prolonged exposure to freezing, <strong>Waterlogged standing mud</strong> produced <strong>Constricted numb feet</strong> (trench foot), which officers combated by inspecting <strong>Whale oil & dry socks</strong> daily."
    },
    {
      step: 2,
      title: "Trench Fever & Lice Infestation",
      heading: "Why did body lice transmit debilitating trench fever?",
      bullets: ["Body lice in uniform seams", "Pyrrhic scratching infection", "Trench fever (PUO)"],
      model: "Infestations of <strong>Body lice in uniform seams</strong> and endless <strong>Pyrrhic scratching infection</strong> transmitted <strong>Trench fever (PUO)</strong>, putting thousands of infantrymen temporarily out of action."
    },
    {
      step: 3,
      title: "Shell Shock & Mental Breakdown",
      heading: "Why was shell shock initially treated as cowardice?",
      bullets: ["Shell shock trauma", "Tremors, paralysis & mutism", "Craiglockhart psychiatric care"],
      model: "Relentless high-explosive bombardments triggered <strong>Shell shock trauma</strong> characterized by violent <strong>Tremors, paralysis & mutism</strong>, eventually treated through specialist <strong>Craiglockhart psychiatric care</strong>."
    },
    {
      step: 4,
      title: "Chlorine Gas & Improvised Defences",
      heading: "How did soldiers survive the first poison gas attack in 1915?",
      bullets: ["Chlorine gas lung burning (1915)", "Urine-soaked cloth pads", "Small box respirators (1916)"],
      model: "German troops unleashed <strong>Chlorine gas lung burning (1915)</strong> at Second Ypres, forcing troops to use crude <strong>Urine-soaked cloth pads</strong> until issued advanced <strong>Small box respirators (1916)</strong>."
    },
    {
      step: 5,
      title: "Phosgene, Mustard Gas & Late Casualties",
      heading: "Why was mustard gas so psychologically terrifying?",
      bullets: ["Phosgene & mustard blistering", "Internal airway suffocation", "Rotting external skin burns"],
      model: "Chemical warfare escalated with <strong>Phosgene & mustard blistering</strong>, causing agonizing <strong>Internal airway suffocation</strong> alongside horrific, <strong>Rotting external skin burns</strong>."
    }
  ],
  "lesson_5_3": [
    {
      step: 1,
      title: "High-Explosive Shells & The Brodie Helmet",
      heading: "Why did shrapnel cause 58% of all Western Front wounds?",
      bullets: ["High explosive shrapnel shells", "Steel ball fragmentation", "Brodie helmet introduction (1915)"],
      model: "Artillery accounted for most casualties via <strong>High explosive shrapnel shells</strong> and deadly <strong>Steel ball fragmentation</strong>, leading to the vital <strong>Brodie helmet introduction (1915)</strong> to reduce head wounds."
    },
    {
      step: 2,
      title: "Machine Gun Wounds & Compound Trauma",
      heading: "How did rapid-fire machine guns cause devastating trauma?",
      bullets: ["Machine gun 450-rpm bursts", "Shattered compound bone trauma", "Catastrophic arterial haemorrhage"],
      model: "Frontline defensive barrages produced <strong>Machine gun 450-rpm bursts</strong>, creating severe <strong>Shattered compound bone trauma</strong> and triggering <strong>Catastrophic arterial haemorrhage</strong>."
    },
    {
      step: 3,
      title: "Manured Flanders Soil & Gas Gangrene",
      heading: "Why did agricultural fertilizer make battlefield infections lethal?",
      bullets: ["Manured Flanders farmland", "Tetanus & gas gangrene bacteria", "Anaerobic tissue rotting"],
      model: "Decades of intense cultivation across <strong>Manured Flanders farmland</strong> filled bomb craters with lethal <strong>Tetanus & gas gangrene bacteria</strong> that accelerated <strong>Anaerobic tissue rotting</strong>."
    },
    {
      step: 4,
      title: "Anti-Tetanus Serum & Preventive Injections",
      heading: "How did routine anti-tetanus injections save thousands of lives?",
      bullets: ["Anti-tetanus serum injections", "Routine frontline administration", "Dramatic lockjaw prevention"],
      model: "To counter soil-borne tetanus, RAMC medical staff enforced <strong>Anti-tetanus serum injections</strong> as a <strong>Routine frontline administration</strong>, achieving a <strong>Dramatic lockjaw prevention</strong>."
    },
    {
      step: 5,
      title: "Debridement & The Carrel-Dakin Method",
      heading: "How did deep wound debridement prevent fatal gangrene?",
      bullets: ["Inadequacy of simple antiseptics", "Deep surgical debridement", "Carrel-Dakin chemical flushing"],
      model: "Because deep explosive wounds highlighted the <strong>Inadequacy of simple antiseptics</strong>, military surgeons adopted <strong>Deep surgical debridement</strong> and continuous <strong>Carrel-Dakin chemical flushing</strong>."
    }
  ],
  "lesson_5_4": [
    {
      step: 1,
      title: "Stretcher Bearers & Frontline Retrieval",
      heading: "What harrowing obstacles did stretcher bearers face in No Man's Land?",
      bullets: ["Stretcher bearer four-man squads", "Traversing shell-cratered mud", "Frontline Regimental Aid Posts"],
      model: "Unarmed <strong>Stretcher bearer four-man squads</strong> worked under fire <strong>Traversing shell-cratered mud</strong> to carry wounded back to <strong>Frontline Regimental Aid Posts</strong>."
    },
    {
      step: 2,
      title: "Regimental Aid Posts: First Aid Under Fire",
      heading: "What immediate triage took place in the Regimental Aid Post?",
      bullets: ["Regimental Aid Post (RAP)", "Immediate tourniquets & bandaging", "Preventing immediate blood loss"],
      model: "Located just 200 yards behind trenches, the <strong>Regimental Aid Post (RAP)</strong> delivered <strong>Immediate tourniquets & bandaging</strong>, focusing strictly on <strong>Preventing immediate blood loss</strong>."
    },
    {
      step: 3,
      title: "Dressing Stations & Motor Ambulances",
      heading: "How did Field Ambulances sort casualties behind the lines?",
      bullets: ["Advanced Dressing Stations (ADS)", "Main Dressing Stations (MDS)", "Field Ambulance medical triage"],
      model: "Casualties passed to <strong>Advanced Dressing Stations (ADS)</strong> and <strong>Main Dressing Stations (MDS)</strong>, where RAMC officers performed urgent <strong>Field Ambulance medical triage</strong>."
    },
    {
      step: 4,
      title: "Casualty Clearing Stations & Triage",
      heading: "Why were CCS operating huts the most vital link in the evacuation chain?",
      bullets: ["Casualty Clearing Stations (CCS)", "Specialist surgical operating huts", "Crucial 24-hour infection window"],
      model: "Life-saving operations took place at <strong>Casualty Clearing Stations (CCS)</strong>, whose <strong>Specialist surgical operating huts</strong> treated wounded soldiers within the <strong>Crucial 24-hour infection window</strong>."
    },
    {
      step: 5,
      title: "Base Hospitals & Ambulance Trains",
      heading: "How were long-term casualties transported to coastal Base Hospitals?",
      bullets: ["Base hospitals near French ports", "Ambulance trains & canal barges", "'Blighty' ship evacuations"],
      model: "Recovering troops travelled to <strong>Base hospitals near French ports</strong> aboard dedicated <strong>Ambulance trains & canal barges</strong>, awaiting final <strong>'Blighty' ship evacuations</strong> to Britain."
    }
  ],
  "lesson_5_5": [
    {
      step: 1,
      title: "The Thomas Splint & Femur Survival",
      heading: "How did the Thomas splint reduce compound fracture mortality from 80% to 20%?",
      bullets: ["Thomas splint (1916)", "Compound femur fracture", "Survival rate surge (20% to 82%)"],
      model: "Introduced to the Western Front in 1916, the <strong>Thomas splint (1916)</strong> stabilized severe <strong>Compound femur fracture</strong> trauma, driving an astounding <strong>Survival rate surge (20% to 82%)</strong>."
    },
    {
      step: 2,
      title: "Mobile X-Ray Units at the Front",
      heading: "How did mobile radiographic vans locate buried shrapnel before surgery?",
      bullets: ["Mobile X-ray radiographic vans", "Locating shrapnel before surgery", "Preventing tissue damage"],
      model: "Frontline CCS units relied on <strong>Mobile X-ray radiographic vans</strong> for accurately <strong>Locating shrapnel before surgery</strong> and <strong>Preventing tissue damage</strong> during exploratory cutting."
    },
    {
      step: 3,
      title: "Early Blood Transfusion & Direct Donor Matching",
      heading: "Why was direct person-to-person transfusion impractical on the battlefield?",
      bullets: ["Direct blood transfusion technique", "Syringe-and-cannula matching", "Frontline donor limitations"],
      model: "Early transfusions required a risky <strong>Direct blood transfusion technique</strong> using <strong>Syringe-and-cannula matching</strong>, which was heavily restricted by dangerous <strong>Frontline donor limitations</strong>."
    },
    {
      step: 4,
      title: "Sodium Citrate & Glucose Storage (1915–1916)",
      heading: "How did chemical additives allow blood to be stored without clotting?",
      bullets: ["Richard Lewisohn sodium citrate", "Francis Rous & Turner glucose", "Refrigerated storage longevity"],
      model: "Breakthroughs by <strong>Richard Lewisohn sodium citrate</strong> (preventing clotting) and <strong>Francis Rous & Turner glucose</strong> allowed blood to maintain <strong>Refrigerated storage longevity</strong> for weeks."
    },
    {
      step: 5,
      title: "Oswald Robertson & The Cambrai Blood Depot (1917)",
      heading: "How did Oswald Robertson create the world's first blood bank at Cambrai?",
      bullets: ["Oswald Robertson blood depot", "1917 Cambrai mass casualties", "Stored universal donor blood"],
      model: "At the Battle of Cambrai, US doctor <strong>Oswald Robertson blood depot</strong> saved hundreds of <strong>1917 Cambrai mass casualties</strong> using pre-packaged <strong>Stored universal donor blood</strong>."
    }
  ],
  "lesson_5_6": [
    {
      step: 1,
      title: "Harvey Cushing: Magnets & Local Anaesthesia",
      heading: "How did Harvey Cushing revolutionize battlefield brain surgery?",
      bullets: ["Harvey Cushing brain surgery", "Local anaesthetic technique", "Magnet metal splinter removal"],
      model: "Pioneering American surgeon <strong>Harvey Cushing brain surgery</strong> on the Western Front utilized a <strong>Local anaesthetic technique</strong> alongside gentle <strong>Magnet metal splinter removal</strong>."
    },
    {
      step: 2,
      title: "Reduced Brain Mortality & Micro-Debridement",
      heading: "How did Cushing reduce brain surgery mortality to 29%?",
      bullets: ["Reduced brain surgery mortality", "Slow precision debridement", "Cushing 71% survival rate"],
      model: "Cushing's methods achieved <strong>Reduced brain surgery mortality</strong> through patient, <strong>Slow precision debridement</strong>, securing an extraordinary <strong>Cushing 71% survival rate</strong>."
    },
    {
      step: 3,
      title: "Harold Gillies & The Queen's Hospital, Sidcup",
      heading: "Why was facial reconstruction surgery born out of WWI trench warfare?",
      bullets: ["Harold Gillies plastic surgery", "Queen's Hospital Sidcup", "Facial reconstruction tube pedicle"],
      model: "Confronting horrific disfigurements, New Zealand surgeon <strong>Harold Gillies plastic surgery</strong> at <strong>Queen's Hospital Sidcup</strong> invented the groundbreaking <strong>Facial reconstruction tube pedicle</strong>."
    },
    {
      step: 4,
      title: "The Tubed Pedicle & Tissue Viability",
      heading: "How did the tubed pedicle preserve blood supply during skin grafts?",
      bullets: ["Walking wounded skin graft healing", "Preserving blood supply", "Reducing fatal graft rejection"],
      model: "The tube pedicle allowed <strong>Walking wounded skin graft healing</strong> by permanently <strong>Preserving blood supply</strong> between transfers, greatly <strong>Reducing fatal graft rejection</strong>."
    },
    {
      step: 5,
      title: "Restoring Identity: Over 11,000 Operations",
      heading: "What was the lasting humanitarian and surgical legacy of Sidcup?",
      bullets: ["Restoring soldiers' facial dignity", "Over 11,000 Sidcup operations", "Foundations of modern plastic surgery"],
      model: "Gillies focused on <strong>Restoring soldiers' facial dignity</strong> across <strong>Over 11,000 Sidcup operations</strong>, successfully building the permanent <strong>Foundations of modern plastic surgery</strong>."
    }
  ]
};

console.log('🚀 Loading edexcel_medicine dataset...');
const dataPath = path.resolve('data/edexcel_medicine.json');
const db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let updatedStagesCount = 0;
let purgedDoctrinalCount = 0;

db.lessons.forEach(l => {
  const canonicalList = MEDICINE_CANONICAL_STAGES[l.id];
  if (!canonicalList) return;

  if (!l.workbook_stages) l.workbook_stages = [];

  canonicalList.forEach((canon, idx) => {
    let st = l.workbook_stages[idx];
    if (!st) {
      st = { step: canon.step };
      l.workbook_stages[idx] = st;
    }

    if (st.model_sentence && (st.model_sentence.includes('doctrinal control') || st.model_sentence.includes('maintained doctrinal control'))) {
      purgedDoctrinalCount++;
    }

    st.step = canon.step;
    st.title = canon.title;
    st.heading = canon.heading;
    st.focus_clue = canon.heading;
    st.bullets = canon.bullets;
    st.words = canon.bullets.map(b => ({
      term: b,
      clue: `Official specification focus term: ${b}`
    }));
    st.model_sentence = canon.model;
    updatedStagesCount++;
  });
});

console.log(`✅ Synchronized ${updatedStagesCount} stages across all 26 medicine lessons.`);
console.log(`🔥 Purged ${purgedDoctrinalCount} robotic "doctrinal control" sentences.`);

// Save to data/edexcel_medicine.json
fs.writeFileSync(dataPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`💾 Saved to ${dataPath}`);

// Sync to public/data/edexcel_medicine.json
const publicDataPath = path.resolve('public/data/edexcel_medicine.json');
fs.writeFileSync(publicDataPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`💾 Saved to ${publicDataPath}`);

// Sync to units/edexcel_medicine/data.js and public/units/edexcel_medicine/data.js
const unitJsPath = path.resolve('units/edexcel_medicine/data.js');
const publicUnitJsPath = path.resolve('public/units/edexcel_medicine/data.js');
const jsContent = `window.unitData = ${JSON.stringify(db, null, 2)};\n`;
fs.writeFileSync(unitJsPath, jsContent, 'utf8');
fs.writeFileSync(publicUnitJsPath, jsContent, 'utf8');
console.log(`💾 Saved to ${unitJsPath} and ${publicUnitJsPath}`);

// Sync to database.json and public/database.json
['database.json', 'public/database.json'].forEach(dbPath => {
  if (fs.existsSync(dbPath)) {
    const mainDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (mainDb.units && mainDb.units.edexcel_medicine) {
      mainDb.units.edexcel_medicine = db;
      fs.writeFileSync(dbPath, JSON.stringify(mainDb, null, 2), 'utf8');
      console.log(`💾 Updated edexcel_medicine inside ${dbPath}`);
    }
  }
});

console.log('🎉 100% Medicine Synchronization Complete!');

