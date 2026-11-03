const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../public/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const med = db.edexcel_medicine.data || db.edexcel_medicine;

// Master Dictionary of 10 Spaced Retrieval Questions for all 26 Lessons
// Every question strictly retrieves from prior lessons within edexcel_medicine (or KS3 contextual foundations for 1.1)
const medicineDoNowMaster = {
  // ==========================================
  // KEY TOPIC 1: MEDIEVAL MEDICINE (c1250–c1500)
  // ==========================================
  lesson_1_1: [
    {
      question: "Which international institution controlled all education, book copying, and hospital foundations in medieval England? (Foundational Context)",
      answer: "The Roman Catholic Church."
    },
    {
      question: "What term describes the system of land ownership, loyalty, and social hierarchy established across England after 1066? (Foundational Context)",
      answer: "The Feudal System."
    },
    {
      question: "Why did the vast majority of ordinary medieval peasants lack direct access to Latin medical manuscripts? (Foundational Context)",
      answer: "Peasant illiteracy was near universal and books had to be copied by hand onto expensive animal parchment (vellum)."
    },
    {
      question: "What language was universally used across medieval Western Europe for church services, legal documents, and university lectures? (Foundational Context)",
      answer: "Latin."
    },
    {
      question: "What ancient European empire collapsed around AD 476, leading to the fragmentation of public health infrastructure in Britain? (Foundational Context)",
      answer: "The Western Roman Empire."
    },
    {
      question: "What religious journeys did medieval Europeans undertake to holy shrines like Canterbury or Rome in hope of curing disease? (Foundational Context)",
      answer: "Pilgrimages."
    },
    {
      question: "What holy physical items did medieval Christians venerate in the belief they possessed miraculous healing power? (Foundational Context)",
      answer: "Holy relics (such as bones, clothing, or fragments of the True Cross associated with saints)."
    },
    {
      question: "What percentage of the population in medieval England lived in rural farming villages rather than towns? (Foundational Context)",
      answer: "Around 90%."
    },
    {
      question: "In medieval Christian theology, how was physical suffering and epidemic pestilence commonly understood? (Foundational Context)",
      answer: "As divine punishment sent by God for human sin, or a direct test of faith."
    },
    {
      question: "What medieval trade associations regulated apprentice training, market standards, and professional conduct in market towns? (Foundational Context)",
      answer: "Medieval Guilds."
    }
  ],

  lesson_1_2: [
    {
      question: "According to medieval Christian teaching, what was viewed as the ultimate root cause of physical disease? (Last Lesson)",
      answer: "Human sin and God's divine wrath."
    },
    {
      question: "Why did medieval physicians consult the Zodiac Man before performing surgery or medical procedures? (Last Lesson)",
      answer: "They believed the alignment of the stars and planets directly governed specific organs and parts of the body."
    },
    {
      question: "What distinctive warning object were diagnosed lepers legally required to carry? (Last Lesson)",
      answer: "A bell or wooden clapper to warn healthy passers-by to keep away."
    },
    {
      question: "What religious practice involved whipping oneself in public to appease the anger of God? (Last Lesson)",
      answer: "Flagellation (practised by flagellants)."
    },
    {
      question: "Why did the medieval Catholic Church strongly promote the medical writings of the pagan Roman physician Galen? (Last Lesson)",
      answer: "Galen taught that the human body was purposefully created by a single Creator, which fitted Christian doctrine."
    },
    {
      question: "What ancient Greek physician originated the concept that natural balance, rather than spirits, maintained health? (Prior Topic)",
      answer: "Hippocrates of Kos."
    },
    {
      question: "What diagnostic method of recording symptoms and tracking the natural progress of an illness did Hippocrates introduce? (Prior Topic)",
      answer: "Clinical observation."
    },
    {
      question: "What ethical pledge taken by doctors to 'do no harm' originated with Hippocrates? (Prior Topic)",
      answer: "The Hippocratic Oath."
    },
    {
      question: "What language were classical Greek medical texts translated into before reaching medieval European universities? (Prior Topic)",
      answer: "Arabic (translated and preserved by Islamic scholars like Ibn Sina/Avicenna and al-Razi)."
    },
    {
      question: "What institution held a strict monopoly over university medical curricula and doctor licensing in medieval England? (Prior Topic)",
      answer: "The Roman Catholic Church."
    }
  ],

  lesson_1_3: [
    {
      question: "Which four bodily fluids made up the Hippocratic humoral system? (Last Lesson)",
      answer: "Blood, phlegm, black bile, and yellow bile."
    },
    {
      question: "What was Galen’s medical principle of treating an illness with an opposite quality called? (Last Lesson)",
      answer: "The Theory of Opposites (e.g. treating a cold, wet chill with hot, dry wine or spices)."
    },
    {
      question: "What diagnostic procedure involved holding a glass flask of urine up to the light against a colour chart? (Last Lesson)",
      answer: "Uroscopy (examining urine color, clarity, sediment, and sometimes taste)."
    },
    {
      question: "Which season and qualities were associated with the humor blood? (Last Lesson)",
      answer: "Spring; hot and wet."
    },
    {
      question: "In humoral theory, an excess of which humor was believed to make a person hot-tempered and irritable (choleric)? (Last Lesson)",
      answer: "Yellow bile."
    },
    {
      question: "According to Galen, what internal organ produced blood from digested food? (Last Lesson)",
      answer: "The liver (before being consumed by bodily tissues)."
    },
    {
      question: "What was the popular medieval medical belief that foul, corrupt air carried disease called? (Last Week)",
      answer: "Miasma (miasmatic theory)."
    },
    {
      question: "Why did medieval physicians rarely question Galen's anatomical descriptions? (Last Week)",
      answer: "The Catholic Church condemned anyone who challenged Galen's authority, and books were accepted as absolute truth."
    },
    {
      question: "What chart linking parts of the body to astrological constellations was consulted before surgery? (Last Week)",
      answer: "The Zodiac Man."
    },
    {
      question: "What religious journeys did medieval Christians undertake to cure illnesses when natural medicine failed? (Prior Topic)",
      answer: "Pilgrimages."
    }
  ],

  lesson_1_4: [
    {
      question: "What was the most common surgical procedure performed by medieval barber-surgeons to balance humours? (Last Lesson)",
      answer: "Bloodletting (phlebotomy)."
    },
    {
      question: "Which English military surgeon pioneered clean wine washes and opium pain relief during the Hundred Years' War? (Last Lesson)",
      answer: "John Arderne."
    },
    {
      question: "What costly compound of over sixty herbal and mineral ingredients was used as a universal antidote? (Last Lesson)",
      answer: "Theriaca (or Venice Treacle)."
    },
    {
      question: "What medieval set of healthy lifestyle guidelines advised balanced diet, exercise, and sleep to prevent illness? (Last Lesson)",
      answer: "The Regimen Sanitatis."
    },
    {
      question: "What painful surgical technique involved pressing red-hot iron onto an open wound to seal blood vessels? (Last Lesson)",
      answer: "Cauterization."
    },
    {
      question: "What procedure used heated glass cups over small skin cuts to draw bad humours to the surface? (Last Lesson)",
      answer: "Cupping."
    },
    {
      question: "What were the four bodily fluids in the Theory of the Four Humours? (Last Week)",
      answer: "Blood, phlegm, black bile, and yellow bile."
    },
    {
      question: "What was Galen's core treatment method of using warmth against cold called? (Last Week)",
      answer: "The Theory of Opposites."
    },
    {
      question: "Why did wealthy medieval families employ university-trained physicians rather than local barber-surgeons? (Last Week)",
      answer: "Physicians had studied classical Latin texts of Galen for up to ten years and were considered scholars."
    },
    {
      question: "What international institution controlled hospital foundations and university curricula in medieval England? (Prior Topic)",
      answer: "The Roman Catholic Church."
    }
  ],

  lesson_1_5: [
    {
      question: "What was the primary guiding principle of medieval monastic hospitals? (Last Lesson)",
      answer: "'Care not cure' (providing shelter, warmth, spiritual prayer, and basic food rather than surgical treatment)."
    },
    {
      question: "Which group of craftsmen performed bloodletting, tooth extraction, and minor amputations? (Last Lesson)",
      answer: "Barber-surgeons."
    },
    {
      question: "What female practitioners prepared domestic herbal remedies and attended childbirth in medieval villages? (Last Lesson)",
      answer: "Wise women and local midwives."
    },
    {
      question: "What specialized medieval hospital in London was founded in 1123 to care for the poor and sick? (Last Lesson)",
      answer: "St Bartholomew’s Hospital."
    },
    {
      question: "Why were victims of infectious leprosy turned away from regular monastic hospitals? (Last Lesson)",
      answer: "They were viewed as contagiously and spiritually unclean, and segregated in specialized 'lazar houses'."
    },
    {
      question: "What common treatment involved giving emetics or laxatives to empty the digestive tract of bad humours? (Last Week)",
      answer: "Purging."
    },
    {
      question: "What medical manual gave advice on diet, clean air, sleep, and bathing to stay healthy? (Last Week)",
      answer: "The Regimen Sanitatis."
    },
    {
      question: "Which humor was associated with winter, coldness, and wetness? (Last Week)",
      answer: "Phlegm."
    },
    {
      question: "What ancient Greek physician originated clinical observation and the Four Humours? (Prior Topic)",
      answer: "Hippocrates."
    },
    {
      question: "What was the term for poisonous, foul-smelling air believed to spread disease? (Prior Topic)",
      answer: "Miasma."
    }
  ],

  // ==========================================
  // KEY TOPIC 2: RENAISSANCE MEDICINE (c1500–c1700)
  // ==========================================
  lesson_2_1: [
    {
      question: "In what year did the Black Death arrive in England, killing one-third to one-half of the population? (Last Lesson)",
      answer: "1348 (arriving at Melcombe Regis in Dorset)."
    },
    {
      question: "What two religious explanations did medieval people give for the Black Death? (Last Lesson)",
      answer: "God's wrath for human sin, and the unusual conjunction of Saturn, Jupiter, and Mars."
    },
    {
      question: "What environmental cause did medieval authorities blame for the plague, prompting people to carry posies of herbs? (Last Lesson)",
      answer: "Miasma (corrupt air from unburied bodies and filth)."
    },
    {
      question: "What quarantine measure did the city of Gloucester take in 1348 to prevent plague spreading? (Last Lesson)",
      answer: "They attempted to close the city gates to outsiders from infected areas."
    },
    {
      question: "What was the primary function of most medieval monastic hospitals? (Last Week)",
      answer: "'Care not cure' (spiritual hospice care, prayer, and rest)."
    },
    {
      question: "Which four humours were believed to govern human health throughout the Middle Ages? (Prior Topic)",
      answer: "Blood, phlegm, yellow bile, and black bile."
    },
    {
      question: "What was Galen's medical principle of treating illness with opposite qualities called? (Prior Topic)",
      answer: "The Theory of Opposites."
    },
    {
      question: "What common surgical procedure involved cutting a vein or using leeches to remove bad blood? (Prior Topic)",
      answer: "Bloodletting (phlebotomy)."
    },
    {
      question: "Which English military surgeon pioneered clean wine dressings for wounds in the 14th century? (Prior Topic)",
      answer: "John Arderne."
    },
    {
      question: "Which institution held an intellectual monopoly over medicine, dissection, and book copying in medieval England? (Prior Topic)",
      answer: "The Roman Catholic Church."
    }
  ],

  lesson_2_2: [
    {
      question: "What was the official Latin motto of the Royal Society, meaning 'Take nobody’s word for it'? (Last Lesson)",
      answer: "Nullius in verba."
    },
    {
      question: "Which invention in the mid-15th century allowed medical ideas and anatomical diagrams to spread rapidly? (Last Lesson)",
      answer: "The movable type printing press (developed by Johannes Gutenberg c.1440)."
    },
    {
      question: "In what year did King Charles II grant a Royal Charter to establish the Royal Society in London? (Last Lesson)",
      answer: "1662 (founded in 1660)."
    },
    {
      question: "What intellectual movement encouraged Renaissance scholars to question classical texts and experiment for themselves? (Last Lesson)",
      answer: "Humanism."
    },
    {
      question: "In 1348, what epidemic killed over a third of England's population? (Last Week)",
      answer: "The Black Death."
    },
    {
      question: "What was the core principle of medieval hospitals? (Prior Topic)",
      answer: "'Care not cure'."
    },
    {
      question: "Which ancient Roman physician's anatomical books remained unchallenged for over 1,300 years? (Prior Topic)",
      answer: "Galen."
    },
    {
      question: "What theory taught that disease was caused by an imbalance of blood, phlegm, and biles? (Prior Topic)",
      answer: "The Theory of the Four Humours."
    },
    {
      question: "What diagnostic method involved inspecting a patient's urine in a flask? (Prior Topic)",
      answer: "Uroscopy."
    },
    {
      question: "What poisonous vapor was widely believed to transmit plague throughout the medieval era? (Prior Topic)",
      answer: "Miasma."
    }
  ],

  lesson_2_3: [
    {
      question: "Which English Renaissance physician was celebrated as the 'English Hippocrates' for his bedside observations? (Last Lesson)",
      answer: "Thomas Sydenham."
    },
    {
      question: "What revolutionary treatment did Thomas Sydenham champion for smallpox patients, rejecting hot sweating rooms? (Last Lesson)",
      answer: "Cool air, cold drinks, and light bedclothes."
    },
    {
      question: "What bark containing quinine did Sydenham successfully use to treat malaria (ague)? (Last Lesson)",
      answer: "Cinchona bark (Jesuit's bark)."
    },
    {
      question: "What did Sydenham argue about diseases, comparing them to plants? (Last Lesson)",
      answer: "That diseases could be classified into distinct species with distinct symptoms, rather than individual humoral imbalances."
    },
    {
      question: "What was the motto of the Royal Society, meaning 'Take nobody's word for it'? (Last Week)",
      answer: "Nullius in verba."
    },
    {
      question: "What machine invented c.1440 revolutionized the sharing of scientific discoveries? (Last Week)",
      answer: "The printing press."
    },
    {
      question: "In what year did the Black Death arrive in England? (Prior Topic)",
      answer: "1348."
    },
    {
      question: "What was the primary function of medieval monastic hospitals? (Prior Topic)",
      answer: "'Care not cure'."
    },
    {
      question: "Who developed the Theory of Opposites in ancient Rome? (Prior Topic)",
      answer: "Galen."
    },
    {
      question: "What Greek physician originated the method of clinical observation at the bedside? (Prior Topic)",
      answer: "Hippocrates."
    }
  ],

  lesson_2_4: [
    {
      question: "What was the title of Andreas Vesalius’s landmark 1543 anatomical masterpiece? (Last Lesson)",
      answer: "De Humani Corporis Fabrica ('On the Fabric of the Human Body')."
    },
    {
      question: "Why did Galen make over two hundred anatomical errors in his original classical descriptions? (Last Lesson)",
      answer: "Roman religious taboos banned human dissection, so Galen had to dissect animals (pigs, apes, dogs) instead."
    },
    {
      question: "Name one specific error of Galen disproved by Andreas Vesalius. (Last Lesson)",
      answer: "The human lower jaw has one single bone, not two; or the human breastbone has three segments, not seven."
    },
    {
      question: "How did Vesalius conduct his university anatomy lectures at Padua, breaking medieval tradition? (Last Lesson)",
      answer: "He dissected human cadavers himself on the operating table instead of leaving it to a barber while reading from Galen."
    },
    {
      question: "Which English physician, nicknamed the 'English Hippocrates', pioneered the classification of diseases? (Last Week)",
      answer: "Thomas Sydenham."
    },
    {
      question: "What cooling treatment did Sydenham prescribe for smallpox? (Last Week)",
      answer: "Cool air, cold drinks, and removing heavy blankets."
    },
    {
      question: "What scientific organisation in London was granted a Royal Charter in 1662? (Prior Topic)",
      answer: "The Royal Society."
    },
    {
      question: "What mid-15th century invention allowed Vesalius's detailed woodcut anatomical illustrations to be printed accurately? (Prior Topic)",
      answer: "The printing press."
    },
    {
      question: "In humoral theory, what was Galen's treatment principle of opposites called? (Prior Topic)",
      answer: "The Theory of Opposites."
    },
    {
      question: "What was the Latin motto meaning 'Take nobody's word for it'? (Prior Topic)",
      answer: "Nullius in verba."
    }
  ],

  lesson_2_5: [
    {
      question: "What major physiological discovery did William Harvey publish in 1628 in De Motu Cordis? (Last Lesson)",
      answer: "The circulation of blood pumped continuously around the body in a one-way system by the heart."
    },
    {
      question: "Why did William Harvey’s discovery of blood circulation have virtually no immediate practical effect on medical treatments? (Last Lesson)",
      answer: "Doctors did not know about blood groups, transfusions, or bacteria, so they continued bleeding patients to balance humours."
    },
    {
      question: "What mechanical analogy did Harvey use to explain how the heart functioned as a muscular pump? (Last Lesson)",
      answer: "A mechanical water pump (reflecting Industrial Renaissance mechanical engineering)."
    },
    {
      question: "What microscopic blood vessels connecting arteries to veins could Harvey not see without a microscope? (Last Lesson)",
      answer: "Capillaries (later observed by Marcello Malpighi in 1661)."
    },
    {
      question: "What was the name of Andreas Vesalius's famous 1543 anatomical book? (Last Week)",
      answer: "The Fabric of the Human Body (De Fabrica)."
    },
    {
      question: "Why did Galen make mistakes about the human jaw and liver? (Last Week)",
      answer: "He dissected animals (apes, dogs, pigs) rather than human bodies."
    },
    {
      question: "Which English doctor was known as the 'English Hippocrates'? (Prior Topic)",
      answer: "Thomas Sydenham."
    },
    {
      question: "What was the Latin motto of the Royal Society? (Prior Topic)",
      answer: "Nullius in verba ('Take nobody's word for it')."
    },
    {
      question: "In 1348, what pandemic killed up to half of England's population? (Prior Topic)",
      answer: "The Black Death."
    },
    {
      question: "What was the primary function of medieval monastic hospitals? (Prior Topic)",
      answer: "'Care not cure'."
    }
  ],

  // ==========================================
  // KEY TOPIC 3: 18th & 19th CENTURY MEDICINE (c1700–c1900)
  // ==========================================
  lesson_3_1: [
    {
      question: "In what year did the Great Plague strike London, killing approximately 100,000 people? (Last Lesson)",
      answer: "1665."
    },
    {
      question: "What government quarantine measure was used in London during the 1665 Great Plague? (Last Lesson)",
      answer: "Infected houses were locked for 28 days with a red cross and the words 'Lord have mercy upon us' painted on the door."
    },
    {
      question: "What animals were blamed and slaughtered in tens of thousands during the 1665 Great Plague? (Last Lesson)",
      answer: "Dogs and cats (which ironically allowed plague-carrying black rats to multiply)."
    },
    {
      question: "What major physiological breakthrough did William Harvey publish in 1628? (Last Week)",
      answer: "The circulation of the blood pumped by the heart."
    },
    {
      question: "What anatomical book did Andreas Vesalius publish in 1543 disproving Galen? (Last Week)",
      answer: "The Fabric of the Human Body (De Fabrica)."
    },
    {
      question: "Which Renaissance physician was celebrated as the 'English Hippocrates'? (Prior Topic)",
      answer: "Thomas Sydenham."
    },
    {
      question: "What was the motto of the Royal Society, founded in the 1660s? (Prior Topic)",
      answer: "Nullius in verba."
    },
    {
      question: "In 1348, what plague struck England? (Prior Topic)",
      answer: "The Black Death."
    },
    {
      question: "What was the guiding motto of medieval monastic hospitals? (Prior Topic)",
      answer: "'Care not cure'."
    },
    {
      question: "What theory taught that disease was caused by an imbalance of four bodily fluids? (Prior Topic)",
      answer: "The Theory of the Four Humours."
    }
  ],

  lesson_3_2: [
    {
      question: "What did Louis Pasteur prove using curved swan-neck flasks in his 1861 Germ Theory? (Last Lesson)",
      answer: "Microbes in the air caused decay and fermentation, disproving spontaneous generation."
    },
    {
      question: "Which crucial laboratory technique did Robert Koch develop in 1882 to identify specific bacteria? (Last Lesson)",
      answer: "Using agar jelly plates and chemical industrial dyes (like methylene blue) to stain and photograph microbes."
    },
    {
      question: "What deadly lung disease microbe did Robert Koch discover in 1882? (Last Lesson)",
      answer: "The tuberculosis bacterium (Mycobacterium tuberculosis)."
    },
    {
      question: "What cholera microbe did Robert Koch identify in 1883 in India and Egypt? (Last Lesson)",
      answer: "Vibrio cholerae."
    },
    {
      question: "What discredited theory claimed that living microbes appeared spontaneously out of rotting matter? (Last Lesson)",
      answer: "Spontaneous generation."
    },
    {
      question: "What major epidemic struck London in 1665? (Last Week)",
      answer: "The Great Plague."
    },
    {
      question: "Who proved in 1628 that blood circulated in a closed loop pumped by the heart? (Prior Topic)",
      answer: "William Harvey."
    },
    {
      question: "Who published 'The Fabric of the Human Body' in 1543? (Prior Topic)",
      answer: "Andreas Vesalius."
    },
    {
      question: "What was the official Latin motto of the Royal Society? (Prior Topic)",
      answer: "Nullius in verba."
    },
    {
      question: "What ancient Greek physician originated clinical observation? (Prior Topic)",
      answer: "Hippocrates."
    }
  ],

  lesson_3_3: [
    {
      question: "What biological substance did Edward Jenner use in 1796 to safely inoculate young James Phipps against smallpox? (Last Lesson)",
      answer: "Cowpox matter taken from lesions on the hand of dairymaid Sarah Nelmes."
    },
    {
      question: "Why did Parliament pass the 1840 Vaccination Act providing free cowpox vaccination and banning dangerous variolation? (Last Lesson)",
      answer: "Variolation inoculated patients with virulent live smallpox, which carried a 2–3% mortality rate and frequently sparked secondary epidemics."
    },
    {
      question: "In what year did the British government make smallpox vaccination compulsory for infants? (Last Lesson)",
      answer: "1853."
    },
    {
      question: "What was the older, dangerous method of scratching live smallpox scabs into a person's skin called? (Last Lesson)",
      answer: "Variolation (or inoculation)."
    },
    {
      question: "What French scientist published the Germ Theory in 1861? (Last Week)",
      answer: "Louis Pasteur."
    },
    {
      question: "What German doctor developed chemical staining techniques to discover the tuberculosis and cholera bacteria? (Last Week)",
      answer: "Robert Koch."
    },
    {
      question: "What was the primary function of most medieval hospitals (c.1250–c.1500) run by monastic orders in England? (Prior Topic)",
      answer: "'Care not cure' (providing spiritual comfort, rest, and prayer rather than medical treatment)."
    },
    {
      question: "What major physiological discovery did William Harvey publish in 1628? (Prior Topic)",
      answer: "The circulation of blood pumped by the heart."
    },
    {
      question: "What landmark anatomical book did Andreas Vesalius publish in 1543? (Prior Topic)",
      answer: "The Fabric of the Human Body (De Fabrica)."
    },
    {
      question: "What was the Latin motto meaning 'Take nobody's word for it'? (Prior Topic)",
      answer: "Nullius in verba."
    }
  ],

  lesson_3_4: [
    {
      question: "What major architectural innovation did Florence Nightingale advocate in her 1859 Notes on Hospitals? (Last Lesson)",
      answer: "The Pavilion Plan (separate multi-storey brick pavilions connected by corridors, with large windows for cross-ventilation)."
    },
    {
      question: "How did Mary Seacole deliver medical assistance to British soldiers in the Crimean War? (Last Lesson)",
      answer: "She funded her own passage to the Crimea and established the 'British Hotel' near Balaclava, treating wounded soldiers directly on the battlefield."
    },
    {
      question: "At which military hospital in 1854 did Florence Nightingale reduce mortality from over 40% to 2% through sanitary cleaning? (Last Lesson)",
      answer: "The Barrack Hospital at Scutari."
    },
    {
      question: "What training institution did Nightingale establish in 1860 at St Thomas' Hospital in London? (Last Lesson)",
      answer: "The Nightingale School of Nursing."
    },
    {
      question: "What vaccine did Edward Jenner develop in 1796 using cowpox? (Last Week)",
      answer: "The smallpox vaccine."
    },
    {
      question: "In what year did Louis Pasteur publish his Germ Theory? (Last Week)",
      answer: "1861."
    },
    {
      question: "What German scientist stained bacteria and discovered the tuberculosis microbe in 1882? (Last Week)",
      answer: "Robert Koch."
    },
    {
      question: "What sixteenth-century surgical innovation did French military surgeon Ambroise Paré introduce? (Prior Topic)",
      answer: "Soothing rose oil, egg yolk, and turpentine ointment instead of boiling elderberry oil, and silk ligatures to tie off arteries."
    },
    {
      question: "Who proved in 1628 that blood circulated in a one-way system? (Prior Topic)",
      answer: "William Harvey."
    },
    {
      question: "What was the guiding philosophy of medieval monastic hospitals? (Prior Topic)",
      answer: "'Care not cure'."
    }
  ],

  lesson_3_5: [
    {
      question: "What effective anaesthetic agent did James Young Simpson discover in 1847 to replace ether? (Last Lesson)",
      answer: "Chloroform."
    },
    {
      question: "What chemical antiseptic did Joseph Lister use in 1865 to prevent wound sepsis in compound fractures? (Last Lesson)",
      answer: "Carbolic acid."
    },
    {
      question: "What unintended consequence did the introduction of anaesthetics have on surgical mortality between 1846 and 1870? (Last Lesson)",
      answer: "The 'Black Period of Surgery' — surgeons operated deeper and longer, carrying unseen germs deeper into body cavities, increasing deaths from gangrene and sepsis."
    },
    {
      question: "Which British monarch endorsed chloroform in 1853 by using it during the birth of Prince Leopold? (Last Lesson)",
      answer: "Queen Victoria."
    },
    {
      question: "What hospital ward design with high ceilings and cross-ventilation did Florence Nightingale champion? (Last Week)",
      answer: "The Pavilion Plan."
    },
    {
      question: "At which military hospital did Florence Nightingale slash death rates from 42% to 2% in the 1850s? (Last Week)",
      answer: "The Barrack Hospital at Scutari."
    },
    {
      question: "What did Edward Jenner use in 1796 to vaccinate against smallpox? (Prior Topic)",
      answer: "Cowpox lymph."
    },
    {
      question: "What theory published by Louis Pasteur in 1861 inspired Joseph Lister to use carbolic acid? (Prior Topic)",
      answer: "The Germ Theory."
    },
    {
      question: "What French surgeon in the 16th century introduced ligatures and soothing wound ointments? (Prior Topic)",
      answer: "Ambroise Paré."
    },
    {
      question: "What was the Latin motto of the Royal Society? (Prior Topic)",
      answer: "Nullius in verba."
    }
  ],

  // ==========================================
  // KEY TOPIC 4: MODERN MEDICINE (c1900–present)
  // ==========================================
  lesson_4_1: [
    {
      question: "What did Dr John Snow remove in 1854 to halt the deadly Soho cholera epidemic? (Last Lesson)",
      answer: "The handle of the Broad Street water pump."
    },
    {
      question: "What landmark public health legislation did Parliament pass in 1875, ending government laissez-faire? (Last Lesson)",
      answer: "The 1875 Public Health Act (which made it compulsory for local councils to provide clean water, sewers, and street lighting)."
    },
    {
      question: "What massive civil engineering project did Sir Joseph Bazalgette construct between 1859 and 1875 following the 'Great Stink'? (Last Lesson)",
      answer: "The London underground sewage network (over 1,100 miles of street sewers and 82 miles of main intercepting sewers)."
    },
    {
      question: "What effective surgical anaesthetic did James Simpson discover in 1847? (Last Week)",
      answer: "Chloroform."
    },
    {
      question: "What antiseptic chemical did Joseph Lister introduce in 1865? (Last Week)",
      answer: "Carbolic acid."
    },
    {
      question: "What hospital ward architecture did Florence Nightingale champion in the 1860s? (Last Week)",
      answer: "The Pavilion Plan."
    },
    {
      question: "What biological substance did Edward Jenner use in 1796 to prevent smallpox? (Prior Topic)",
      answer: "Cowpox lymph."
    },
    {
      question: "What French scientist proved in 1861 that airborne microbes caused decay and disease? (Prior Topic)",
      answer: "Louis Pasteur (The Germ Theory)."
    },
    {
      question: "What German scientist developed laboratory methods to discover the tuberculosis and cholera bacteria? (Prior Topic)",
      answer: "Robert Koch."
    },
    {
      question: "Who proved the circulation of blood in 1628? (Prior Topic)",
      answer: "William Harvey."
    }
  ],

  lesson_4_2: [
    {
      question: "What geometric molecular structure did James Watson and Francis Crick discover for DNA in 1953? (Last Lesson)",
      answer: "The double helix."
    },
    {
      question: "Which crystallographer produced Photograph 51, providing the essential X-ray image that revealed DNA's helical structure? (Last Lesson)",
      answer: "Rosalind Franklin (alongside Maurice Wilkins)."
    },
    {
      question: "What was the primary achievement of the international Human Genome Project completed in 2003? (Last Lesson)",
      answer: "Successfully mapping and sequencing every single gene in the human genetic code (3 billion DNA base pairs)."
    },
    {
      question: "What 1875 legislation forced local town councils to provide clean water, sewers, and public health inspectors? (Last Week)",
      answer: "The 1875 Public Health Act."
    },
    {
      question: "What did Dr John Snow prove in 1854 about the transmission of cholera? (Last Week)",
      answer: "It was a waterborne disease transmitted by drinking water contaminated with human sewage, not by airborne miasma."
    },
    {
      question: "What anaesthetic did James Simpson discover in 1847? (Prior Topic)",
      answer: "Chloroform."
    },
    {
      question: "What chemical did Joseph Lister spray in operating theatres in 1865 to prevent infection? (Prior Topic)",
      answer: "Carbolic acid."
    },
    {
      question: "What did Louis Pasteur's 1861 Germ Theory prove? (Prior Topic)",
      answer: "Microbes in the air caused decay and disease."
    },
    {
      question: "Who discovered the smallpox vaccine in 1796? (Prior Topic)",
      answer: "Edward Jenner."
    },
    {
      question: "What was the primary function of medieval monastic hospitals? (Prior Topic)",
      answer: "'Care not cure'."
    }
  ],

  lesson_4_3: [
    {
      question: "What internal diagnostic imaging technology was discovered by German physicist Wilhelm Röntgen in 1895? (Last Lesson)",
      answer: "X-rays."
    },
    {
      question: "What major 3D medical scanning machine did Sir Godfrey Hounsfield develop at EMI in 1971? (Last Lesson)",
      answer: "The CT (Computed Tomography) scanner."
    },
    {
      question: "What diagnostic imaging technology developed in the 1970s uses powerful magnetic fields and radio waves instead of radiation? (Last Lesson)",
      answer: "MRI (Magnetic Resonance Imaging)."
    },
    {
      question: "Name one major lifestyle factor identified in the 20th century as a leading cause of cardiovascular disease and lung cancer. (Last Lesson)",
      answer: "Cigarette smoking (or high-sugar/high-fat diets and alcohol misuse)."
    },
    {
      question: "Who discovered the double-helix chemical structure of DNA in 1953? (Last Week)",
      answer: "James Watson and Francis Crick (using Rosalind Franklin's Photograph 51)."
    },
    {
      question: "In what year was the international Human Genome Project completed? (Last Week)",
      answer: "2003."
    },
    {
      question: "What 1875 act ended government laissez-faire in Britain by requiring councils to provide sewers and clean water? (Prior Topic)",
      answer: "The 1875 Public Health Act."
    },
    {
      question: "What did John Snow map in London in 1854 to trace cholera? (Prior Topic)",
      answer: "The Broad Street water pump."
    },
    {
      question: "What French scientist published the Germ Theory in 1861? (Prior Topic)",
      answer: "Louis Pasteur."
    },
    {
      question: "Who discovered the circulation of blood in 1628? (Prior Topic)",
      answer: "William Harvey."
    }
  ],

  lesson_4_4: [
    {
      question: "What chemical 'magic bullet' did Paul Ehrlich and Sahachiro Hata discover in 1909 to cure syphilis? (Last Lesson)",
      answer: "Salvarsan 606."
    },
    {
      question: "What second 'magic bullet' (a red dye discovered by Gerhard Domagk in 1932) cured deadly streptococcal blood poisoning? (Last Lesson)",
      answer: "Prontosil."
    },
    {
      question: "On what exact date was Britain's National Health Service (NHS) officially launched? (Last Lesson)",
      answer: "5 July 1948."
    },
    {
      question: "Which Labour Minister of Health founded the NHS, declaring healthcare should be free at the point of delivery? (Last Lesson)",
      answer: "Aneurin (Nye) Bevan."
    },
    {
      question: "What imaging breakthrough did Wilhelm Röntgen discover in 1895? (Last Week)",
      answer: "X-rays."
    },
    {
      question: "What 3D scanner did Godfrey Hounsfield build in 1971? (Last Week)",
      answer: "The CT scanner."
    },
    {
      question: "Who discovered the molecular structure of DNA in 1953? (Last Week)",
      answer: "Watson and Crick (with Franklin and Wilkins)."
    },
    {
      question: "What 1875 legislation made public health provisions compulsory in Britain? (Prior Topic)",
      answer: "The 1875 Public Health Act."
    },
    {
      question: "Who proved cholera was waterborne at Broad Street in 1854? (Prior Topic)",
      answer: "Dr John Snow."
    },
    {
      question: "Who developed the first smallpox vaccine in 1796? (Prior Topic)",
      answer: "Edward Jenner."
    }
  ],

  lesson_4_5: [
    {
      question: "What miracle antibiotic did Alexander Fleming discover in 1928, and which Howard Florey and Ernst Chain purified in 1940? (Last Lesson)",
      answer: "Penicillin."
    },
    {
      question: "What commercial manufacturing method developed in Peoria, Illinois (USA) allowed mass production of penicillin for D-Day in 1944? (Last Lesson)",
      answer: "Deep-tank industrial fermentation using corn-steep liquor."
    },
    {
      question: "On what date was Britain's National Health Service (NHS) founded by Aneurin Bevan? (Last Lesson)",
      answer: "5 July 1948."
    },
    {
      question: "What was the first chemical 'magic bullet' discovered by Paul Ehrlich in 1909? (Last Week)",
      answer: "Salvarsan 606."
    },
    {
      question: "What second magic bullet did Gerhard Domagk discover in 1932? (Last Week)",
      answer: "Prontosil."
    },
    {
      question: "What medical imaging breakthrough did Wilhelm Röntgen discover in 1895? (Last Week)",
      answer: "X-rays."
    },
    {
      question: "What molecular structure did Watson and Crick uncover in 1953? (Prior Topic)",
      answer: "The double helix of DNA."
    },
    {
      question: "What 1875 Act made sewers and clean water compulsory in British cities? (Prior Topic)",
      answer: "The 1875 Public Health Act."
    },
    {
      question: "What did John Snow remove in 1854 to stop cholera? (Prior Topic)",
      answer: "The handle of the Broad Street water pump."
    },
    {
      question: "Who published the Germ Theory in 1861? (Prior Topic)",
      answer: "Louis Pasteur."
    }
  ],

  // ==========================================
  // KEY TOPIC 5: THE WESTERN FRONT (1914–1918)
  // ==========================================
  lesson_5_1: [
    {
      question: "What epidemiological study by Richard Doll and Austin Bradford Hill in 1950 proved the link between smoking and lung cancer? (Last Lesson)",
      answer: "The British Doctors' Study (tracking 40,000 doctors over several years)."
    },
    {
      question: "What 2007 legislation banned smoking in all enclosed public work and leisure spaces across England? (Last Lesson)",
      answer: "The 2007 Health Act (Smoking Ban)."
    },
    {
      question: "What 2016 law forced cigarette manufacturers to sell cigarettes in standardised sludge-brown boxes with graphic health warnings? (Last Lesson)",
      answer: "Standardised / Plain Packaging legislation."
    },
    {
      question: "What miracle antibiotic did Fleming discover in 1928, purified by Florey and Chain in the 1940s? (Last Week)",
      answer: "Penicillin."
    },
    {
      question: "On what date was the National Health Service (NHS) launched? (Last Week)",
      answer: "5 July 1948."
    },
    {
      question: "What was the first synthetic 'magic bullet' discovered by Paul Ehrlich in 1909? (Prior Topic)",
      answer: "Salvarsan 606."
    },
    {
      question: "In 1895, Wilhelm Röntgen discovered X-rays. Why was this immediately recognized as a vital surgical breakthrough? (Prior Topic)",
      answer: "It allowed doctors to photograph bone fractures and locate foreign metal bullets or shrapnel without invasive exploratory surgery."
    },
    {
      question: "In 1901, Karl Landsteiner discovered the ABO human blood groups. Why was this vital for surgery? (Prior Topic)",
      answer: "It explained why earlier blood transfusions caused fatal agglutination (clumping), enabling safe donor-recipient matching."
    },
    {
      question: "What antiseptic technique did Joseph Lister introduce in 1865 to prevent wound sepsis? (Prior Topic)",
      answer: "Carbolic acid spray and soaked dressings."
    },
    {
      question: "What was the guiding principle of medieval monastic hospitals? (Prior Topic)",
      answer: "'Care not cure'."
    }
  ],

  lesson_5_2: [
    {
      question: "Why did the zig-zag layout of trenches on the Western Front protect British soldiers? (Last Lesson)",
      answer: "It prevented enemy artillery shrapnel and blast waves from travelling down straight lines, and stopped enemy trench-raiders firing down the whole line."
    },
    {
      question: "Why was casualty evacuation particularly agonizing and slow in the Ypres Salient? (Last Lesson)",
      answer: "The low-lying waterlogged clay, destroyed drainage systems, and constant shell-craters turned the ground into a deep sea of mud."
    },
    {
      question: "What strategic battle between July and November 1916 resulted in 57,000 British casualties on its very first day? (Last Lesson)",
      answer: "The Battle of the Somme (1 July 1916)."
    },
    {
      question: "What underground chalk tunnel network in 1917 sheltered 25,000 British troops and contained a complete underground hospital? (Last Lesson)",
      answer: "The Arras cave network (built by New Zealand and British tunnelers)."
    },
    {
      question: "What diagnostic imaging discovered in 1895 by Röntgen was used to locate shrapnel in wounded soldiers? (Last Week)",
      answer: "X-rays."
    },
    {
      question: "Who discovered the ABO blood groups in 1901? (Last Week)",
      answer: "Karl Landsteiner."
    },
    {
      question: "What miracle antibiotic was discovered by Fleming in 1928? (Prior Topic)",
      answer: "Penicillin."
    },
    {
      question: "What chemical did Joseph Lister introduce in 1865 to kill surgical microbes? (Prior Topic)",
      answer: "Carbolic acid."
    },
    {
      question: "Who published the Germ Theory in 1861? (Prior Topic)",
      answer: "Louis Pasteur."
    },
    {
      question: "Who proved the circulation of the blood in 1628? (Prior Topic)",
      answer: "William Harvey."
    }
  ],

  lesson_5_3: [
    {
      question: "What parasite transmitted trench fever to British soldiers on the Western Front? (Last Lesson)",
      answer: "Body lice (Pediculus humanus) living in the seams of woolen uniforms."
    },
    {
      question: "What two mandatory preventative measures did the British Army introduce to combat trench foot? (Last Lesson)",
      answer: "Whale oil rubdowns and mandatory clean dry sock inspections twice daily, alongside duckboards in trenches."
    },
    {
      question: "What psychological trauma caused by relentless artillery bombardment was initially treated as cowardice or malingering? (Last Lesson)",
      answer: "Shell shock (Neurasthenia / combat fatigue)."
    },
    {
      question: "What lethal poison gas, first used by Germany at Second Ypres in April 1915, caused suffocation and fluid in the lungs? (Last Lesson)",
      answer: "Chlorine gas."
    },
    {
      question: "Why were trenches designed with a zig-zag pattern rather than straight lines? (Last Week)",
      answer: "To contain artillery blast waves and prevent enfilade rifle fire down the trench."
    },
    {
      question: "In which Belgian salient did deep clay mud make casualty evacuation almost impossible? (Last Week)",
      answer: "The Ypres Salient."
    },
    {
      question: "What machine invented in 1895 allowed surgeons to locate bullets in soldiers without exploratory cutting? (Prior Topic)",
      answer: "X-ray machines."
    },
    {
      question: "What did Karl Landsteiner discover in 1901 that made blood transfusions possible? (Prior Topic)",
      answer: "The ABO blood groups."
    },
    {
      question: "What was the first magic bullet, discovered by Paul Ehrlich in 1909? (Prior Topic)",
      answer: "Salvarsan 606."
    },
    {
      question: "Who developed the antiseptic carbolic spray in 1865? (Prior Topic)",
      answer: "Joseph Lister."
    }
  ],

  lesson_5_4: [
    {
      question: "Why did the introduction of the steel Brodie helmet in 1915 dramatically reduce fatal head injuries? (Last Lesson)",
      answer: "It deflected downwards-falling high-explosive artillery shrapnel and flying debris, reducing head wounds by over 70%."
    },
    {
      question: "What lethal anaerobic infection flourished in deep shrapnel wounds contaminated with manured Belgian soil? (Last Lesson)",
      answer: "Gas gangrene (caused by Clostridium bacteria in fertilised farmland)."
    },
    {
      question: "What oily blistering gas introduced in 1917 burned skin and caused internal airway blisters? (Last Lesson)",
      answer: "Mustard gas."
    },
    {
      question: "What parasite spread trench fever causing severe joint and leg pain? (Last Week)",
      answer: "Body lice."
    },
    {
      question: "What preventative measures stopped trench foot among British soldiers? (Last Week)",
      answer: "Whale oil rubdowns, regular dry sock changes, and wooden duckboards."
    },
    {
      question: "Why did the zig-zag layout of trenches save lives during artillery shelling? (Last Week)",
      answer: "It localized shell bursts and prevented shrapnel travelling down the whole trench."
    },
    {
      question: "What imaging technology discovered in 1895 located shrapnel before surgery? (Prior Topic)",
      answer: "X-rays."
    },
    {
      question: "Who discovered ABO blood groups in 1901? (Prior Topic)",
      answer: "Karl Landsteiner."
    },
    {
      question: "What miracle antibiotic discovered in 1928 was NOT available during World War One? (Prior Topic)",
      answer: "Penicillin."
    },
    {
      question: "What chemical did Joseph Lister use in 1865 to prevent wound sepsis? (Prior Topic)",
      answer: "Carbolic acid."
    }
  ],

  lesson_5_5: [
    {
      question: "In the RAMC Chain of Evacuation, which frontline medical post was situated just behind the front line to give immediate first aid? (Last Lesson)",
      answer: "The Regimental Aid Post (RAP)."
    },
    {
      question: "In the Chain of Evacuation, which vital station performed immediate life-saving surgery before men were sent to Base Hospitals? (Last Lesson)",
      answer: "The Casualty Clearing Station (CCS)."
    },
    {
      question: "What volunteer organization of female motor ambulance drivers transported casualties from dressing stations to CCSs? (Last Lesson)",
      answer: "The FANY (First Aid Nursing Yeomanry)."
    },
    {
      question: "What large medical facility located near French coastal ports (like Étaples) provided long-term rehabilitation or hospital ships to Britain? (Last Lesson)",
      answer: "The Base Hospital."
    },
    {
      question: "What protective equipment introduced in 1915 reduced fatal head wounds by 70%? (Last Week)",
      answer: "The steel Brodie helmet."
    },
    {
      question: "What lethal soil bacterium caused deep flesh wounds to rot and bubble with foul-smelling gas? (Last Week)",
      answer: "Gas gangrene."
    },
    {
      question: "What parasite carried trench fever between frontline soldiers? (Last Week)",
      answer: "Body lice."
    },
    {
      question: "What 1895 discovery allowed military doctors to photograph shrapnel embedded in bone? (Prior Topic)",
      answer: "X-rays (Wilhelm Röntgen)."
    },
    {
      question: "What 1901 discovery allowed blood transfusions to match compatible donors and patients? (Prior Topic)",
      answer: "ABO blood groups (Karl Landsteiner)."
    },
    {
      question: "Who proved the Germ Theory in 1861? (Prior Topic)",
      answer: "Louis Pasteur."
    }
  ],

  lesson_5_6: [
    {
      question: "Why did the Thomas Splint reduce compound femur fracture mortality from 80% to 20% on the Western Front? (Last Lesson)",
      answer: "It stabilized the broken leg and exerted traction, preventing sharp bone ends grinding together, tearing the femoral artery, and causing fatal blood loss and shock."
    },
    {
      question: "What surgical procedure involved cutting away all dead, infected, and damaged tissue from an open shrapnel wound? (Last Lesson)",
      answer: "Wound debridement."
    },
    {
      question: "What antiseptic chemical solution did Alexis Carrel and Henry Dakin use to continuously irrigate deep wounds? (Last Lesson)",
      answer: "The Carrel-Dakin solution (sterilised buffered sodium hypochlorite / saline)."
    },
    {
      question: "Why were Marie Curie's mobile X-ray vans ('petites Curies') vital near the frontline? (Last Lesson)",
      answer: "They could drive directly to Casualty Clearing Stations to locate bullets and shrapnel before urgent surgery began."
    },
    {
      question: "In the RAMC Chain of Evacuation, what facility performed emergency surgery closest to the front line? (Last Week)",
      answer: "The Casualty Clearing Station (CCS)."
    },
    {
      question: "What volunteer female ambulance corps transported wounded soldiers under fire? (Last Week)",
      answer: "The FANY (First Aid Nursing Yeomanry)."
    },
    {
      question: "What steel helmet was introduced in 1915 to protect soldiers from overhead shrapnel? (Last Week)",
      answer: "The Brodie helmet."
    },
    {
      question: "What imaging technology was discovered by Wilhelm Röntgen in 1895? (Prior Topic)",
      answer: "X-rays."
    },
    {
      question: "What blood group discovery in 1901 by Karl Landsteiner made blood transfusions possible? (Prior Topic)",
      answer: "The ABO blood group system."
    },
    {
      question: "Who was the pioneering antiseptic surgeon who introduced carbolic acid in 1865? (Prior Topic)",
      answer: "Joseph Lister."
    }
  ]
};

console.log('='.repeat(80));
console.log('EXPANDING EDEXCEL MEDICINE DO NOW STARTERS TO 10 QUESTIONS PER LESSON');
console.log('='.repeat(80));

let updatedLessons = 0;
let totalQsAdded = 0;

for (const lesson of med.lessons) {
  if (medicineDoNowMaster[lesson.id]) {
    const masterQs = medicineDoNowMaster[lesson.id];
    lesson.do_now = {
      type: "questions",
      title: "Spaced Retrieval Starter",
      instructions: "Answer these retrieval questions from prior learning. Do not consult new lesson notes.",
      items: masterQs
    };
    updatedLessons++;
    totalQsAdded += masterQs.length;
    console.log(`✅ [${lesson.id}] updated to ${masterQs.length} questions.`);
  } else {
    console.warn(`⚠️ No master Do Now for lesson: ${lesson.id}`);
  }
}

console.log('-'.repeat(80));
console.log(`Updated ${updatedLessons} lessons with ${totalQsAdded} total questions.`);

// Write to public/database.json, database.json, units/edexcel_medicine/data.js, public/units/edexcel_medicine/data.js
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

const rootDbPath = path.resolve(__dirname, '../database.json');
if (fs.existsSync(rootDbPath)) {
  fs.writeFileSync(rootDbPath, JSON.stringify(db, null, 2), 'utf8');
}

const fileContent = 'export default ' + JSON.stringify(med, null, 2) + ';\n';
fs.writeFileSync(path.resolve(__dirname, '../units/edexcel_medicine/data.js'), fileContent, 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../public/units/edexcel_medicine/data.js'), fileContent, 'utf8');

const dataJsonPath = path.resolve(__dirname, '../data/edexcel_medicine.json');
if (fs.existsSync(dataJsonPath)) {
  fs.writeFileSync(dataJsonPath, JSON.stringify(med, null, 2), 'utf8');
}
const pubDataJsonPath = path.resolve(__dirname, '../public/data/edexcel_medicine.json');
if (fs.existsSync(pubDataJsonPath)) {
  fs.writeFileSync(pubDataJsonPath, JSON.stringify(med, null, 2), 'utf8');
}

console.log('Successfully wrote to all Medicine files on disk!');
console.log('='.repeat(80));

