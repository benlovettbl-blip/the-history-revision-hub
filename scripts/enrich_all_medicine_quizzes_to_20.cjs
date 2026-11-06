/**
 * Dedicated Enrichment Script: Enrich All 26 Edexcel Medicine Lessons to 20 Quiz Questions
 * Standard: Edexcel GCSE (9-1) History Paper 1: Medicine in Britain, c1250-present and The British sector of the Western Front, 1914-18
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT_DIR, 'units', 'edexcel_medicine', 'data.js');

// Load canonical data
let raw = fs.readFileSync(DATA_PATH, 'utf8');
const transformed = raw.replace(/export\s+default\s+data;?/, 'medData = data;');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(transformed, sandbox);
const medData = sandbox.medData;

if (!medData || !medData.lessons) {
  console.error('Failed to load medData.lessons');
  process.exit(1);
}

console.log(`Loaded ${medData.lessons.length} lessons from edexcel_medicine.`);

// The 10 Additional Questions for each lesson (Questions 11 to 20)
const NEW_QUESTIONS = {
  // =========================================================================
  // KEY TOPIC 1: MEDICINE IN MEDIEVAL ENGLAND, c1250-c1500
  // =========================================================================
  lesson_1_1: [
    {
      question: "Which religious practice involved self-inflicted whipping in public to appease God's anger during epidemics?",
      options: ["Flagellation", "Pilgrimage", "Excommunication", "Tithe payment"],
      answer: "Flagellation",
      explanation: "Flagellants whipped themselves publicly to atone for sins and demonstrate penitence to God."
    },
    {
      question: "Which Roman Catholic sacrament was administered by priests to ensure a dying patient's soul entered heaven?",
      options: ["Extreme Unction (Last Rites)", "Confirmation", "Holy Orders", "Matrimony"],
      answer: "Extreme Unction (Last Rites)",
      explanation: "Medieval priests administered Last Rites to cleanse sins before death, prioritizing spiritual salvation over biological cure."
    },
    {
      question: "Why did the medieval Catholic Church actively promote the anatomical and physiological writings of Galen?",
      options: ["Galen believed in a single, supreme Creator who designed the human body with purpose", "Galen was a Christian bishop in Rome", "Galen proved that disease was purely biological", "Galen rejected all herbal remedies"],
      answer: "Galen believed in a single, supreme Creator who designed the human body with purpose",
      explanation: "Galen's monotheistic belief in intelligent design aligned perfectly with Catholic Christian theology."
    },
    {
      question: "What was the 'Royal Touch' (touching for the King’s Evil) believed to cure in medieval England?",
      options: ["Scrofula (a form of tuberculosis causing neck swellings)", "The Black Death", "Leprosy", "Broken bones"],
      answer: "Scrofula (a form of tuberculosis causing neck swellings)",
      explanation: "Monarchs were believed to possess divine healing powers granted by God to cure scrofula."
    },
    {
      question: "Which rare planetary conjunction did scholars at the University of Paris claim corrupted the earth's atmosphere in 1345?",
      options: ["Saturn, Jupiter, and Mars in Aquarius", "Venus and Mercury in Leo", "The Moon and Sun in Gemini", "Mars and Neptune in Taurus"],
      answer: "Saturn, Jupiter, and Mars in Aquarius",
      explanation: "Astrologers believed the rare alignment of three planets in March 1345 generated toxic, disease-causing air."
    },
    {
      question: "What physical object containing holy relics of saints did medieval Christians touch to seek miraculous cures?",
      options: ["Reliquaries", "Astrolabes", "Matulas", "Herbals"],
      answer: "Reliquaries",
      explanation: "Reliquaries housed bones, clothing, or hair of holy saints, believed to channel divine healing grace."
    },
    {
      question: "What happened to the English friar Roger Bacon around 1277 for advocating scientific experimentation over Church dogma?",
      options: ["He was imprisoned by Church authorities", "He was appointed Archbishop of Canterbury", "He was executed at the stake", "He was knighted by the King"],
      answer: "He was imprisoned by Church authorities",
      explanation: "Roger Bacon was imprisoned for questioning received theological dogma and promoting independent scientific observation."
    },
    {
      question: "Where did medieval monks grow medicinal plants such as sage, rosemary, and wormwood?",
      options: ["The monastery herb garden (herbarium)", "The church belfry", "The royal palace courtyard", "Local public market stalls"],
      answer: "The monastery herb garden (herbarium)",
      explanation: "Monasteries maintained dedicated herb gardens (herbaria) to supply infirmaries with medicinal plants."
    },
    {
      question: "In medieval universities, why did professor-physicians read from Galen’s books during human dissections rather than dissecting themselves?",
      options: ["Physicians were high-status academic gentlemen who considered manual cutting beneath them", "Dissections were illegal in all European cities", "Physicians could not read Latin", "Barber-surgeons held doctorates in philosophy"],
      answer: "Physicians were high-status academic gentlemen who considered manual cutting beneath them",
      explanation: "University professors read ancient Latin texts from a chair while barber-surgeons performed the manual cutting."
    },
    {
      question: "What was believed to happen if a physician performed bloodletting when the moon was in an unfavourable zodiac sign?",
      options: ["The patient would bleed uncontrollably or die", "The fleam would break", "The blood would turn black", "The surgeon would be excommunicated"],
      answer: "The patient would bleed uncontrollably or die",
      explanation: "Physicians consulted the Zodiac Man chart to avoid bleeding body parts governed by the current planetary alignment."
    }
  ],

  lesson_1_2: [
    {
      question: "Which of the four humours was linked to autumn, earth, and the spleen?",
      options: ["Black Bile (Melancholic)", "Yellow Bile (Choleric)", "Phlegm (Phlegmatic)", "Blood (Sanguine)"],
      answer: "Black Bile (Melancholic)",
      explanation: "Black bile was associated with earth, cold and dry qualities, autumn, and the spleen."
    },
    {
      question: "Which of the four humours was associated with fire, summer, and being hot and dry?",
      options: ["Yellow Bile (Cholera)", "Blood", "Phlegm", "Black Bile"],
      answer: "Yellow Bile (Cholera)",
      explanation: "Yellow bile was linked to fire, summer, hot and dry qualities, and the gall bladder."
    },
    {
      question: "What ethical pledge established by ancient Greek physicians bound doctors to do no harm to patients?",
      options: ["The Hippocratic Oath", "The Galenic Code", "The Charter of Salerno", "The Canon of Medicine"],
      answer: "The Hippocratic Oath",
      explanation: "The Hippocratic Oath established professional ethical standards, emphasizing patient welfare and confidentiality."
    },
    {
      question: "According to Galen, through which internal organ did food pass to be transformed into blood?",
      options: ["The Liver", "The Heart", "The Lungs", "The Stomach"],
      answer: "The Liver",
      explanation: "Galen incorrectly taught that digested food was converted into dark venous blood inside the liver."
    },
    {
      question: "What was the 'rete mirabile' that Galen incorrectly claimed existed at the base of the human brain?",
      options: ["A fine network of blood vessels found in ungulates (hoofed animals) but absent in humans", "A chamber that produced cerebrospinal fluid", "A third eye gland", "A valve controlling saliva"],
      answer: "A fine network of blood vessels found in ungulates (hoofed animals) but absent in humans",
      explanation: "Galen dissected oxen and pigs, incorrectly assuming the rete mirabile existed in human brains."
    },
    {
      question: "How did a medieval physician use a glass 'matula' to diagnose humoural imbalances?",
      options: ["By inspecting the colour, density, smell, and sediment of a patient's urine", "By listening to the heart rhythm", "By measuring blood pressure", "By holding hot steam over wounds"],
      answer: "By inspecting the colour, density, smell, and sediment of a patient's urine",
      explanation: "A matula was a glass flask used to examine urine against charts correlating colour and sediment with humours."
    },
    {
      question: "What small, sweet-smelling item did wealthy medieval people hold to their noses to ward off miasma in crowded streets?",
      options: ["A pomander", "A leek root", "A silver crucifix", "A wax seal"],
      answer: "A pomander",
      explanation: "Pomanders were perforated containers filled with spices and herbs carried to neutralize bad air (miasma)."
    },
    {
      question: "According to Hippocrates, what clinical method was essential for tracking the progress of an acute illness?",
      options: ["Bedside clinical observation and recording symptom changes daily", "Consulting astrology books", "Praying to St Anthony", "Taking a cold water bath"],
      answer: "Bedside clinical observation and recording symptom changes daily",
      explanation: "Hippocrates emphasized observing and recording symptoms to anticipate 'crisis days' in fevers."
    },
    {
      question: "Why did Galen’s anatomical writings state that the human lower jaw consisted of two separate bones?",
      options: ["He had dissected dogs and apes whose jawbones are split, rather than human cadavers", "He relied on ancient Egyptian mummies", "He examined broken battle skeletons", "He had poor eyesight"],
      answer: "He had dissected dogs and apes whose jawbones are split, rather than human cadavers",
      explanation: "Because human dissection was forbidden in pagan Rome, Galen dissected animals and assumed human anatomy was identical."
    },
    {
      question: "How did Galen suggest treating a patient suffering from a fever that made them hot and dry?",
      options: ["Treating with opposites: cold and wet foods like cucumber and cool barley water", "Administering hot spices like pepper", "Bleeding until unconscious", "Wrapping in wool blankets by a fire"],
      answer: "Treating with opposites: cold and wet foods like cucumber and cool barley water",
      explanation: "Galen's Theory of Opposites prescribed remedies possessing the opposite qualities of the humour in excess."
    }
  ],

  lesson_1_3: [
    {
      question: "What sharp, leaf-shaped metal surgical blade was used by medieval practitioners to open a vein for bloodletting?",
      options: ["A fleam (or lancet)", "A scalpel", "A cautery iron", "A bone saw"],
      answer: "A fleam (or lancet)",
      explanation: "A fleam was a small, pointed blade tapped into veins to draw measured quantities of blood."
    },
    {
      question: "What was 'cupping' as practiced in medieval medicine?",
      options: ["Placing a heated glass cup over scratched skin to draw blood through a vacuum", "Drinking boiled herbal water from a silver cup", "Measuring urine output in cups", "Pouring melted wax onto burns"],
      answer: "Placing a heated glass cup over scratched skin to draw blood through a vacuum",
      explanation: "Heated cups created suction over small skin incisions to draw out supposed bad humours."
    },
    {
      question: "What was the purpose of administering an 'emetic' like scammony to a medieval patient?",
      options: ["To induce vomiting to clear the stomach of excess yellow bile", "To relieve pain during amputation", "To induce deep sleep", "To increase appetite"],
      answer: "To induce vomiting to clear the stomach of excess yellow bile",
      explanation: "Emetics provoked violent vomiting to purge the upper digestive tract of imbalanced humours."
    },
    {
      question: "What complex medieval universal antidote contained up to 70 ingredients, including snake flesh and opium?",
      options: ["Theriac", "Mithridatium", "Aqua Vitae", "Laudanum"],
      answer: "Theriac",
      explanation: "Theriac was a celebrated multi-ingredient herbal electuary used as a panacea against poisons and plague."
    },
    {
      question: "What was the 'Regimen Sanitatis Salernitanum'?",
      options: ["A guide to healthy living covering diet, exercise, sleep, and hygiene", "A law banning bloodletting in monasteries", "A tax on imported medicinal spices", "A prayer manual for lepers"],
      answer: "A guide to healthy living covering diet, exercise, sleep, and hygiene",
      explanation: "The Regimen Sanitatis provided lifestyle rules to maintain humoural balance through diet, rest, and fresh air."
    },
    {
      question: "Why was leeching (hirudotherapy) preferred over venesection for delicate or elderly patients?",
      options: ["It withdrew blood gradually and painlessly without a violent cut", "It was performed free of charge", "Leeches injected chemical antibiotics", "It was mandated by the Pope"],
      answer: "It withdrew blood gradually and painlessly without a violent cut",
      explanation: "Leeches removed blood slowly and produced an anaesthetic effect, making it gentler than opening a large vein."
    },
    {
      question: "What did medieval physicians use hot irons for during surgical procedures?",
      options: ["Cauterising open wounds and stumps to seal bleeding blood vessels", "Sterilising surgical instruments", "Testing patient consciousness", "Branding infected patients"],
      answer: "Cauterising open wounds and stumps to seal bleeding blood vessels",
      explanation: "Red-hot cautery irons were pressed against bleeding tissue to coagulate blood and seal severed vessels."
    },
    {
      question: "What did medieval physicians believe would happen if a patient did not regularly purge their digestive tract with laxatives?",
      options: ["Rotting food in the intestines would produce deadly poisonous vapours (miasma)", "The stomach would burst", "The blood would turn yellow", "The liver would stop working"],
      answer: "Rotting food in the intestines would produce deadly poisonous vapours (miasma)",
      explanation: "Medieval doctors believed retained waste putrefied inside the body, producing internal noxious vapours."
    },
    {
      question: "Which of the following herbal ingredients was commonly steeped in wine or vinegar to treat headaches and fevers?",
      options: ["Willow bark", "Poppy seeds", "Hemlock", "Deadly nightshade"],
      answer: "Willow bark",
      explanation: "Willow bark contained salicin (natural precursor to aspirin) and was used to reduce fever and pain."
    },
    {
      question: "Why did widespread bleeding and violent purging often hasten a medieval patient's death?",
      options: ["It caused severe dehydration, shock, and lowered the body's immune resistance", "It caused immediate heart attacks", "It poisoned the kidneys with bile", "It made patients allergic to food"],
      answer: "It caused severe dehydration, shock, and lowered the body's immune resistance",
      explanation: "Repeated blood loss and diarrhea severely weakened already malnourished or feverish patients."
    }
  ],

  lesson_1_4: [
    {
      question: "How long did training take for a university-educated physician at Oxford or Cambridge in medieval England?",
      options: ["Between 7 and 10 years of Latin lecture reading", "6 months of hospital apprenticeship", "2 years of surgery practice", "4 years of military service"],
      answer: "Between 7 and 10 years of Latin lecture reading",
      explanation: "Physicians completed long academic degrees focused on debating Latin texts by Galen, Hippocrates, and Avicenna."
    },
    {
      question: "Why could only royalty and wealthy merchants afford to employ university-trained physicians?",
      options: ["Physicians charged exorbitant consultation fees for their rare elite status", "The King made it illegal for peasants to see doctors", "Physicians lived exclusively inside monasteries", "There were only three physicians in all of Europe"],
      answer: "Physicians charged exorbitant consultation fees for their rare elite status",
      explanation: "There were fewer than 100 qualified physicians in 14th-century England, making their services very expensive."
    },
    {
      question: "What did the red-and-white striped pole outside a barber-surgeon's shop historically symbolise?",
      options: ["Bloody bandages and white tourniquets used during bloodletting", "Red and white wine sold to numb pain", "The colours of the royal family", "The colours of the Barber-Surgeons Guild"],
      answer: "Bloody bandages and white tourniquets used during bloodletting",
      explanation: "The pole represented the wooden rod grasped by patients, with white and blood-stained bandages wrapped around it."
    },
    {
      question: "Which manual tasks were routinely carried out by medieval barber-surgeons?",
      options: ["Pulling teeth, setting simple fractures, lancing boils, and shaving hair", "Writing Latin medical treatises", "Performing heart surgery", "Administering chemotherapy"],
      answer: "Pulling teeth, setting simple fractures, lancing boils, and shaving hair",
      explanation: "Barber-surgeons handled practical external body work: extractions, minor incisions, and bone-setting."
    },
    {
      question: "What was the primary business of a medieval apothecary?",
      options: ["Mixing, storing, and selling herbal potions, ointments, and theriac", "Performing eye surgery", "Delivering babies", "Inspecting hospital drains"],
      answer: "Mixing, storing, and selling herbal potions, ointments, and theriac",
      explanation: "Apothecaries prepared medicines from herbs, minerals, and spices according to traditional recipes."
    },
    {
      question: "Who provided the vast majority of everyday healthcare for sick medieval peasants in rural villages?",
      options: ["Local women, wise women, and family members within the household", "University-trained physicians", "Royal surgeons", "Travelling apothecaries"],
      answer: "Local women, wise women, and family members within the household",
      explanation: "Women maintained traditional knowledge of home remedies, herbal teas, and simple nursing for their communities."
    },
    {
      question: "Why were medieval hospitals designed with patient beds facing the chapel altar?",
      options: ["So bedridden patients could see and hear daily Catholic Mass without moving", "To prevent patients escaping at night", "To catch morning sunlight for warmth", "To allow surgeons to operate under holy light"],
      answer: "So bedridden patients could see and hear daily Catholic Mass without moving",
      explanation: "Hospitals were spiritual institutions; viewing the elevation of the Host was considered vital for healing the soul."
    },
    {
      question: "Which of the following patients would be turned away from a medieval monastic hospital?",
      options: ["A person with a known contagious disease or infectious terminal illness", "An elderly destitute beggar", "A travelling pilgrim", "An impoverished widow"],
      answer: "A person with a known contagious disease or infectious terminal illness",
      explanation: "Monastic hospitals focused on shelter and hospitality, strictly excluding contagious or infectious cases."
    },
    {
      question: "What famous London hospital was established in 1123 to provide care for the sick poor?",
      options: ["St Bartholomew’s Hospital", "Guy’s Hospital", "The Royal London Hospital", "St George’s Hospital"],
      answer: "St Bartholomew’s Hospital",
      explanation: "St Bartholomew's was founded by Rahere in 1123 and remains London's oldest operating hospital."
    },
    {
      question: "What were 'lazar houses' in medieval England?",
      options: ["Isolated hostels established outside town walls to house leprosy sufferers", "Medical training colleges in London", "Warehouses storing apothecary herbs", "Private clinics for wealthy merchants"],
      answer: "Isolated hostels established outside town walls to house leprosy sufferers",
      explanation: "Lazar houses segregated lepers outside town gates to prevent contagion and comply with biblical isolation laws."
    }
  ],

  lesson_1_5: [
    {
      question: "In what month and year did the Black Death first reach England at the Dorset port of Melcombe Regis (Weymouth)?",
      options: ["June 1348", "August 1345", "September 1351", "April 1349"],
      answer: "June 1348",
      explanation: "The plague arrived on a merchant ship from Gascony docking at Melcombe Regis in June 1348."
    },
    {
      question: "What was the name of the plague variety that attacked the lungs and spread directly through coughing droplets?",
      options: ["Pneumonic plague", "Bubonic plague", "Septicaemic plague", "Cutaneous plague"],
      answer: "Pneumonic plague",
      explanation: "Pneumonic plague infected the respiratory system and was spread person-to-person through coughing."
    },
    {
      question: "What bacterium, unknown until 1894, was the biological cause of the Black Death?",
      options: ["Yersinia pestis", "Mycobacterium tuberculosis", "Vibrio cholerae", "Staphylococcus aureus"],
      answer: "Yersinia pestis",
      explanation: "Yersinia pestis is the rod-shaped bacterium that lives in the gut of rat fleas."
    },
    {
      question: "What common treatment did medieval people apply to lanced buboes in an attempt to draw out plague poison?",
      options: ["Plucking the feathers from a live chicken and strapping it to the swelling", "Pouring boiling water over the limbs", "Applying crushed diamonds", "Injecting wine into the veins"],
      answer: "Plucking the feathers from a live chicken and strapping it to the swelling",
      explanation: "The 'Vicary method' involved strapping a plucked chicken to buboes, believing the bird would absorb the venom."
    },
    {
      question: "What proportion of England’s total population is estimated to have died during the Black Death epidemic of 1348–1350?",
      options: ["Between 30% and 45% (approximately one-third to nearly half)", "Less than 5%", "Exactly 10%", "Over 90%"],
      answer: "Between 30% and 45% (approximately one-third to nearly half)",
      explanation: "Historians estimate 1.5 to 2 million people died out of an estimated pre-plague population of 4 to 5 million."
    },
    {
      question: "What order did King Edward III send to the Mayor of London in April 1349 regarding public streets?",
      options: ["To clear rotting human filth, dung, and entrails from the streets to stop foul air", "To demolish all wooden houses", "To execute stray dogs and cats", "To close all Christian churches"],
      answer: "To clear rotting human filth, dung, and entrails from the streets to stop foul air",
      explanation: "Edward III believed the stench of garbage and human excrement created miasma that worsened the plague."
    },
    {
      question: "What emergency measures were taken at East Smithfield outside London's city walls in 1348?",
      options: ["Large communal burial trenches were dug to bury hundreds of plague victims daily", "A stone quarantine castle was built", "A new medical university was opened", "A naval blockade was assembled"],
      answer: "Large communal burial trenches were dug to bury hundreds of plague victims daily",
      explanation: "Churchyards quickly filled, forcing the Bishop of London to purchase land at East Smithfield for emergency mass graves."
    },
    {
      question: "How did local authorities in the town of Gloucester attempt to protect themselves against the Black Death in 1348?",
      options: ["They shut their gates to people travelling from infected areas like Bristol", "They set fire to the town square", "They forced all citizens to bathe daily", "They built an underground sewer"],
      answer: "They shut their gates to people travelling from infected areas like Bristol",
      explanation: "Gloucester attempted local quarantine by barring refugees from Bristol, though the plague still broke through."
    },
    {
      question: "What law was passed by Parliament in 1351 to prevent surviving peasants from demanding higher wages after the Black Death?",
      options: ["The Statute of Labourers", "The Poor Law", "The Act of Settlement", "The Magna Carta"],
      answer: "The Statute of Labourers",
      explanation: "The 1351 Statute of Labourers capped peasant wages at pre-plague levels, provoking deep class resentment."
    },
    {
      question: "Why did the Black Death weaken the spiritual authority of the Catholic Church in England?",
      options: ["The Church could not stop the plague, and many terrified priests abandoned their parishioners", "The Pope converted to Islam", "Monasteries were converted into prisons", "The King abolished all church taxes"],
      answer: "The Church could not stop the plague, and many terrified priests abandoned their parishioners",
      explanation: "When God did not respond to prayers and clergy died in large numbers or fled, public confidence in Church protection fell."
    }
  ],

  // =========================================================================
  // KEY TOPIC 2: THE MEDICAL RENAISSANCE IN ENGLAND, c1500-c1700
  // =========================================================================
  lesson_2_1: [
    {
      question: "What core intellectual principle of Renaissance Humanism challenged medieval scholasticism?",
      options: ["Questioning received dogma and returning to original classical texts ('ad fontes')", "Accepting Galen without question", "Banning all scientific experiments", "Translating texts exclusively into Latin"],
      answer: "Questioning received dogma and returning to original classical texts ('ad fontes')",
      explanation: "Humanists sought authentic Greek texts and emphasized critical observation rather than accepting medieval church interpretations."
    },
    {
      question: "In what year did King Charles II grant a Royal Charter to formally incorporate the Royal Society of London?",
      options: ["1662", "1543", "1628", "1700"],
      answer: "1662",
      explanation: "The Royal Society received its official royal charter from King Charles II in July 1662."
    },
    {
      question: "What is the Latin motto of the Royal Society, meaning 'Take nobody's word for it'?",
      options: ["Nullius in verba", "Carpe diem", "Veni vidi vici", "Dulce et decorum est"],
      answer: "Nullius in verba",
      explanation: "Nullius in verba expressed their determination to verify all scientific hypotheses through experimental proof."
    },
    {
      question: "What was the name of the world's first peer-reviewed scientific journal, published by the Royal Society from 1665?",
      options: ["Philosophical Transactions", "The Lancet", "The British Medical Journal", "Nova Scientia"],
      answer: "Philosophical Transactions",
      explanation: "Edited by Henry Oldenburg, Philosophical Transactions allowed scientists across Europe to read and challenge new experiments."
    },
    {
      question: "Which English scientist published 'Micrographia' in 1665, featuring detailed drawings of fleas and cork cells seen under a microscope?",
      options: ["Robert Hooke", "Isaac Newton", "Thomas Sydenham", "William Harvey"],
      answer: "Robert Hooke",
      explanation: "Robert Hooke's Micrographia demonstrated the power of compound microscopes to reveal previously invisible details."
    },
    {
      question: "Which Dutch tradesman developed powerful single-lens microscopes that revealed 'animalcules' (micro-organisms) in water in the 1670s?",
      options: ["Antonie van Leeuwenhoek", "Jan Swammerdam", "Christiaan Huygens", "Johannes Gutenberg"],
      answer: "Antonie van Leeuwenhoek",
      explanation: "Van Leeuwenhoek discovered bacteria and protozoa, sending his observations to the Royal Society."
    },
    {
      question: "Why did the invention of movable metal type printing (c.1440) accelerate medical communication across Europe?",
      options: ["It allowed identical copies of books with precise anatomical drawings to be distributed cheaply without hand-copying errors", "It made all books free to the public", "It translated books into English automatically", "It eliminated censorship by the Church"],
      answer: "It allowed identical copies of books with precise anatomical drawings to be distributed cheaply without hand-copying errors",
      explanation: "Printed books preserved intricate woodcut diagrams and allowed scientists to critique identical editions simultaneously."
    },
    {
      question: "What private scientific interest of King Charles II demonstrated royal enthusiasm for early science in the 1660s?",
      options: ["He maintained a personal chemical laboratory in Whitehall Palace", "He built an astronomical observatory on his royal yacht", "He performed brain surgery on court nobles", "He outlawed traditional apothecaries"],
      answer: "He maintained a personal chemical laboratory in Whitehall Palace",
      explanation: "Charles II was fascinated by alchemy and chemistry, conducting experiments in his private palace laboratory."
    },
    {
      question: "Why did the scientific revolution of the 16th and 17th centuries have little immediate impact on the health of ordinary people?",
      options: ["New discoveries corrected anatomy and physiology but did not yet provide effective cures or germ understanding", "Most ordinary people were forbidden from seeing doctors", "The Royal Society banned the sale of medicines", "Barber-surgeons refused to read English"],
      answer: "New discoveries corrected anatomy and physiology but did not yet provide effective cures or germ understanding",
      explanation: "Understanding that the heart pumped blood did not cure smallpox or plague, so traditional treatments persisted."
    },
    {
      question: "What dark superstitious practice peaked in 17th-century England alongside early scientific discoveries?",
      options: ["Witchcraft persecutions and witch trials led by figures like Matthew Hopkins", "Burying coins in churchyards", "Refusing to drink clean water", "Burning university libraries"],
      answer: "Witchcraft persecutions and witch trials led by figures like Matthew Hopkins",
      explanation: "Belief in malevolent spirits, devils, and witches remained widespread during the Civil War era."
    }
  ],

  lesson_2_2: [
    {
      question: "What prestigious nickname was bestowed upon Thomas Sydenham due to his focus on bedside clinical observation?",
      options: ["The English Hippocrates", "The British Galen", "The Father of Surgery", "The King's Physician"],
      answer: "The English Hippocrates",
      explanation: "Sydenham was called 'The English Hippocrates' because he revived clinical bedside observation over textbook theory."
    },
    {
      question: "What was the title of Thomas Sydenham's celebrated 1676 medical textbook?",
      options: ["Observationes Medicae", "De Motu Cordis", "De Fabrica", "Compendiosa"],
      answer: "Observationes Medicae",
      explanation: "Observationes Medicae (Medical Observations) became the standard textbook for physicians for two centuries."
    },
    {
      question: "How did Sydenham categorize diseases differently from traditional humoural physicians?",
      options: ["He treated diseases as distinct, separate species with specific characteristics, like a botanist classifying plants", "He claimed all illnesses were caused by bad blood alone", "He divided diseases by the patient's zodiac sign", "He argued disease did not exist"],
      answer: "He treated diseases as distinct, separate species with specific characteristics, like a botanist classifying plants",
      explanation: "Sydenham argued diseases were external entities with predictable symptoms, rather than unique personal humoural imbalances."
    },
    {
      question: "What revolutionary treatment did Sydenham prescribe for patients suffering from smallpox fevers?",
      options: ["Cool therapy: keeping the room cold, drinking cold liquids, and removing heavy blankets", "Sweating the patient in heavy wool blankets beside a hot coal fire", "Bleeding the patient three times daily", "Feeding the patient red-coloured foods"],
      answer: "Cool therapy: keeping the room cold, drinking cold liquids, and removing heavy blankets",
      explanation: "Sydenham broke with tradition by rejecting the suffocating 'heat treatment' for smallpox, saving many lives."
    },
    {
      question: "What imported South American bark containing quinine did Sydenham prescribe to cure malarial fevers (agues)?",
      options: ["Cinchona bark (Peruvian bark)", "Willow bark", "Cinnamon bark", "Oak bark"],
      answer: "Cinchona bark (Peruvian bark)",
      explanation: "Cinchona bark contained quinine, one of the first specific chemical treatments for malaria."
    },
    {
      question: "What painkilling preparation combining opium and alcohol did Sydenham popularize in England?",
      options: ["Laudanum", "Ether", "Theriac", "Chloroform"],
      answer: "Laudanum",
      explanation: "Sydenham developed a reliable liquid tincture of opium dissolved in sherry wine, known as laudanum."
    },
    {
      question: "What condition did Sydenham treat effectively using iron tonics (iron filings steeped in wine)?",
      options: ["Anaemia ('green sickness' or chlorosis)", "Gout", "Smallpox", "Broken limbs"],
      answer: "Anaemia ('green sickness' or chlorosis)",
      explanation: "Sydenham recognized that iron compounds improved pale, weak patients suffering from what we now know as anaemia."
    },
    {
      question: "Which two childhood illnesses did Sydenham accurately distinguish as distinct clinical conditions?",
      options: ["Measles and scarlet fever", "Cholera and typhoid", "Polio and rickets", "Smallpox and chickenpox"],
      answer: "Measles and scarlet fever",
      explanation: "By carefully recording symptoms, Sydenham proved scarlet fever and measles were entirely separate diseases."
    },
    {
      question: "What famous advice did Sydenham give to young medical students regarding how to learn medicine?",
      options: ["Go to the bedside of the sick and observe the patient directly", "Read Galen twenty times in Latin", "Dissect one animal every day", "Spend five years in an apothecary shop"],
      answer: "Go to the bedside of the sick and observe the patient directly",
      explanation: "Sydenham believed book learning was useless without direct observation of how diseases affected real human bodies."
    },
    {
      question: "What was a major limitation in Sydenham's medical understanding?",
      options: ["He did not know micro-organisms caused disease and still accepted that miasma caused epidemics", "He refused to examine female patients", "He could not read Latin", "He was banned from practicing medicine"],
      answer: "He did not know micro-organisms caused disease and still accepted that miasma caused epidemics",
      explanation: "Despite his brilliant bedside observations, Sydenham lived before germ theory and still blamed toxic atmospheric vapours."
    }
  ],

  lesson_2_3: [
    {
      question: "In what year did Andreas Vesalius publish his monumental anatomy book 'De Humani Corporis Fabrica'?",
      options: ["1543", "1628", "1665", "1492"],
      answer: "1543",
      explanation: "De Humani Corporis Fabrica (On the Fabric of the Human Body) was published in Basel in 1543."
    },
    {
      question: "At which prestigious European university was Vesalius appointed Professor of Surgery and Anatomy at age 23?",
      options: ["University of Padua", "University of Paris", "Oxford University", "University of Bologna"],
      answer: "University of Padua",
      explanation: "The Venetian Republic's University of Padua was the leading centre for empirical medical dissection."
    },
    {
      question: "How did Vesalius's method of teaching dissection differ radically from medieval professors?",
      options: ["He performed the dissection with his own hands on the table while explaining findings directly", "He only dissected live animals", "He lectured from a high chair without touching the body", "He used plastic anatomical models"],
      answer: "He performed the dissection with his own hands on the table while explaining findings directly",
      explanation: "Vesalius descended from the high academic chair, wielding the knife himself and showing students actual organs."
    },
    {
      question: "Which Italian Renaissance workshop provided the master artists who drew Vesalius's magnificent anatomical plates?",
      options: ["Titian's workshop in Venice", "Leonardo da Vinci's studio in Florence", "Michelangelo's workshop in Rome", "Raphael's academy in Urbino"],
      answer: "Titian's workshop in Venice",
      explanation: "Artists from Titian's workshop (notably Jan van Calcar) produced lifelike, muscular anatomical woodcuts."
    },
    {
      question: "Approximately how many anatomical errors made by Galen did Vesalius correct in 'The Fabrica'?",
      options: ["Over 200", "Exactly 5", "None at all", "Over 5,000"],
      answer: "Over 200",
      explanation: "Vesalius proved Galen made over 200 anatomical mistakes by demonstrating the difference between human and ape anatomy."
    },
    {
      question: "What Galenic error regarding the human breastbone (sternum) did Vesalius disprove?",
      options: ["Galen claimed the sternum had 7 segments (like an ape), but Vesalius proved humans have only 3", "Galen claimed humans had no sternum", "Galen claimed the sternum was made of cartilage only", "Galen claimed the sternum was located in the spine"],
      answer: "Galen claimed the sternum had 7 segments (like an ape), but Vesalius proved humans have only 3",
      explanation: "Vesalius showed the adult human sternum consists of three fused bones, disproving Galen's 7-part ape model."
    },
    {
      question: "What did Vesalius prove regarding the central wall (septum) dividing the left and right ventricles of the heart?",
      options: ["The septum is solid and has no invisible pores for blood to pass through", "The septum is made of bone", "The septum is perforated like a sieve", "The heart has no septum"],
      answer: "The septum is solid and has no invisible pores for blood to pass through",
      explanation: "Vesalius searched for Galen's supposed microscopic pores in the septum and declared they did not exist."
    },
    {
      question: "What was the name of the condensed, affordable manual Vesalius published alongside 'The Fabrica' for medical students?",
      options: ["The Epitome", "The Canon", "The Micrographia", "The Regimen"],
      answer: "The Epitome",
      explanation: "The Epitome was an accessible, low-cost summary with fold-out plates intended for everyday student use."
    },
    {
      question: "How did Vesalius's anatomical work reach English surgeons in 1545?",
      options: ["Thomas Geminus plagiarized his copperplate engravings in 'Compendiosa Totius Anatomie Delineatio'", "Vesalius moved to London to teach King Henry VIII", "The Pope sent copies to all English monasteries", "The Royal Society translated it into English"],
      answer: "Thomas Geminus plagiarized his copperplate engravings in 'Compendiosa Totius Anatomie Delineatio'",
      explanation: "Geminus copied Vesalius's illustrations, making Renaissance anatomical engravings widely accessible to English barber-surgeons."
    },
    {
      question: "Why did traditional physicians like Vesalius's former teacher Jacobus Sylvius attack him fiercely?",
      options: ["They believed Galen could never be wrong and claimed human bodies must have changed since Roman times", "They accused Vesalius of being a Protestant spy", "Vesalius charged too much for his books", "Vesalius refused to speak Latin"],
      answer: "They believed Galen could never be wrong and claimed human bodies must have changed since Roman times",
      explanation: "Diehard Galenists defended ancient authority by claiming human anatomy had degenerated since antiquity."
    }
  ],

  lesson_2_4: [
    {
      question: "In what year did William Harvey publish his breakthrough treatise 'De Motu Cordis' (On the Motion of the Heart)?",
      options: ["1628", "1543", "1665", "1603"],
      answer: "1628",
      explanation: "De Motu Cordis et Sanguinis in Animalibus was published in Frankfurt in 1628."
    },
    {
      question: "Which royal monarchs employed William Harvey as their personal court physician?",
      options: ["King James I and King Charles I", "Queen Elizabeth I and King Henry VIII", "King Charles II and King James II", "Queen Anne and King George I"],
      answer: "King James I and King Charles I",
      explanation: "Harvey was court physician to both Stuart kings, James I and Charles I."
    },
    {
      question: "What mathematical calculation proved to Harvey that blood must circulate continuously through the body?",
      options: ["The heart pumped more blood in an hour (over 40 gallons) than the entire weight of a human body", "The body contained exactly 2 litres of blood", "A man produced 10 pints of blood each day from food", "The pulse beat 100 times every second"],
      answer: "The heart pumped more blood in an hour (over 40 gallons) than the entire weight of a human body",
      explanation: "Harvey realized the liver could not possibly manufacture so much blood constantly; it had to be the same blood circulating."
    },
    {
      question: "Why did Harvey experiment on cold-blooded animals such as frogs, toads, and snakes?",
      options: ["Their hearts beat much more slowly, allowing him to observe chamber contractions clearly", "Cold-blooded animals have no blood", "Warm-blooded animal dissection was illegal", "Frogs have transparent skin"],
      answer: "Their hearts beat much more slowly, allowing him to observe chamber contractions clearly",
      explanation: "In fast-beating mammalian hearts, motion was a blur; cold-blooded hearts contracted slowly enough to see systole and diastole."
    },
    {
      question: "How did Harvey prove that veins carry blood in only one direction toward the heart?",
      options: ["By applying a tourniquet to an arm and using his finger to push blood backward against one-way pocket valves", "By cutting arteries with hot glass", "By injecting ink into dead frogs", "By listening with a stethoscope"],
      answer: "By applying a tourniquet to an arm and using his finger to push blood backward against one-way pocket valves",
      explanation: "Harvey pushed blood backward in surface veins, proving pocket valves (discovered by Fabricius) prevented backflow."
    },
    {
      question: "What industrial machine did Harvey compare the human heart to in his lectures?",
      options: ["A mechanical pump (such as a fire pump or mine water pump)", "A steam locomotive", "A waterwheel clock", "A printing press"],
      answer: "A mechanical pump (such as a fire pump or mine water pump)",
      explanation: "Harvey conceptualized the heart as a muscle acting as a mechanical force pump."
    },
    {
      question: "What crucial microscopic connection between arteries and veins was Harvey unable to see with the naked eye?",
      options: ["Capillaries", "Vena cava", "Aorta", "Pulmonary veins"],
      answer: "Capillaries",
      explanation: "Harvey deduced capillaries logically, but they were only seen microscopically in 1661 by Marcello Malpighi."
    },
    {
      question: "What disproved Galenic idea did Harvey shatter regarding the movement of blood?",
      options: ["That blood moved back and forth in an ebb-and-flow tide like ocean waves", "That blood was liquid", "That arteries carried blood", "That veins had valves"],
      answer: "That blood moved back and forth in an ebb-and-flow tide like ocean waves",
      explanation: "Galen taught blood ebbed and flowed through veins and arteries; Harvey proved it circulated in a one-way closed circuit."
    },
    {
      question: "How did contemporaries react immediately to Harvey’s publication of 'De Motu Cordis'?",
      options: ["Many ridiculed him as a madman ('circulator'), and his London private practice declined", "He was immediately awarded a knighthood", "Every physician in Europe abandoned bloodletting overnight", "He was appointed Archbishop"],
      answer: "Many ridiculed him as a madman ('circulator'), and his London private practice declined",
      explanation: "Conservative doctors mocked Harvey's radical theory, and many patients feared consulting an eccentric physician."
    },
    {
      question: "Why did Harvey's discovery of blood circulation have little immediate practical impact on treating the sick?",
      options: ["Doctors still had no effective blood transfusions or medicines to exploit the discovery, and continued bloodletting", "Harvey refused to teach students", "King Charles I banned blood research", "Harvey destroyed his research notes"],
      answer: "Doctors still had no effective blood transfusions or medicines to exploit the discovery, and continued bloodletting",
      explanation: "Knowing blood circulated did not cure diseases, so physicians paradoxically continued using bloodletting for another century."
    }
  ],

  lesson_2_5: [
    {
      question: "Approximately how many Londoners died during the Great Plague of 1665?",
      options: ["Approximately 100,000 people (around 20% of London's population)", "Less than 1,000", "Exactly 5,000", "Over 500,000"],
      answer: "Approximately 100,000 people (around 20% of London's population)",
      explanation: "The 1665 epidemic claimed an estimated 100,000 lives in London within a few dreadful months."
    },
    {
      question: "What was painted on the doors of infected houses in London during the 1665 Great Plague?",
      options: ["A red cross and the words 'Lord have mercy upon us'", "A black skull and crossbones", "A white feather", "A royal coat of arms"],
      answer: "A red cross and the words 'Lord have mercy upon us'",
      explanation: "The Lord Mayor ordered red crosses marked on infected houses, with armed watchmen stationed outside for 40 days."
    },
    {
      question: "Who were the 'Searchers of the Dead' employed by London parishes in 1665?",
      options: ["Elderly women appointed to inspect corpses and identify whether plague caused death", "Medical doctors trained at Cambridge", "Soldiers from the Tower of London", "Church choirboys"],
      answer: "Elderly women appointed to inspect corpses and identify whether plague caused death",
      explanation: "Searchers examined dead bodies to report plague deaths for the official weekly Bills of Mortality."
    },
    {
      question: "What disastrous order by the Lord Mayor of London actually worsened the plague in 1665?",
      options: ["Ordering the mass killing of over 40,000 dogs and 200,000 cats", "Banning all tobacco smoking", "Closing the River Thames to boats", "Forcing citizens to drink beer"],
      answer: "Ordering the mass killing of over 40,000 dogs and 200,000 cats",
      explanation: "Killing dogs and cats eliminated the natural predators of black rats, allowing plague-carrying rat fleas to multiply."
    },
    {
      question: "Why did schoolchildren at Eton and Westminster be forced to smoke tobacco daily during the 1665 plague?",
      options: ["Smoke was believed to be an effective antidote that purged and repelled infectious miasma", "It was a punishment for skipping school", "It cured coughing", "Tobacco was made free by the King"],
      answer: "Smoke was believed to be an effective antidote that purged and repelled infectious miasma",
      explanation: "Burning tobacco created thick fumes believed to neutralize airborne plague miasma."
    },
    {
      question: "What prominent group fled London immediately when the plague broke out in the spring of 1665?",
      options: ["King Charles II, the royal court, parliament, and wealthy physicians", "The city watchmen", "The chimney sweeps", "The grave diggers"],
      answer: "King Charles II, the royal court, parliament, and wealthy physicians",
      explanation: "The wealthy escaped to country estates, leaving poorer Londoners and brave apothecaries behind."
    },
    {
      question: "What weekly published documents recorded births, deaths, and causes of death across London parishes in 1665?",
      options: ["The Bills of Mortality", "The Domesday Ledger", "The London Gazette", "The Parish Register of Sins"],
      answer: "The Bills of Mortality",
      explanation: "The Bills of Mortality tracked plague deaths weekly, illustrating the terrifying rise of the epidemic."
    },
    {
      question: "What did plague doctors wear to protect themselves against miasma when visiting victims?",
      options: ["Waxed leather coats, leather gloves, and a bird-like mask filled with sweet herbs", "A white linen surgeon's gown", "A knight's chainmail suit", "Ordinary civilian clothes"],
      answer: "Waxed leather coats, leather gloves, and a bird-like mask filled with sweet herbs",
      explanation: "The beak held aromatic herbs to filter miasma, and waxed leather prevented bodily fluids soaking into clothes."
    },
    {
      question: "What historical misconception claims that the 1665 Great Plague was ended by the Great Fire of London in September 1666?",
      options: ["The plague had already subsided in winter 1665 before the Fire, and the fire only destroyed the city centre, not the infected slums", "The Fire occurred ten years later", "Plague continued for fifty years after the Fire", "The Fire did not touch London"],
      answer: "The plague had already subsided in winter 1665 before the Fire, and the fire only destroyed the city centre, not the infected slums",
      explanation: "Cold winter weather had already killed off the rat fleas by late 1665; the Fire mostly burned commercial areas inside the walls."
    },
    {
      question: "What continuity in medical treatment between 1348 and 1665 demonstrates how little therapeutics had advanced?",
      options: ["Physicians still relied on bloodletting, purging, strapping toads to buboes, and fleeing bad air", "Antibiotics were used in both periods", "Hospitals vaccinated all citizens", "Microscopes were used to detect bacteria"],
      answer: "Physicians still relied on bloodletting, purging, strapping toads to buboes, and fleeing bad air",
      explanation: "Treatment for the plague in 1665 remained virtually identical to 1348 due to continued reliance on humoural and miasma theories."
    }
  ],

  // =========================================================================
  // KEY TOPIC 3: c1700-c1900 (18TH AND 19TH CENTURY MEDICINE)
  // =========================================================================
  lesson_3_1: [
    {
      question: "What disproved scientific theory claimed that micro-organisms generated spontaneously from decaying organic matter?",
      options: ["Spontaneous generation", "Germ theory", "Miasma theory", "Cell theory"],
      answer: "Spontaneous generation",
      explanation: "Spontaneous generation claimed rot created microbes; Pasteur proved microbes in the air caused rot."
    },
    {
      question: "In what year did Louis Pasteur publish his breakthrough Germ Theory (*Théorie des germes*)?",
      options: ["1861", "1796", "1848", "1884"],
      answer: "1861",
      explanation: "Pasteur published his Germ Theory in 1861 after demonstrating microbes spoiled wine and beer."
    },
    {
      question: "What uniquely shaped glassware did Pasteur design to prove airborne microbes caused fermentation?",
      options: ["Swan-neck flasks", "Test tubes", "Petri dishes", "Beakers"],
      answer: "Swan-neck flasks",
      explanation: "The curved neck trapped falling airborne dust and bacteria, keeping sterile broth clear unless the flask was tipped."
    },
    {
      question: "What solid substance derived from seaweed did Robert Koch use to grow pure bacterial colonies in Petri dishes?",
      options: ["Agar-agar jelly", "Gelatine", "Paraffin wax", "Beeswax"],
      answer: "Agar-agar jelly",
      explanation: "Fanny Hesse suggested agar-agar because it stayed firm at human body temperature, unlike animal gelatine."
    },
    {
      question: "What chemical technique did Robert Koch introduce to make specific bacteria visible under the microscope?",
      options: ["Staining bacteria with industrial aniline dyes (like methyl violet)", "Boiling bacteria in acid", "Freezing bacteria in ice", "Exposing bacteria to direct sunlight"],
      answer: "Staining bacteria with industrial aniline dyes (like methyl violet)",
      explanation: "Chemical dyes bonded to bacterial cell walls, making previously transparent micro-organisms clearly visible."
    },
    {
      question: "Which deadly human disease bacterium did Robert Koch identify and isolate in 1882?",
      options: ["Tuberculosis (Mycobacterium tuberculosis)", "Smallpox", "Polio", "Malaria"],
      answer: "Tuberculosis (Mycobacterium tuberculosis)",
      explanation: "Koch's discovery of the tuberculosis bacillus in 1882 won him international acclaim and the Nobel Prize."
    },
    {
      question: "What are 'Koch’s Postulates'?",
      options: ["Four rigorous scientific rules required to prove that a specific micro-organism causes a specific disease", "Four surgical rules for amputating limbs", "Rules for designing hospital wards", "Guidelines for milk pasteurization"],
      answer: "Four rigorous scientific rules required to prove that a specific micro-organism causes a specific disease",
      explanation: "Koch's Postulates established the experimental gold standard for linking a pathogen directly to a disease."
    },
    {
      question: "What did Pasteur accidentally discover in 1879 when Charles Chamberland injected chickens with old, stale cholera cultures?",
      options: ["Weakened (attenuated) microbes created immunity without killing the animal", "Old microbes became ten times deadlier", "Chickens cannot catch cholera", "Bacteria turn into fungi over time"],
      answer: "Weakened (attenuated) microbes created immunity without killing the animal",
      explanation: "The chickens survived and were immune when injected with fresh cholera, discovering vaccine attenuation."
    },
    {
      question: "Which young boy bitten by a rabid dog in 1885 was successfully saved by Louis Pasteur’s experimental rabies vaccine?",
      options: ["Joseph Meister", "James Phipps", "Albert Alexander", "James Greenlees"],
      answer: "Joseph Meister",
      explanation: "Pasteur injected Meister with increasingly potent rabies spinal cord tissue, completely preventing the fatal disease."
    },
    {
      question: "How did national rivalry between France and Germany accelerate scientific medical breakthroughs between 1871 and 1900?",
      options: ["Following the Franco-Prussian War (1870–71), French and German governments heavily funded Pasteur and Koch to prove national superiority", "Both countries banned scientific trade", "Scientists were conscripted into the infantry", "Research was kept completely secret"],
      answer: "Following the Franco-Prussian War (1870–71), French and German governments heavily funded Pasteur and Koch to prove national superiority",
      explanation: "National prestige after 1871 fueled competitive state funding and laboratory resources for Pasteur and Koch."
    }
  ],

  lesson_3_2: [
    {
      question: "What dangerous preventative practice against smallpox was introduced to England by Lady Mary Wortley Montagu in 1721?",
      options: ["Inoculation (variolation) with live smallpox pus", "Drinking boiling milk", "Cowpox vaccination", "Isolating patients in cellars"],
      answer: "Inoculation (variolation) with live smallpox pus",
      explanation: "Inoculation used smallpox scabs, but carried a serious risk of causing fatal smallpox or starting an epidemic."
    },
    {
      question: "What traditional rural observation in Gloucestershire led Edward Jenner to investigate smallpox immunity?",
      options: ["Dairy milkmaids who caught mild cowpox never caught the disfiguring, deadly smallpox", "Farm horses were immune to disease", "Cider drinkers avoided smallpox", "Sheep farmers had clear skin"],
      answer: "Dairy milkmaids who caught mild cowpox never caught the disfiguring, deadly smallpox",
      explanation: "Local folklore held that cowpox blisters on milkmaids' hands gave lifelong protection from smallpox."
    },
    {
      question: "What was the name of the 8-year-old boy whom Jenner vaccinated with cowpox in May 1796?",
      options: ["James Phipps", "Joseph Meister", "Albert Alexander", "Thomas Sydenham"],
      answer: "James Phipps",
      explanation: "Jenner took cowpox from milkmaid Sarah Nelmes and inoculated James Phipps, who later resisted smallpox."
    },
    {
      question: "What is the Latin origin of the word 'vaccination' coined by Edward Jenner?",
      options: ["Vacca (the Latin word for cow)", "Vaccinus (meaning blood)", "Vincere (to conquer)", "Vapor (steam)"],
      answer: "Vacca (the Latin word for cow)",
      explanation: "Jenner named the procedure vaccination after vacca, the Latin word for cow."
    },
    {
      question: "What was the title of Jenner’s self-published 1798 medical report describing his vaccination trials?",
      options: ["An Inquiry into the Causes and Effects of the Variolae Vaccinae", "Observationes Medicae", "De Motu Cordis", "The Sanitary Condition"],
      answer: "An Inquiry into the Causes and Effects of the Variolae Vaccinae",
      explanation: "After the Royal Society rejected his paper without more cases, Jenner self-published his landmark Inquiry in 1798."
    },
    {
      question: "Why did professional smallpox inoculators violently oppose Jenner’s cowpox vaccine?",
      options: ["Inoculation was a highly lucrative private business that lost money when safe vaccination spread", "They believed cowpox was deadlier", "They were banned from London", "They wanted to protect dairy cows"],
      answer: "Inoculation was a highly lucrative private business that lost money when safe vaccination spread",
      explanation: "Inoculators charged wealthy families hefty fees and feared being put out of business by free vaccination."
    },
    {
      question: "Which famous political caricaturist published a satirical print in 1802 showing vaccinated patients sprouting cow heads?",
      options: ["James Gillray", "William Hogarth", "George Cruikshank", "John Leech"],
      answer: "James Gillray",
      explanation: "Gillray's famous Anti-Vaccine Society cartoon depicted panicked patients growing horns and miniature cows."
    },
    {
      question: "How much financial support did the British Parliament grant Jenner in 1802 and 1807 to establish vaccination clinics?",
      options: ["A total of £30,000 (£10,000 in 1802 and £20,000 in 1807)", "£500", "£1 million", "No financial aid at all"],
      answer: "A total of £30,000 (£10,000 in 1802 and £20,000 in 1807)",
      explanation: "Parliament recognized Jenner's achievement with generous grants totaling £30,000 to fund vaccination rollouts."
    },
    {
      question: "In what year did the British government make infant smallpox vaccination compulsory by law?",
      options: ["1853", "1796", "1802", "1884"],
      answer: "1853",
      explanation: "Vaccination was made compulsory for infants in 1853, with penalties enforced strictly from 1871."
    },
    {
      question: "What was the major scientific limitation of Jenner's work in 1798?",
      options: ["He could not explain how or why vaccination worked because viruses and antibodies were completely unknown", "He used infected needles", "Vaccines only lasted two days", "He only tested animals"],
      answer: "He could not explain how or why vaccination worked because viruses and antibodies were completely unknown",
      explanation: "Jenner discovered an empirical technique, but lacked the microbiology knowledge to explain viral immunity."
    }
  ],

  lesson_3_3: [
    {
      question: "Why were early 19th-century hospital wards widely feared and referred to as 'gateways to death'?",
      options: ["Cramped, unventilated wards and dirty bed linen spread lethal secondary infections like hospital gangrene", "Patients were fed poisonous food", "Surgeons were all untrained students", "Hospitals were built on burial pits"],
      answer: "Cramped, unventilated wards and dirty bed linen spread lethal secondary infections like hospital gangrene",
      explanation: "Poor sanitation, overcrowding, and lack of antiseptic knowledge meant entering hospital carried a high risk of fatal sepsis."
    },
    {
      question: "What British hospital at Scutari was Florence Nightingale sent to reform during the Crimean War in 1854?",
      options: ["The Barrack Hospital at Scutari", "St Thomas's Hospital", "Balaclava Naval Infirmary", "The Royal Free Hospital"],
      answer: "The Barrack Hospital at Scutari",
      explanation: "Nightingale led a team of 38 nurses to the filthy Barrack Hospital in Scutari (modern Istanbul)."
    },
    {
      question: "What major sanitary defect lay directly beneath the Barrack Hospital at Scutari?",
      options: ["Blocked sewers, cesspools, and contaminated drinking water pipes", "An unexploded Russian mine", "A stagnant river", "A chemical dye factory"],
      answer: "Blocked sewers, cesspools, and contaminated drinking water pipes",
      explanation: "The hospital had been built directly over defective sewers, poisoning the air and drinking supply with cholera and typhus."
    },
    {
      question: "To what percentage did Nightingale's sanitary reforms reduce the mortality rate at Scutari Hospital?",
      options: ["From over 40% down to approximately 2%", "From 90% down to 80%", "From 50% down to 35%", "From 15% down to 10%"],
      answer: "From over 40% down to approximately 2%",
      explanation: "Clean linen, scrubbing wards, opening windows, and boiling drinking water dropped mortality to ~2% within months."
    },
    {
      question: "What was the 'pavilion plan' promoted by Nightingale in 'Notes on Hospitals' (1859)?",
      options: ["Hospital wards built in separate blocks with large, high windows on opposite walls to maximize fresh airflow", "Circular underground wards to keep patients warm", "Tents pitched in open fields", "Multi-storey skyscrapers with elevators"],
      answer: "Hospital wards built in separate blocks with large, high windows on opposite walls to maximize fresh airflow",
      explanation: "Pavilion wards featured cross-ventilation, separate pavilions to isolate infection, and wipeable surfaces."
    },
    {
      question: "What famous nursing training institution did Nightingale establish at St Thomas's Hospital in London in 1860?",
      options: ["The Nightingale Training School for Nurses", "The Royal College of Surgeons", "The Scutari Nursing Academy", "The Queen's Medical Institute"],
      answer: "The Nightingale Training School for Nurses",
      explanation: "Funded by public donations to the Nightingale Fund, this school professionalized nursing as a respected career."
    },
    {
      question: "What hotel facility did Mary Seacole establish near Balaclava during the Crimean War?",
      options: ["The British Hotel", "The Florence Nightingale Hostel", "The Sevastopol Inn", "The Red Cross Rest Home"],
      answer: "The British Hotel",
      explanation: "Seacole built the British Hotel using her own funds to provide meals, shelter, and medical care to soldiers."
    },
    {
      question: "What traditional herbal background gave Mary Seacole expertise in treating cholera and dysentery?",
      options: ["Her mother was a Jamaican 'doctress' who practiced herbal medicine and hygiene in Kingston", "She graduated from Oxford University", "She studied surgery in Paris", "She was an apothecary apprentice in London"],
      answer: "Her mother was a Jamaican 'doctress' who practiced herbal medicine and hygiene in Kingston",
      explanation: "Seacole learned Creole herbal remedies, hygiene, and nursing from her mother in the West Indies."
    },
    {
      question: "How did Mary Seacole treat wounded soldiers during the Siege of Sevastopol?",
      options: ["She rode directly onto active battlefields carrying medical supplies, food, and bandages under fire", "She remained in London organizing charity galas", "She operated only from a naval battleship", "She managed supply logistics in Paris"],
      answer: "She rode directly onto active battlefields carrying medical supplies, food, and bandages under fire",
      explanation: "Seacole was famous for treating casualties under fire on the battlefield, earning the deep affection of soldiers."
    },
    {
      question: "How did Florence Nightingale and Mary Seacole permanently transform British hospital care?",
      options: ["They transformed nursing into a respected, disciplined, professional medical career for women", "They proved doctors were completely unnecessary", "They abolished all military hospitals", "They banned medicines in favour of prayer"],
      answer: "They transformed nursing into a respected, disciplined, professional medical career for women",
      explanation: "Their work elevated nurses from drunken, untrained caricatures (like Dickens's Betsy Prig) into skilled medical professionals."
    }
  ],

  lesson_3_4: [
    {
      question: "What Scottish surgeon discovered the anaesthetic properties of chloroform in November 1847?",
      options: ["James Young Simpson", "Joseph Lister", "Robert Liston", "John Snow"],
      answer: "James Young Simpson",
      explanation: "Simpson and his colleagues inhaled chloroform fumes at his dining table in Edinburgh, collapsing unconscious."
    },
    {
      question: "What early gas anaesthetic was demonstrated by Horace Wells in 1844, commonly known as 'laughing gas'?",
      options: ["Nitrous oxide", "Carbon dioxide", "Methane", "Hydrogen sulfide"],
      answer: "Nitrous oxide",
      explanation: "Dentist Horace Wells used nitrous oxide for painless tooth extractions, though public demonstrations sometimes failed."
    },
    {
      question: "Why was sulphuric ether (demonstrated by William Morton in 1846) considered risky in operating theatres?",
      options: ["It was highly flammable and irritated patients' lungs, causing severe coughing and vomiting", "It caused permanent memory loss", "It was radioactive", "It stained skin permanently green"],
      answer: "It was highly flammable and irritated patients' lungs, causing severe coughing and vomiting",
      explanation: "Ether vapor could ignite near open gas flames in Victorian theatres and caused choking and lung irritation."
    },
    {
      question: "Which royal figure received chloroform during the birth of Prince Leopold in 1853, making anaesthesia socially acceptable?",
      options: ["Queen Victoria", "Queen Elizabeth I", "Queen Anne", "Princess Alexandra"],
      answer: "Queen Victoria",
      explanation: "Queen Victoria praised 'that blessed chloroform' administered by Dr John Snow, ending religious opposition."
    },
    {
      question: "Why did the period immediately following the discovery of anaesthetics become known as the 'Black Period of Surgery'?",
      options: ["Surgeons attempted deeper, longer operations, leading to catastrophic spikes in fatal gangrene and sepsis", "Anaesthetics were made illegal by Parliament", "All qualified surgeons went on strike", "Operations had to be done in total darkness"],
      answer: "Surgeons attempted deeper, longer operations, leading to catastrophic spikes in fatal gangrene and sepsis",
      explanation: "Without pain, surgeons operated inside deep abdominal cavities, but unwashed hands carried fatal infections deep into patients."
    },
    {
      question: "What chemical did Joseph Lister choose in 1865 to kill bacteria on surgical wounds, inspired by sewage treatment in Carlisle?",
      options: ["Carbolic acid (phenol)", "Bleach", "Vinegar", "Iodine tincture"],
      answer: "Carbolic acid (phenol)",
      explanation: "Lister saw carbolic acid deodorized sewage and killed parasites, testing it on compound fractures."
    },
    {
      question: "Who was the 11-year-old boy whose compound leg fracture was successfully healed by Lister in 1865 without amputation?",
      options: ["James Greenlees", "James Phipps", "Albert Alexander", "Joseph Meister"],
      answer: "James Greenlees",
      explanation: "James Greenlees suffered an open compound fracture; Lister dressed it with carbolic lint and the bone healed without infection."
    },
    {
      question: "In what medical journal did Lister publish his breakthrough antiseptic surgery results in 1867?",
      options: ["The Lancet", "The Times", "Philosophical Transactions", "The British Medical Journal"],
      answer: "The Lancet",
      explanation: "Lister published a series of articles in The Lancet detailing eleven successful antiseptic compound fracture cases."
    },
    {
      question: "Why did many British surgeons initially resist using Lister's carbolic acid spray?",
      options: ["The acidic mist irritated surgeons' eyes and skin, slowed down operations, and challenged the belief that speed was best", "Carbolic acid was too cheap to make a profit", "Lister was convicted of fraud", "The spray caused fires"],
      answer: "The acidic mist irritated surgeons' eyes and skin, slowed down operations, and challenged the belief that speed was best",
      explanation: "Surgeons disliked breathing carbolic fumes and doubted that invisible airborne microbes caused gangrene."
    },
    {
      question: "What major shift occurred in surgical philosophy between the 1870s and 1890s?",
      options: ["A shift from antiseptic surgery (killing germs in wounds) to aseptic surgery (preventing all germs entering the theatre)", "A return to speed-based surgery without anaesthetic", "Abandoning washing hands", "Replacing scalpels with lasers"],
      answer: "A shift from antiseptic surgery (killing germs in wounds) to aseptic surgery (preventing all germs entering the theatre)",
      explanation: "Aseptic surgery sterilized all instruments, gowns, and air beforehand, eliminating the need for harsh carbolic sprays."
    }
  ],

  lesson_3_5: [
    {
      question: "In what year did Asiatic cholera first arrive on British shores at the port of Sunderland?",
      options: ["1831", "1848", "1854", "1875"],
      answer: "1831",
      explanation: "Cholera struck Britain in October 1831 at Sunderland, spreading rapidly along waterways."
    },
    {
      question: "What physical symptom of dehydration caused cholera victims' skin to turn a dark, sunken blue before death?",
      options: ["Severe fluid loss through explosive watery diarrhea ('rice-water stools') and vomiting", "High fevers bursting blood vessels", "Internal bleeding into the stomach", "Chemical poisoning from copper pipes"],
      answer: "Severe fluid loss through explosive watery diarrhea ('rice-water stools') and vomiting",
      explanation: "Extreme fluid loss drained the body of water and electrolytes within hours, giving patients a distinctive blue hue."
    },
    {
      question: "What was the title of Edwin Chadwick's influential 1842 report exposing the links between poverty and filth?",
      options: ["Report on the Sanitary Condition of the Labouring Population", "An Inquiry into the Health of Towns", "The Broad Street Survey", "The Poor Law Amendment"],
      answer: "Report on the Sanitary Condition of the Labouring Population",
      explanation: "Chadwick proved poor sanitation caused epidemic disease, arguing clean water and sewers would reduce poverty rates."
    },
    {
      question: "Why was the First Public Health Act of 1848 largely ineffective across Britain?",
      options: ["It was permissive (voluntary) rather than compulsory, so few town councils spent money on sewers", "It banned clean water supplies", "It applied only to Scotland", "It was vetoed by Queen Victoria"],
      answer: "It was permissive (voluntary) rather than compulsory, so few town councils spent money on sewers",
      explanation: "Town ratepayers objected to paying higher taxes, so most towns ignored the voluntary 1848 recommendations."
    },
    {
      question: "In which London district did Dr John Snow map cholera deaths during the devastating 1854 outbreak?",
      options: ["Soho (around Broad Street)", "Whitechapel", "Westminster", "Kensington"],
      answer: "Soho (around Broad Street)",
      explanation: "Snow mapped over 500 fatal cases in Soho, pinpointing the cluster around the Broad Street communal pump."
    },
    {
      question: "What decisive action did John Snow take in September 1854 to halt the Soho cholera epidemic?",
      options: ["He persuaded the parish guardians to remove the handle from the Broad Street pump", "He poured carbolic acid into the Thames", "He ordered all Soho residents to evacuate", "He vaccinated 1,000 residents"],
      answer: "He persuaded the parish guardians to remove the handle from the Broad Street pump",
      explanation: "Removing the pump handle stopped residents drinking the contaminated water, causing cases to plunge."
    },
    {
      question: "What did excavation of the Broad Street pump reveal was contaminating the well water?",
      options: ["A leaking underground cesspool from an infected baby's home three feet away", "Dead rats in the pipe", "Chemical dye from a brewery", "Lead poisoning"],
      answer: "A leaking underground cesspool from an infected baby's home three feet away",
      explanation: "Soiled nappies washed into an adjacent cesspool had seeped through cracked brickwork directly into the well."
    },
    {
      question: "What environmental crisis during the hot summer of 1858 forced Parliament to fund a new London sewer network?",
      options: ["The Great Stink (the unbearable stench of the polluted River Thames)", "The Great Flood of London", "The Thames Freezing Over", "A massive cholera outbreak inside Parliament"],
      answer: "The Great Stink (the unbearable stench of the polluted River Thames)",
      explanation: "The overwhelming stench of untreated sewage baking in the Thames forced MPs to flee committee rooms and vote funds."
    },
    {
      question: "Which civil engineer designed and constructed London's monumental 1,100-mile intercepting sewer network between 1859 and 1875?",
      options: ["Joseph Bazalgette", "Isambard Kingdom Brunel", "Edwin Chadwick", "Thomas Telford"],
      answer: "Joseph Bazalgette",
      explanation: "Bazalgette built 82 miles of underground brick intercepting conduits that carried waste eastward away from London."
    },
    {
      question: "Why was the Public Health Act of 1875 a decisive turning point in British state medicine?",
      options: ["It made public health duties strictly compulsory for all local councils, requiring clean water, drainage, and medical officers", "It abolished all private doctors", "It made hospital care completely free", "It banned industrial factories"],
      answer: "It made public health duties strictly compulsory for all local councils, requiring clean water, drainage, and medical officers",
      explanation: "The 1875 Act replaced Victorian laissez-faire with legally mandatory local health inspection, clean water, and sanitation."
    }
  ],

  // =========================================================================
  // KEY TOPIC 4: c1900-PRESENT (MODERN MEDICINE)
  // =========================================================================
  lesson_4_1: [
    {
      question: "Which 19th-century Austrian monk discovered the fundamental laws of genetic inheritance through breeding pea plants?",
      options: ["Gregor Mendel", "Louis Pasteur", "Charles Darwin", "Robert Koch"],
      answer: "Gregor Mendel",
      explanation: "Mendel's laws of genetic inheritance were published in 1866 and rediscovered by scientists around 1900."
    },
    {
      question: "Which university lab in Cambridge did Watson and Crick work in when constructing their DNA double-helix model?",
      options: ["The Cavendish Laboratory", "The Dunn School of Pathology", "The Wellcome Trust", "King's College London"],
      answer: "The Cavendish Laboratory",
      explanation: "Watson and Crick solved the molecular structure of DNA while working at Cambridge's Cavendish Laboratory."
    },
    {
      question: "What laboratory technique was used by Rosalind Franklin to capture Photograph 51?",
      options: ["X-ray crystallography (diffraction)", "Electron microscopy", "Ultrasound scanning", "Magnetic resonance"],
      answer: "X-ray crystallography (diffraction)",
      explanation: "Franklin fired X-rays through crystallized DNA fibres, creating diffraction patterns showing the double helix."
    },
    {
      question: "Which colleague of Rosalind Franklin showed Photograph 51 to Watson and Crick without her explicit permission?",
      options: ["Maurice Wilkins", "Ernst Chain", "Howard Florey", "Linus Pauling"],
      answer: "Maurice Wilkins",
      explanation: "Maurice Wilkins showed Franklin's diffraction image to Watson in early 1953, providing the key to the helical structure."
    },
    {
      question: "How many chemical base pairs are contained within the human genome mapped in 2003?",
      options: ["Approximately 3 billion base pairs", "100,000 base pairs", "1 million base pairs", "50 billion base pairs"],
      answer: "Approximately 3 billion base pairs",
      explanation: "The Human Genome Project mapped all 3 billion base pairs across the 23 pairs of human chromosomes."
    },
    {
      question: "What medical application allows doctors to identify if an individual carries a gene mutation for cystic fibrosis or Huntington’s disease?",
      options: ["Genetic screening", "Antibiotic therapy", "Blood transfusion", "Radiotherapy"],
      answer: "Genetic screening",
      explanation: "Genetic testing analyzes DNA samples to detect hereditary disease mutations before symptoms appear."
    },
    {
      question: "What medical technique involves altering or replacing faulty genes inside patient cells to treat genetic disorders?",
      options: ["Gene therapy", "Aseptic surgery", "Chemotherapy", "Acupuncture"],
      answer: "Gene therapy",
      explanation: "Gene therapy uses modified viruses or vectors to insert healthy genetic sequences into patient cells."
    },
    {
      question: "What screening procedure allows IVF embryos to be tested for severe genetic defects before being implanted into the womb?",
      options: ["Pre-implantation Genetic Diagnosis (PGD)", "Ultrasound scanning", "CT scanning", "Stem cell cloning"],
      answer: "Pre-implantation Genetic Diagnosis (PGD)",
      explanation: "PGD screens early IVF embryos, allowing parents carrying fatal genetic mutations to select unaffected embryos."
    },
    {
      question: "Which field of modern genetics studies how lifestyle, diet, and stress turn specific genes on or off without altering DNA code?",
      options: ["Epigenetics", "Bacteriology", "Pharmacology", "Haematology"],
      answer: "Epigenetics",
      explanation: "Epigenetics explores how environmental factors and behaviors chemically modify gene expression."
    },
    {
      question: "What major ethical concern has arisen from advancements in gene editing technologies like CRISPR?",
      options: ["Fears of creating genetically modified 'designer babies' and genetic inequality", "Fears of running out of DNA", "Concerns that DNA tests cause cancer", "Concerns that genetics will replace hospitals"],
      answer: "Fears of creating genetically modified 'designer babies' and genetic inequality",
      explanation: "Gene editing raises ethical boundaries regarding human embryo enhancement versus treating disease."
    }
  ],

  lesson_4_2: [
    {
      question: "Which Austrian biologist discovered the ABO blood groups in 1901, making safe transfusions possible?",
      options: ["Karl Landsteiner", "Paul Ehrlich", "Gerhard Domagk", "Wilhelm Röntgen"],
      answer: "Karl Landsteiner",
      explanation: "Landsteiner identified blood groups A, B, and O, winning the 1930 Nobel Prize for preventing transfusion shock."
    },
    {
      question: "What diagnostic machine was invented by Willem Einthoven in 1903 to record the electrical activity of the heart?",
      options: ["The Electrocardiograph (ECG)", "The Defibrillator", "The Pacemaker", "The Dialysis machine"],
      answer: "The Electrocardiograph (ECG)",
      explanation: "Einthoven's string galvanometer ECG allowed doctors to detect arrhythmias and heart attacks accurately."
    },
    {
      question: "Which imaging technology, developed by Ian Donald in Glasgow in the late 1950s, uses high-frequency sound waves?",
      options: ["Ultrasound scanning", "CT scanning", "MRI scanning", "X-ray radiography"],
      answer: "Ultrasound scanning",
      explanation: "Ian Donald adapted naval sonar technology to produce safe, radiation-free images of unborn babies and organs."
    },
    {
      question: "Who invented the Computed Tomography (CT) scanner in 1972 using funding from the record company EMI?",
      options: ["Godfrey Hounsfield", "Peter Mansfield", "Alexander Fleming", "Maurice Wilkins"],
      answer: "Godfrey Hounsfield",
      explanation: "Hounsfield combined multiple X-ray slices and computers to produce 3D cross-sectional images of the body."
    },
    {
      question: "What diagnostic imaging scanner uses powerful magnetic fields and radio waves to generate detailed images of soft tissues without radiation?",
      options: ["Magnetic Resonance Imaging (MRI)", "X-ray machine", "Fluoroscope", "Mammogram"],
      answer: "Magnetic Resonance Imaging (MRI)",
      explanation: "MRI scanners align hydrogen atoms in water molecules, producing exceptional soft-tissue images of brains and joints."
    },
    {
      question: "What flexible instrument containing fibre-optic glass cables allows surgeons to view the inside of the digestive tract without open surgery?",
      options: ["An endoscope", "A scalpel", "A laparoscope", "A catheter"],
      answer: "An endoscope",
      explanation: "Endoscopes transmit light and video through flexible tubes, allowing minimally invasive internal inspection and biopsies."
    },
    {
      question: "What portable digital monitor introduced in the 1980s empowered diabetic patients to manage their blood sugar at home?",
      options: ["Home blood glucose meters", "Blood pressure cuffs", "Peak flow meters", "Digital stethoscopes"],
      answer: "Home blood glucose meters",
      explanation: "Glucose meters and finger-prick strips let diabetics monitor insulin needs independently without hospital visits."
    },
    {
      question: "In what year did the British government ban smoking in all enclosed public places and workplaces in England?",
      options: ["2007", "1997", "1985", "2015"],
      answer: "2007",
      explanation: "The Health Act 2006 implemented the indoor smoking ban across England on 1 July 2007."
    },
    {
      question: "What major public health epidemic of the 21st century has driven massive increases in Type 2 diabetes and heart disease in Britain?",
      options: ["Obesity and high-sugar/ultra-processed diets", "Smallpox", "Polio", "Tuberculosis"],
      answer: "Obesity and high-sugar/ultra-processed diets",
      explanation: "Sedentary lifestyles and processed foods led to soaring obesity rates, costing the NHS billions annually."
    },
    {
      question: "What visual preventative warning was made mandatory on all tobacco packaging in the UK in 2016?",
      options: ["Plain standardized olive-green packaging with graphic photographic disease warnings", "Bright yellow warning labels", "Tax stamps only", "Black and white filters"],
      answer: "Plain standardized olive-green packaging with graphic photographic disease warnings",
      explanation: "Standardized plain packaging eliminated brand logos and displayed graphic photos of tumors and diseased lungs."
    }
  ],

  lesson_4_3: [
    {
      question: "What term was coined by Paul Ehrlich to describe a chemical drug that destroyed a specific pathogen without harming the host's body cells?",
      options: ["Magic bullet", "Antibiotic", "Vaccine", "Steroid"],
      answer: "Magic bullet",
      explanation: "Ehrlich envisioned chemical 'magic bullets' designed to bind exclusively to microbial receptors."
    },
    {
      question: "What arsenic-based compound, synthesized in 1909 as compound 606 by Ehrlich and Hata, was the first magic bullet?",
      options: ["Salvarsan 606 (Arsphenamine)", "Prontosil", "Penicillin", "Aspirin"],
      answer: "Salvarsan 606 (Arsphenamine)",
      explanation: "Salvarsan 606 cured syphilis by targeting the spirochaete bacterium without killing the human patient."
    },
    {
      question: "What red chemical dye discovered by Gerhard Domagk in 1932 cured lethal streptococcal bacterial infections in mice and his own daughter?",
      options: ["Prontosil", "Methyl violet", "Carbolic acid", "Salvarsan"],
      answer: "Prontosil",
      explanation: "Domagk proved Prontosil killed streptococcus bacteria in blood, pioneering the sulphonamide drug class."
    },
    {
      question: "What influential 1942 social report outlined the creation of a British welfare state to slay the 'Five Giant Evils'?",
      options: ["The Beveridge Report", "The Chadwick Report", "The Dawson Report", "The Royal Commission on Health"],
      answer: "The Beveridge Report",
      explanation: "William Beveridge's 1942 report proposed comprehensive social security, including an NHS, to defeat Disease and Want."
    },
    {
      question: "Who was the post-war Labour Minister of Health who oversaw the founding of the National Health Service in July 1948?",
      options: ["Aneurin Bevan", "Clement Attlee", "William Beveridge", "Herbert Morrison"],
      answer: "Aneurin Bevan",
      explanation: "Aneurin Bevan fought medical opposition to launch the NHS on 5 July 1948."
    },
    {
      question: "What compromise did Aneurin Bevan famously make to persuade senior hospital consultants to join the NHS in 1948?",
      options: ["He allowed consultants to keep their lucrative private patients in NHS hospitals ('stuffed their mouths with gold')", "He doubled their government salaries", "He gave them seats in the House of Lords", "He exempted them from taxes"],
      answer: "He allowed consultants to keep their lucrative private patients in NHS hospitals ('stuffed their mouths with gold')",
      explanation: "Bevan conceded 'pay beds' so consultants could earn private fees alongside their NHS salaries."
    },
    {
      question: "Why did Aneurin Bevan resign from the Labour Cabinet in 1951?",
      options: ["Chancellor Hugh Gaitskell introduced prescription charges for dentures and glasses to fund Korean War spending", "The NHS went completely bankrupt", "The King ordered his dismissal", "He wanted to abolish private clinics"],
      answer: "Chancellor Hugh Gaitskell introduced prescription charges for dentures and glasses to fund Korean War spending",
      explanation: "Bevan resigned on principle when charges breached the NHS founding rule of care free at the point of delivery."
    },
    {
      question: "Which Dutch doctor invented the first artificial kidney dialysis machine in 1943 during Nazi occupation, using sausage skins and a washing machine drum?",
      options: ["Willem Kolff", "Christiaan Barnard", "John Charnley", "Ian Donald"],
      answer: "Willem Kolff",
      explanation: "Kolff improvised the first hemodialysis machine using cellophane sausage casings in occupied Holland."
    },
    {
      question: "Which British orthopaedic surgeon pioneered modern total hip replacement surgery at Wrightington Hospital in the 1960s?",
      options: ["John Charnley", "Harold Gillies", "Hugh Owen Thomas", "Archibald McIndoe"],
      answer: "John Charnley",
      explanation: "Sir John Charnley developed the low-friction polyethylene socket and bone cement hip replacement."
    },
    {
      question: "Which South African surgeon performed the world's first successful human-to-human heart transplant in December 1967?",
      options: ["Christiaan Barnard", "Harvey Cushing", "Terence English", "Alexis Carrel"],
      answer: "Christiaan Barnard",
      explanation: "Barnard transplanted the heart of Denise Darvall into Louis Washkansky at Groote Schuur Hospital in Cape Town."
    }
  ],

  lesson_4_4: [
    {
      question: "In what month and year did Alexander Fleming discover penicillin mould contaminating a Petri dish at St Mary's Hospital, London?",
      options: ["September 1928", "August 1914", "June 1944", "May 1940"],
      answer: "September 1928",
      explanation: "Returning from holiday in September 1928, Fleming noticed Penicillium notatum mould dissolving staphylococcus colonies."
    },
    {
      question: "Why was Alexander Fleming unable to turn penicillin into a practical medical treatment in 1928–1929?",
      options: ["He could not extract or purify the unstable penicillin juice in quantities large enough to treat humans", "He lost the original culture", "The British government banned penicillin", "He believed penicillin was toxic"],
      answer: "He could not extract or purify the unstable penicillin juice in quantities large enough to treat humans",
      explanation: "Fleming was a bacteriologist, not a chemist; penicillin broke down rapidly and he could not isolate the pure active drug."
    },
    {
      question: "Which two Oxford University scientists assembled a team in 1938 to successfully isolate, purify, and test penicillin?",
      options: ["Howard Florey and Ernst Chain", "Watson and Crick", "Ehrlich and Domagk", "Landsteiner and Cushing"],
      answer: "Howard Florey and Ernst Chain",
      explanation: "Australian pathologist Howard Florey and German-Jewish refugee biochemist Ernst Chain led the Oxford research."
    },
    {
      question: "What makeshift equipment did the Oxford team use in their laboratory to culture penicillin mould during wartime shortages?",
      options: ["Hospital bedpans, milk churns, and lemonade bottles", "Copper bathtubs", "Lead barrels", "Glass aquariums"],
      answer: "Hospital bedpans, milk churns, and lemonade bottles",
      explanation: "Biochemist Norman Heatley modified porcelain bedpans and glass bottles to culture the delicate mould."
    },
    {
      question: "What animal experiment in May 1940 proved penicillin was an extraordinary therapeutic antibiotic?",
      options: ["Eight mice were injected with lethal streptococci; four treated with penicillin survived, while four untreated mice died", "Rabbits were cured of rabies", "Monkeys were vaccinated against polio", "Chickens were cured of cholera"],
      answer: "Eight mice were injected with lethal streptococci; four treated with penicillin survived, while four untreated mice died",
      explanation: "The famous mouse trial provided undeniable experimental proof that penicillin destroyed deadly bacteria in living tissue."
    },
    {
      question: "Who was the first human patient treated with purified penicillin in Oxford in February 1941?",
      options: ["Police Constable Albert Alexander", "James Phipps", "James Greenlees", "Joseph Meister"],
      answer: "Police Constable Albert Alexander",
      explanation: "Alexander suffered severe sepsis from a rose thorn scratch; he rallied dramatically until penicillin supplies ran out."
    },
    {
      question: "Where did Florey and Heatley travel in July 1941 to secure mass industrial production of penicillin?",
      options: ["The United States (Peoria, Illinois)", "Canada", "Australia", "Switzerland"],
      answer: "The United States (Peoria, Illinois)",
      explanation: "Because British factories were busy manufacturing munitions, they went to US agricultural labs in Peoria."
    },
    {
      question: "What agricultural byproduct discovered in Peoria, Illinois boosted penicillin yield a thousand-fold?",
      options: ["Corn steep liquor", "Molasses", "Soybean meal", "Beet juice"],
      answer: "Corn steep liquor",
      explanation: "Deep fermentation tanks using corn steep liquor and a mouldy cantaloupe strain enabled industrial mass production."
    },
    {
      question: "How did mass-produced penicillin transform Allied military casualty survival by June 1944 (D-Day)?",
      options: ["Enough penicillin was manufactured to treat every wounded Allied soldier, preventing amputation and sepsis", "It cured shell shock", "It vaccinated troops against malaria", "It cured trench foot"],
      answer: "Enough penicillin was manufactured to treat every wounded Allied soldier, preventing amputation and sepsis",
      explanation: "Penicillin eliminated battlefield wound sepsis, saving an estimated 15% of Allied wounded soldiers who would have died."
    },
    {
      question: "What critical 21st-century medical crisis has arisen from the overuse and overprescription of antibiotics?",
      options: ["Antimicrobial resistance (superbugs like MRSA that resist modern antibiotics)", "Penicillin turning toxic to all humans", "The global extinction of mould", "Bacteria disappearing from the earth"],
      answer: "Antimicrobial resistance (superbugs like MRSA that resist modern antibiotics)",
      explanation: "Overuse in medicine and farming has bred resistant bacterial strains that defeat standard antibiotic treatments."
    }
  ],

  lesson_4_5: [
    {
      question: "Which British epidemiologists published the landmark 1950 British Medical Journal study proving smoking caused lung cancer?",
      options: ["Richard Doll and Austin Bradford Hill", "Watson and Crick", "Fleming and Florey", "Beveridge and Bevan"],
      answer: "Richard Doll and Austin Bradford Hill",
      explanation: "Doll and Bradford Hill surveyed 20 London hospitals, proving lung cancer patients were almost exclusively heavy smokers."
    },
    {
      question: "What was the 'British Doctors Study' (1951–2001) conducted by Doll and Hill?",
      options: ["A 50-year prospective study tracking the smoking habits and mortality of over 40,000 British doctors", "A study on hospital infection", "An evaluation of the NHS budget", "A study on surgeon working hours"],
      answer: "A 50-year prospective study tracking the smoking habits and mortality of over 40,000 British doctors",
      explanation: "Tracking 40,000 doctors over 50 years proved lifelong smokers died an average of 10 years earlier than non-smokers."
    },
    {
      question: "In what year did the British government ban cigarette advertisements from television broadcasting?",
      options: ["1965", "1950", "1985", "2007"],
      answer: "1965",
      explanation: "Commercial television tobacco advertising was prohibited in the UK in 1965 to discourage youth uptake."
    },
    {
      question: "What surgical operation involves removing an entire cancerous lung from a patient?",
      options: ["Pneumonectomy", "Lobectomy", "Tracheostomy", "Mastectomy"],
      answer: "Pneumonectomy",
      explanation: "Pneumonectomy is the complete surgical removal of a diseased lung, while a lobectomy removes one lung lobe."
    },
    {
      question: "What diagnostic procedure uses a thin, flexible tube passed through the mouth to biopsy lung tumours directly?",
      options: ["Bronchoscopy", "Colonoscopy", "Endoscopy", "Angiography"],
      answer: "Bronchoscopy",
      explanation: "A bronchoscope enables respiratory specialists to examine bronchial airways and take tissue biopsies."
    },
    {
      question: "What cancer treatment uses powerful high-energy X-rays to destroy cancer cells and shrink tumours?",
      options: ["Radiotherapy", "Chemotherapy", "Immunotherapy", "Acupuncture"],
      answer: "Radiotherapy",
      explanation: "Radiotherapy uses targeted radiation beams to kill malignant tumor cells while sparing healthy tissue."
    },
    {
      question: "In what year was the legal age for purchasing tobacco in the UK raised from 16 to 18?",
      options: ["2007", "1990", "1997", "2016"],
      answer: "2007",
      explanation: "The minimum legal age for purchasing tobacco was raised to 18 on 1 October 2007 to curb teenage smoking."
    },
    {
      question: "Why was lung cancer so difficult to treat successfully in the 20th century?",
      options: ["Symptoms like coughing and breathlessness often appear only after the tumor has grown and spread (metastasized)", "Lungs cannot heal from incisions", "Radiation does not penetrate the ribcage", "Lungs have no blood supply"],
      answer: "Symptoms like coughing and breathlessness often appear only after the tumor has grown and spread (metastasized)",
      explanation: "Early-stage lung cancer is usually asymptomatic, meaning patients seek medical help only after advanced metastasis."
    },
    {
      question: "What modern robotic radiotherapy system uses computerized robotic arms to target lung tumours with sub-millimetre precision?",
      options: ["CyberKnife", "Da Vinci Robot", "PET scanner", "MRI machine"],
      answer: "CyberKnife",
      explanation: "CyberKnife delivers high-dose stereotactic radiation to lung tumours while adjusting for patient breathing movements."
    },
    {
      question: "What legislation did the UK Parliament propose in 2024 to create a 'smokefree generation'?",
      options: ["Banning anyone born on or after 1 January 2009 from ever legally being sold tobacco products", "Making tobacco possession a felony", "Closing all corner shops", "Banning all imports of paper"],
      answer: "Banning anyone born on or after 1 January 2009 from ever legally being sold tobacco products",
      explanation: "The legislation proposed raising the legal smoking age by one year every year so future generations can never buy tobacco."
    }
  ],

  // =========================================================================
  // KEY TOPIC 5: THE BRITISH SECTOR OF THE WESTERN FRONT, 1914-1918
  // =========================================================================
  lesson_5_1: [
    {
      question: "Why was the town of Ypres of critical strategic importance to the British Army throughout the war?",
      options: ["It defended the overland route to the vital English Channel supply ports of Calais, Dunkirk, and Boulogne", "It was the capital of France", "It possessed major coal reserves", "It was where the German Emperor lived"],
      answer: "It defended the overland route to the vital English Channel supply ports of Calais, Dunkirk, and Boulogne",
      explanation: "If Ypres fell, the German Army would seize the Channel ports, severing the British Army's supply link to England."
    },
    {
      question: "What is a military 'salient', such as the Ypres Salient?",
      options: ["A battlefield bulge projecting into enemy territory, vulnerable to artillery fire from three sides", "A deep underground mine", "A concrete machine gun bunker", "A field hospital with tents"],
      answer: "A battlefield bulge projecting into enemy territory, vulnerable to artillery fire from three sides",
      explanation: "Salients were dangerous tactical positions surrounded on three sides by enemy observation and crossfire."
    },
    {
      question: "What mining technique was used by British tunnelling companies at Hill 60 near Ypres in April 1915?",
      options: ["Digging deep subterranean tunnels and detonating five massive explosive mines beneath the German hilltop", "Digging canals for gunboats", "Drilling oil wells", "Tunneling to Paris"],
      answer: "Digging deep subterranean tunnels and detonating five massive explosive mines beneath the German hilltop",
      explanation: "British and Australian miners tunneled through clay to blow the top off Hill 60, allowing British troops to capture it."
    },
    {
      question: "What chemical weapon was used for the first time by the German Army at the Second Battle of Ypres in April 1915?",
      options: ["Chlorine gas", "Mustard gas", "Phosgene gas", "Nerve gas"],
      answer: "Chlorine gas",
      explanation: "Germany released 168 tons of chlorine gas from cylinders on 22 April 1915, opening a four-mile gap in Allied lines."
    },
    {
      question: "How many casualties did the British Army suffer on the disastrous first day of the Battle of the Somme (1 July 1916)?",
      options: ["57,470 casualties (including 19,240 dead)", "1,000 casualties", "10,000 casualties", "100,000 casualties"],
      answer: "57,470 casualties (including 19,240 dead)",
      explanation: "1 July 1916 remains the bloodiest single day in British military history, with 57,470 casualties by sunset."
    },
    {
      question: "What unique underground medical facility was created in the medieval chalk quarries beneath Arras in 1917?",
      options: ["The underground hospital at Thompson's Cave (holding 700 hospital beds and operating theatres)", "A submarine repair dock", "A royal palace for King George V", "A mobile gas chamber"],
      answer: "The underground hospital at Thompson's Cave (holding 700 hospital beds and operating theatres)",
      explanation: "New Zealand tunnelers linked ancient chalk quarries under Arras into an electric-lit underground hospital complex."
    },
    {
      question: "What weather and terrain conditions made the Third Battle of Ypres (Passchendaele, 1917) notorious for medical evacuations?",
      options: ["Unceasing torrential rain destroyed drainage systems, turning the churned clay into liquid mud where wounded men drowned", "Scorching desert heat", "Frozen blizzards in mountains", "Forest fires"],
      answer: "Unceasing torrential rain destroyed drainage systems, turning the churned clay into liquid mud where wounded men drowned",
      explanation: "Artillery pulverized drainage canals and heavy rain created liquid mud so deep that stretcher-bearers took hours per casualty."
    },
    {
      question: "Why were trenches constructed in zig-zag or traverse patterns rather than straight lines?",
      options: ["To prevent enemy machine-gunners firing down the entire length if they breached the trench, and to contain shell blasts", "To make soldiers walk more slowly", "Because soldiers could not dig straight", "To confuse carrier pigeons"],
      answer: "To prevent enemy machine-gunners firing down the entire length if they breached the trench, and to contain shell blasts",
      explanation: "Traverses stopped enemy raiders enfilading straight trenches and localized explosive shrapnel damage."
    },
    {
      question: "What was the purpose of the 'communication trenches' on the Western Front?",
      options: ["To connect rear support and reserve lines to the front trench, allowing safe movement of troops, rations, and wounded", "To house telegraph operators only", "To store telephone cables", "To bury dead soldiers"],
      answer: "To connect rear support and reserve lines to the front trench, allowing safe movement of troops, rations, and wounded",
      explanation: "Communication trenches allowed soldiers and stretcher-bearers to move to and from the front line under cover."
    },
    {
      question: "Which battle in November 1917 witnessed the first successful mass deployment of tanks and the world’s first mobile blood bank?",
      options: ["The Battle of Cambrai", "The Battle of Mons", "The Battle of the Marne", "The Battle of Loos"],
      answer: "The Battle of Cambrai",
      explanation: "At Cambrai, nearly 500 British tanks punched through the Hindenburg Line while Oswald Robertson set up blood depots."
    }
  ],

  lesson_5_2: [
    {
      question: "What physical condition was caused by standing for prolonged hours in cold, wet, muddy water in frontline trenches?",
      options: ["Trench foot", "Trench fever", "Trench nephritis", "Shell shock"],
      answer: "Trench foot",
      explanation: "Constricted circulation in cold, damp boots caused tissue necrosis, fungal infections, and gangrene."
    },
    {
      question: "What daily routine was made mandatory by British officers to prevent trench foot among infantrymen?",
      options: ["Rubbing whale oil on feet, changing into dry socks twice daily, and inspecting comrades' feet in pairs", "Walking barefoot in mud", "Applying alcohol to wounds", "Soaking feet in hot water daily"],
      answer: "Rubbing whale oil on feet, changing into dry socks twice daily, and inspecting comrades' feet in pairs",
      explanation: "Whale oil waterproofed skin, and mandatory buddy checks ensured men dried their feet and changed socks."
    },
    {
      question: "What tiny insect was proven by researchers in 1918 to be the vector transmitting Trench Fever?",
      options: ["The body louse (Pediculus humanus)", "The flea", "The mosquito", "The horsefly"],
      answer: "The body louse (Pediculus humanus)",
      explanation: "Body lice living in the seams of woolen uniforms excreted bacteria that entered skin through scratching."
    },
    {
      question: "What was the colloquial trench slang term for picking and popping lice and their eggs from uniform seams?",
      options: ["Chatting", "Delousing", "Debridement", "Stand-to"],
      answer: "Chatting",
      explanation: "Soldiers sat together burning lice eggs with candle flames, giving rise to the modern word 'chatting'."
    },
    {
      question: "What were the primary symptoms of Trench Nephritis that affected thousands of British soldiers?",
      options: ["Severe kidney inflammation, albumin in the urine, high blood pressure, and swollen faces", "Loss of teeth", "Bleeding from the ears", "Paralysis of the arms"],
      answer: "Severe kidney inflammation, albumin in the urine, high blood pressure, and swollen faces",
      explanation: "Trench nephritis was an acute kidney inflammation linked to exposure to damp and contaminated water."
    },
    {
      question: "What chemical powder was thrown into trench latrine buckets and shell craters to kill bacteria and reduce foul stench?",
      options: ["Chloride of lime", "Carbolic soap", "Baking soda", "Sulfur powder"],
      answer: "Chloride of lime",
      explanation: "Chloride of lime acted as a disinfectant and deodorant in latrine pits to control disease-carrying flies."
    },
    {
      question: "Why were brown rats (*Rattus norvegicus*) such a terrible psychological and hygiene plague in frontline trenches?",
      options: ["They gorged on decomposing human corpses, grew to the size of cats, and contaminated soldiers' food supplies", "They spread rabies to officers", "They chewed through telephone wires", "They caused structural collapses of parapets"],
      answer: "They gorged on decomposing human corpses, grew to the size of cats, and contaminated soldiers' food supplies",
      explanation: "Corpse rats multiplied in millions, running over sleeping men and spreading filth across food rations."
    },
    {
      question: "What did the British military medical stamp 'NYDN' stand for when soldiers collapsed with acute shell shock?",
      options: ["Not Yet Diagnosed (Nervous)", "Not Yet Declared Normal", "Near Year Death Note", "No Youth Duty Necessary"],
      answer: "Not Yet Diagnosed (Nervous)",
      explanation: "NYDN was stamped on medical charts to avoid early diagnoses of cowardice and differentiate shell shock from physical trauma."
    },
    {
      question: "What proportion of all British hospital admissions on the Western Front was caused by illness and disease rather than enemy bullets or shells?",
      options: ["Approximately 50% to 55%", "Less than 10%", "Exactly 1%", "Over 95%"],
      answer: "Approximately 50% to 55%",
      explanation: "Despite heavy combat, non-combat illnesses like trench foot, influenza, and dysentery accounted for over half of hospital admissions."
    },
    {
      question: "What specialized Scottish military hospital pioneered psychological talking therapy for shell-shocked officers like Siegfried Sassoon?",
      options: ["Craiglockhart War Hospital in Edinburgh", "St Thomas's Hospital", "The American Red Cross Hospital", "Boulogne Base Hospital"],
      answer: "Craiglockhart War Hospital in Edinburgh",
      explanation: "Dr W.H.R. Rivers practiced early psychotherapy at Craiglockhart, encouraging traumatized officers to talk through their memories."
    }
  ],

  lesson_5_3: [
    {
      question: "What military munition caused approximately 58% of all battlefield wounds on the Western Front?",
      options: ["Artillery shells and shrapnel fragments", "Rifle bullets", "Bayonets", "Poison gas"],
      answer: "Artillery shells and shrapnel fragments",
      explanation: "High explosive and shrapnel shells shattered bone and tore flesh, causing the majority of all casualties."
    },
    {
      question: "What steel helmet was issued to British soldiers in late 1915 to protect against descending shrapnel balls?",
      options: ["The Brodie helmet", "The Pickelhaube", "The Adrian helmet", "The Stalhelm"],
      answer: "The Brodie helmet",
      explanation: "The steel Brodie helmet reduced severe head wounds by over 75% by deflecting overhead shrapnel."
    },
    {
      question: "Why was highly fertilized French and Belgian agricultural soil so dangerous when driven into wounds by shrapnel?",
      options: ["It was packed with anaerobic soil bacteria that caused deadly gas gangrene and tetanus", "It contained radioactive elements", "It formed cement inside the bloodstream", "It dissolved bone instantly"],
      answer: "It was packed with anaerobic soil bacteria that caused deadly gas gangrene and tetanus",
      explanation: "Centuries of manure fertilization filled the mud with Clostridium bacteria that multiplied rapidly in deep, oxygen-deprived wounds."
    },
    {
      question: "What were the symptoms of gas gangrene in infected shrapnel wounds?",
      options: ["Tissue rotting and producing gas bubbles beneath the skin, with a foul sweet smell and rapid fatal shock", "Skin turning bright yellow", "Loss of eyesight", "Excessive bleeding from the nose"],
      answer: "Tissue rotting and producing gas bubbles beneath the skin, with a foul sweet smell and rapid fatal shock",
      explanation: "Gas-producing bacteria literally fermented living muscle tissue, requiring rapid surgical excision or amputation."
    },
    {
      question: "How did the British Royal Army Medical Corps (RAMC) drastically reduce deaths from tetanus from autumn 1914?",
      options: ["By routinely injecting all wounded soldiers with anti-tetanus serum at the Regimental Aid Post", "By giving oral penicillin", "By cauterising all wounds with boiling oil", "By keeping wounds completely dry"],
      answer: "By routinely injecting all wounded soldiers with anti-tetanus serum at the Regimental Aid Post",
      explanation: "Prophylactic anti-tetanus serum given immediately upon casualty evacuation prevented the fatal lockjaw infection."
    },
    {
      question: "What choking suffocating gas smelled like a mixture of pepper and pineapple, and was first deployed at Second Ypres in 1915?",
      options: ["Chlorine gas", "Mustard gas", "Phosgene gas", "Cyanide gas"],
      answer: "Chlorine gas",
      explanation: "Greenish-yellow chlorine gas reacted with water in the lungs to form hydrochloric acid, suffocating victims."
    },
    {
      question: "Why was phosgene gas, introduced in late 1915, even deadlier than chlorine?",
      options: ["It was colourless and almost odourless, and symptoms could be delayed up to 48 hours while lungs filled with fluid", "It burned through steel helmets", "It exploded upon contact with water", "It caused heart failure in two seconds"],
      answer: "It was colourless and almost odourless, and symptoms could be delayed up to 48 hours while lungs filled with fluid",
      explanation: "Phosgene had an insidious delayed action, causing apparently healthy soldiers to drown internally in lung fluid days later."
    },
    {
      question: "What oily blistering agent was first used by the German Army in July 1917, causing horrific external and internal burns?",
      options: ["Mustard gas", "Chlorine gas", "Tear gas", "Carbon monoxide"],
      answer: "Mustard gas",
      explanation: "Mustard gas was a persistent vesicant that burned skin through uniforms, blinded eyes, and remained active in mud for days."
    },
    {
      question: "What was the most effective British gas mask, issued from 1916 onwards, which filtered air through a charcoal canister?",
      options: ["The Small Box Respirator (SBR)", "The Hypo helmet", "The Black Veil respirator", "The P-Helmet"],
      answer: "The Small Box Respirator (SBR)",
      explanation: "The Small Box Respirator used a canvas mask connected by a corrugated tube to a box of activated charcoal."
    },
    {
      question: "What percentage of total British Western Front deaths was directly attributed to poison gas?",
      options: ["Less than 3% (approximately 6,000 deaths out of 750,000)", "Over 50%", "Exactly 25%", "Over 80%"],
      answer: "Less than 3% (approximately 6,000 deaths out of 750,000)",
      explanation: "Though terrifying and causing 180,000 casualties, effective masks kept gas fatalities below 3% of total deaths."
    }
  ],

  lesson_5_4: [
    {
      question: "How many stretcher-bearers were assigned to an ordinary British infantry battalion of 1,000 men?",
      options: ["16 stretcher-bearers (4 bearers per stretcher)", "100 stretcher-bearers", "Only 2 stretcher-bearers", "50 stretcher-bearers"],
      answer: "16 stretcher-bearers (4 bearers per stretcher)",
      explanation: "Sixteen men were officially allocated to carry stretchers, making casualty evacuation grueling during heavy barrages."
    },
    {
      question: "Where was the Regimental Aid Post (RAP) situated in relation to the front line?",
      options: ["Within 200–300 yards of the front trench, in a dugout or ruined cellar", "5 miles behind the line", "In London", "Inside coastal Base Hospitals"],
      answer: "Within 200–300 yards of the front trench, in a dugout or ruined cellar",
      explanation: "The RAP was the closest medical post to the fighting, giving immediate dressings, morphia, and anti-tetanus serum."
    },
    {
      question: "What unit of the RAMC operated the Advanced Dressing Stations (ADS) and Main Dressing Stations (MDS)?",
      options: ["The Field Ambulance", "The Base Hospital", "The Red Cross League", "The Sanitary Corps"],
      answer: "The Field Ambulance",
      explanation: "The Field Ambulance was a mobile medical unit of about 250 men that set up temporary dressing stations 400m to 1 mile back."
    },
    {
      question: "Why was the Casualty Clearing Station (CCS) considered the most critical hub in the chain of evacuation?",
      options: ["It was the first point with fully equipped operating theatres where life-saving surgery was performed before infection set in", "It had the most beds", "It was where soldiers were discharged home", "It had no doctors"],
      answer: "It was the first point with fully equipped operating theatres where life-saving surgery was performed before infection set in",
      explanation: "CCSs were positioned near railway lines 7–12 miles back, performing emergency amputations and debridement within hours."
    },
    {
      question: "How did medical officers at the CCS triage arriving wounded soldiers?",
      options: ["They divided casualties into walking wounded, those in urgent need of immediate surgery, and those beyond medical hope (moribund)", "They treated officers first always", "They treated soldiers in alphabetical order", "They treated only head wounds"],
      answer: "They divided casualties into walking wounded, those in urgent need of immediate surgery, and those beyond medical hope (moribund)",
      explanation: "Triage maximized survival by prioritizing urgent, operable cases over the slightly wounded or dying."
    },
    {
      question: "Why did the British Red Cross appeal for public motor ambulances in the autumn of 1914?",
      options: ["Horse-drawn ambulances were too slow, jolted wounded men agonisingly, and horses were killed in mud", "Tanks had replaced all horses", "Petrol was free in France", "Horses refused to walk in rain"],
      answer: "Horse-drawn ambulances were too slow, jolted wounded men agonisingly, and horses were killed in mud",
      explanation: "Motor ambulances transported casualties rapidly and smoothly, preventing shock and delayed operations."
    },
    {
      question: "Why were canal barges used to evacuate certain types of wounded soldiers to Base Hospitals?",
      options: ["They provided an exceptionally smooth, vibration-free journey ideal for men with severe head and abdominal wounds", "They were faster than trains", "They could travel through German territory", "They were completely bombproof"],
      answer: "They provided an exceptionally smooth, vibration-free journey ideal for men with severe head and abdominal wounds",
      explanation: "Canal barges through northern French waterways avoided the painful jolting of rough road ambulances."
    },
    {
      question: "Where were major British Base Hospitals located on the Western Front?",
      options: ["Along the French coast at ports like Boulogne, Le Touquet, and Rouen", "In frontline trenches", "In Brussels", "On hospital battleships in the North Sea"],
      answer: "Along the French coast at ports like Boulogne, Le Touquet, and Rouen",
      explanation: "Base Hospitals were clustered near coastal ports for easy repatriation of 'Blighty' wounded to England."
    },
    {
      question: "What voluntary nursing organization drove ambulances and operated field kitchens alongside the RAMC?",
      options: ["The First Aid Nursing Yeomanry (FANY)", "The Suffragette Brigade", "The Land Army", "The Women’s Royal Air Force"],
      answer: "The First Aid Nursing Yeomanry (FANY)",
      explanation: "FANY women drove ambulances, maintained motor vehicles, and ran aid stations right up to casualty clearing stations."
    },
    {
      question: "Why was rapid speed along the evacuation chain the single most important factor in saving lives?",
      options: ["It allowed contaminated soil and shrapnel to be excised before gas gangrene bacteria multiplied beyond surgical control", "It prevented soldiers missing their trains", "It kept hospital beds empty", "It saved money on bandages"],
      answer: "It allowed contaminated soil and shrapnel to be excised before gas gangrene bacteria multiplied beyond surgical control",
      explanation: "Anaerobic bacteria multiplied within hours; operating within the first 12 hours prevented fatal systemic gangrene."
    }
  ],

  lesson_5_5: [
    {
      question: "What was the survival rate for compound femur (thigh bone) fractures among British soldiers in 1914–1915?",
      options: ["Only 20% survived (80% died of shock and infection)", "Over 90% survived", "50% survived", "Zero survivors"],
      answer: "Only 20% survived (80% died of shock and infection)",
      explanation: "In 1914, compound femur fractures were almost universally fatal due to arterial damage and shock during transport."
    },
    {
      question: "How did the introduction of the Thomas Splint in late 1915 transform compound femur fracture survival?",
      options: ["It pulled the leg into constant traction, raising survival rates from 20% to over 80%", "It healed the bone in two days", "It eliminated the need for surgery", "It allowed soldiers to walk immediately"],
      answer: "It pulled the leg into constant traction, raising survival rates from 20% to over 80%",
      explanation: "The rigid metal frame stabilized bone ends, preventing severed femoral arteries and fatal shock during evacuation."
    },
    {
      question: "Which British surgeon, the nephew of Hugh Owen Thomas, convinced the War Office to roll out the Thomas Splint across the Western Front?",
      options: ["Robert Jones", "Harold Gillies", "Harvey Cushing", "Almroth Wright"],
      answer: "Robert Jones",
      explanation: "Robert Jones trained medical orderlies and stretcher-bearers to apply the splint before moving casualties."
    },
    {
      question: "What surgical technique was known as 'wound debridement' (épluchage)?",
      options: ["Surgically excising all dead, dying, and contaminated tissue, bone splinters, and cloth from a wound", "Stitching a wound shut immediately with silk thread", "Packing a wound with gunpowder", "Cauterising wounds with red-hot wire"],
      answer: "Surgically excising all dead, dying, and contaminated tissue, bone splinters, and cloth from a wound",
      explanation: "Surgeons used scalpels to cut away all damaged tissue where anaerobic bacteria could breed."
    },
    {
      question: "Why did military surgeons practice 'delayed primary closure' rather than stitching deep wounds shut immediately?",
      options: ["Stitching a dirty wound shut sealed anaerobic bacteria inside, creating a fatal incubator for gas gangrene", "They had run out of suture thread", "Patients refused stitches", "It was banned by the British Red Cross"],
      answer: "Stitching a dirty wound shut sealed anaerobic bacteria inside, creating a fatal incubator for gas gangrene",
      explanation: "Wounds were left open and packed with antiseptic gauze for several days until infection was excluded, then stitched."
    },
    {
      question: "What chemical antiseptic solution was continuously flushed through deep wounds using rubber tubes in the Carrel-Dakin method?",
      options: ["Sterilized sodium hypochlorite (buffered dilute bleach)", "Carbolic acid", "Pure alcohol", "Mercury chloride"],
      answer: "Sterilized sodium hypochlorite (buffered dilute bleach)",
      explanation: "Alexis Carrel and Henry Dakin formulated a buffered hypochlorite solution that dissolved dead tissue without burning live cells."
    },
    {
      question: "What was a major practical limitation of the Carrel-Dakin antiseptic solution in forward hospitals?",
      options: ["It was unstable and had to be freshly prepared every 24 hours, losing its strength rapidly", "It was highly explosive", "It caused blindness in surgeons", "It turned skin black"],
      answer: "It was unstable and had to be freshly prepared every 24 hours, losing its strength rapidly",
      explanation: "The dilute chemical solution degraded rapidly, making storage and transport difficult in mobile field units."
    },
    {
      question: "How did mobile X-ray vans improve surgical outcomes at Casualty Clearing Stations?",
      options: ["They located metallic shrapnel balls and deep shell fragments so surgeons could extract them directly without exploratory cutting", "They killed bacteria with radiation", "They cured broken bones instantly", "They operated without electricity"],
      answer: "They located metallic shrapnel balls and deep shell fragments so surgeons could extract them directly without exploratory cutting",
      explanation: "Radiographs showed the exact depth and angle of jagged metal fragments, guiding surgeons' incisions."
    },
    {
      question: "What was a major limitation of mobile X-ray equipment in 1914–1918?",
      options: ["Glass photographic plates were fragile, tubes overheated, and they could not detect pieces of uniform cloth in wounds", "They could only be used at night", "They cost more than airplanes", "They required three days to develop"],
      answer: "Glass photographic plates were fragile, tubes overheated, and they could not detect pieces of uniform cloth in wounds",
      explanation: "Early X-rays could not image dirty uniform fragments or mud, which carried deadly gas gangrene bacteria."
    },
    {
      question: "When all antiseptic measures, splinting, and debridement failed, what last-resort surgery saved soldiers from fatal blood poisoning?",
      options: ["Amputation of the infected limb", "Blood transfusion", "Trephining the skull", "Administering aspirin"],
      answer: "Amputation of the infected limb",
      explanation: "Amputation above the infection site prevented gangrenous toxins from poisoning the heart and kidneys."
    }
  ],

  lesson_5_6: [
    {
      question: "Why was direct person-to-person blood transfusion rarely performed on the Western Front in 1914?",
      options: ["Blood clotted within minutes outside the body, donor and recipient had to be side-by-side, and blood typing was difficult", "Blood was considered toxic", "The King banned blood transfers", "Soldiers refused to donate blood"],
      answer: "Blood clotted within minutes outside the body, donor and recipient had to be side-by-side, and blood typing was difficult",
      explanation: "Direct tube-to-tube transfusion was technically difficult under bombardment and wasted vital donor time."
    },
    {
      question: "What chemical compound was discovered by Richard Lewisohn in 1915 to prevent blood clotting in storage bottles?",
      options: ["Sodium citrate", "Sodium chloride", "Calcium carbonate", "Potassium nitrate"],
      answer: "Sodium citrate",
      explanation: "Adding 0.2% sodium citrate stopped coagulation, allowing blood to be bottled and stored safely for several days."
    },
    {
      question: "What discovery by Francis Rous and James Turner in 1916 enabled blood to be preserved for up to four weeks?",
      options: ["Adding a glucose (dextrose) solution alongside citrate and refrigerating the blood", "Freezing blood in liquid nitrogen", "Boiling blood in sealed jars", "Adding carbolic acid"],
      answer: "Adding a glucose (dextrose) solution alongside citrate and refrigerating the blood",
      explanation: "Citrate-glucose kept red blood cells alive and undamaged for up to 28 days when chilled."
    },
    {
      question: "Which US Army medical officer established the world’s first mobile blood depot at the Battle of Cambrai in November 1917?",
      options: ["Oswald Hope Robertson", "Harvey Cushing", "Alexis Carrel", "William Gorgas"],
      answer: "Oswald Hope Robertson",
      explanation: "Robertson collected Group O blood, stored it in iced ammunition boxes, and treated 20 shocked casualties successfully."
    },
    {
      question: "Why was blood group O specifically collected and stockpiled for battlefield blood transfusions?",
      options: ["Group O is the universal donor blood that can be safely transfused into any casualty without lethal agglutination (clumping)", "Group O was the rarest blood type", "Group O never clots", "Group O contains natural antibiotics"],
      answer: "Group O is the universal donor blood that can be safely transfused into any casualty without lethal agglutination (clumping)",
      explanation: "In frontline emergency triage, there was no time for blood typing; Group O red blood cells could be given to anyone safely."
    },
    {
      question: "How did American neurosurgeon Harvey Cushing revolutionize the treatment of battlefield head wounds?",
      options: ["He used local anaesthesia to prevent brain swelling and utilized gentle suction to remove bone splinters and shrapnel", "He operated under full general anaesthetic only", "He banned trephining", "He replaced damaged skulls with wooden plates"],
      answer: "He used local anaesthesia to prevent brain swelling and utilized gentle suction to remove bone splinters and shrapnel",
      explanation: "Cushing reduced brain surgery mortality from 55% to 28% by avoiding ether-induced swelling and using suction."
    },
    {
      question: "What specialist military hospital was established in 1917 at Sidcup, Kent, for pioneering facial reconstructive surgery?",
      options: ["The Queen’s Hospital, Sidcup", "St Thomas's Hospital", "The Royal Free Hospital", "The Star and Garter Home"],
      answer: "The Queen’s Hospital, Sidcup",
      explanation: "Harold Gillies established the Queen's Hospital at Sidcup, treating over 11,000 soldiers with severe facial disfigurement."
    },
    {
      question: "What revolutionary surgical innovation did Harold Gillies develop to transplant living skin without graft necrosis?",
      options: ["The tubed pedicle (pedicle flap)", "The Thomas Splint", "The iron lung", "The Carrel-Dakin tube"],
      answer: "The tubed pedicle (pedicle flap)",
      explanation: "Gillies rolled skin into a living tube, maintaining blood supply from the donor site until the graft attached to the face."
    },
    {
      question: "Which official war artist and surgeon produced hundreds of sensitive pastel portraits documenting Gillies’s facial reconstructions at Sidcup?",
      options: ["Henry Tonks", "John Singer Sargent", "Paul Nash", "C.R.W. Nevinson"],
      answer: "Henry Tonks",
      explanation: "Henry Tonks made meticulous pastel drawings of each operative stage, creating an invaluable medical and artistic record."
    },
    {
      question: "How did wartime medical innovations on the Western Front permanently influence peacetime British civilian medicine?",
      options: ["Techniques in blood transfusion, mobile radiology, orthopaedic splinting, and plastic surgery were adopted by civilian NHS hospitals", "All civilian doctors were replaced by military officers", "Civilian hospitals stopped performing surgery", "Traditional medicine returned completely"],
      answer: "Techniques in blood transfusion, mobile radiology, orthopaedic splinting, and plastic surgery were adopted by civilian NHS hospitals",
      explanation: "Wartime trauma breakthroughs laid the direct technical foundations for peacetime plastic surgery, blood banking, and orthopaedics."
    }
  ]
};

// Validate and append to each lesson
let totalAdded = 0;
medData.lessons.forEach((l, idx) => {
  const newQs = NEW_QUESTIONS[l.id];
  if (!newQs) {
    console.error(`Missing new questions for lesson ${l.id}`);
    process.exit(1);
  }
  if (newQs.length !== 10) {
    console.error(`Lesson ${l.id} has ${newQs.length} new questions instead of 10!`);
    process.exit(1);
  }

  // Validate each question
  newQs.forEach((q, qi) => {
    if (!q.question || typeof q.question !== 'string') {
      throw new Error(`[${l.id}] Q${qi+1} missing question`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`[${l.id}] Q${qi+1} does not have 4 options`);
    }
    if (!q.options.includes(q.answer)) {
      throw new Error(`[${l.id}] Q${qi+1} answer '${q.answer}' is not in options!`);
    }
    if (!q.explanation || typeof q.explanation !== 'string') {
      throw new Error(`[${l.id}] Q${qi+1} missing explanation`);
    }
  });

  // Ensure initial quiz exists
  if (!l.quiz) l.quiz = [];
  const initialLen = l.quiz.length;
  if (initialLen === 20) {
    console.log(`Lesson ${l.id} already has 20 questions. Skipping.`);
  } else if (initialLen === 10) {
    l.quiz.push(...newQs);
    totalAdded += 10;
    console.log(`✅ [${l.id}] Expanded from 10 to ${l.quiz.length} questions.`);
  } else {
    console.warn(`Lesson ${l.id} has unexpected quiz length: ${initialLen}`);
  }
});

console.log(`Total new questions added: ${totalAdded}`);

// Serialize back to file
const serialized = 'const data = ' + JSON.stringify(medData, null, 2) + ';\n\nexport default data;\n';
fs.writeFileSync(DATA_PATH, serialized, 'utf8');
console.log(`Successfully updated ${DATA_PATH}`);
