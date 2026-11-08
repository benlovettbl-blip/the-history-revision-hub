const fs = require('fs');
const path = require('path');

const medicineJsonPath = 'data/edexcel_medicine.json';
const d = JSON.parse(fs.readFileSync(medicineJsonPath, 'utf8'));

// Ground truth data from physical workbooks
const workbookData = [
  {
    lessonNum: 1,
    q4m: "Explain one way in which ideas about the cause of disease in the Medieval period (c1250–c1500) were similar to ideas in the Renaissance period (c1500–c1700). [4 marks]",
    q4m_model: "One way ideas about the causes of disease were similar in both periods was the continuing belief in miasma (bad air). In the Medieval period, during the 1348 Black Death, people believed that poisonous fumes from rotting filth and swamps entered the body and caused disease. Similarly, during the Renaissance, people still blamed bad air for epidemics like the 1665 Great Plague, carrying sweet-smelling posies and pomanders to keep bad smells away. Therefore, both periods believed that breathing in foul air directly caused illness because they still had no understanding of germs.",
    essay: "Explain why the Catholic Church had such a major influence on ideas about the causes of disease in the period c1250–c1500. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["Monastic scriptoria and book-copying", "The imprisonment of Roger Bacon (1277)"]
  },
  {
    lessonNum: 2,
    q4m: "Explain one way in which ideas about the cause of disease in the Medieval period (c1250–c1500) were different from ideas in the Modern period (c1900–present). [4 marks]",
    q4m_model: "One way ideas about the cause of disease were different was that medieval people believed illness was caused by internal humoural imbalances and divine punishment, whereas modern medicine proves disease is caused by microscopic pathogens and genetics. In the Medieval period, physicians followed Galen's Theory of the Four Humours, believing that illness occurred when blood, phlegm, black bile, or yellow bile fell out of balance, or that sickness was sent by God as punishment for sin. In contrast, in the Modern period, scientists proved that infectious diseases are caused by specific bacteria and viruses identified through Germ Theory and electron microscopes, while conditions like cystic fibrosis are caused by inherited faulty genes identified by the Human Genome Project. Therefore, medieval ideas focused on supernatural and humoral theories, whereas modern medicine is rooted in biological microbiology and genetic science.",
    essay: "Explain why the Theory of the Four Humours remained the dominant rational explanation of disease throughout the period c1250–c1500. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["Galen’s Theory of Opposites", "The diagnostic matula (uroscopy)"]
  },
  {
    lessonNum: 3,
    q4m: "Explain one way in which approaches to preventing disease in the Medieval period (c1250–c1500) were similar to approaches in the Renaissance period (c1500–c1700). [4 marks]",
    q4m_model: "One way approaches to preventing disease were similar in both periods was the widespread reliance on air purification to ward off miasma. In the Medieval period, during the 1348 Black Death, people lit fires in the streets, burnt sweet aromatic herbs, and carried bunches of posies to prevent poisonous air from infecting their bodies. Similarly, in the Renaissance, during the 1665 Great Plague, citizens held spice-filled pomanders and sponges soaked in vinegar to their noses and lit barrels of pitch on street corners to cleanse the atmosphere. Therefore, both periods relied heavily on pleasant scents and smoke to purify the air because both continued to believe that foul-smelling miasmas were the primary airborne route of epidemic infection.",
    essay: "Explain why bloodletting and purging remained the most common medical treatments throughout the period c1250–c1500. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["Phlebotomy (bloodletting by fleam or leeches)", "The Regimen Sanitatis"]
  },
  {
    lessonNum: 4,
    q4m: "Explain one way in which the work of hospitals in the Medieval period (c1250–c1500) was different from hospitals in the nineteenth century. [4 marks]",
    q4m_model: "One way hospital work was different was that medieval hospitals focused on religious hospitality and spiritual care ('care not cure'), whereas nineteenth-century hospitals were clinical institutions focused on medical treatment and surgery. In the Medieval period, hospitals like St Bartholomew's were run by monks and nuns who provided travelers, the elderly, and the needy with food, warmth, and daily prayer, while patients with contagious diseases or wounds were strictly turned away. In contrast, in the late nineteenth century, hospitals reformed by Florence Nightingale and antiseptic surgeons like Joseph Lister were staffed by professional secular nurses and qualified doctors dedicated to diagnosing patients, performing complex operations, and curing infectious illnesses in specialized pavilion wards. Therefore, medieval hospitals functioned as spiritual hospices, whereas nineteenth-century hospitals operated as scientific centers for active physical cure.",
    essay: "Explain why hospital care in medieval England was based on the concept of ‘care rather than cure’ in the period c1250–c1500. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["Monastic rules and religious charity", "The exclusion of infectious diseases (lepers and plague victims)"]
  },
  {
    lessonNum: 5,
    q4m: "Explain one way in which responses to the Black Death (1348–49) were similar to responses to the Great Plague of London (1665). [4 marks]",
    q4m_model: "One way responses to both epidemics were similar was the use of flight by the wealthy and the imposition of quarantine on infected households. In the Medieval period during the 1348 Black Death, wealthy nobles and merchants fled heavily populated towns into the countryside, while local towns attempted to shut their gates to travelers to avoid infection. Similarly, during the 1665 Great Plague, King Charles II and wealthy Londoners evacuated the capital, while municipal authorities strictly quarantined infected homes, boarding families inside for 40 days marked with a red cross. Therefore, in both catastrophes, the dominant responses were physical escape for the rich and forced isolation for the sick in an effort to avoid deadly contagion.",
    essay: "‘The main reason why so many people died during the Black Death (1348–49) was because governments had no effective way of preventing disease.’ How far do you agree? Explain your answer. [16 marks + 4 marks SPaG]",
    tariff: "16+4 marks",
    type: "judgement_16m",
    stimuli: ["King Edward III’s cleanliness order (1349)", "Belief in miasma and supernatural causes"]
  },
  {
    lessonNum: 6,
    q4m: "Explain one way in which ideas about the cause of disease in the Renaissance (c1500–c1700) were similar to ideas in the Medieval period (c1250–c1500). [4 marks]",
    q4m_model: "One way ideas about the causes of disease were similar in both periods was the continuing belief that miasma (bad, corrupt air) caused epidemics. In the Medieval period, doctors believed that the 1348 Black Death was triggered by toxic vapours rising from uncleaned waste, marshes, and astrological conjunctions. Similarly, during the Renaissance, physicians and the general public still blamed foul environmental smells for illness, urging people during the 1665 Great Plague to burn resin and carry pomanders to neutralize contaminated air. Therefore, both periods continued to view foul air as a primary physical cause of illness because neither had discovered microscopic pathogens.",
    essay: "Explain why new ideas in medicine were able to spread more rapidly in the period c1500–c1700. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["The invention of the printing press (c1440)", "The Royal Society (1660)"]
  },
  {
    lessonNum: 7,
    q4m: "Explain one way in which ideas about the treatment of disease in the Renaissance (c1500–c1700) were different from the Medieval period (c1250–c1500). [4 marks]",
    q4m_model: "One way ideas about treatments were different was that Renaissance physicians began prescribing specific chemical and plant-based remedies targeting distinct diseases, whereas medieval treatments focused on personalized humoral purging. In the Medieval period, treatments followed Galen's Opposites and phlebotomy, using bloodletting, laxatives, and emetics to rebalance the patient's individual humours. In contrast, in the Renaissance, pioneering doctors like Thomas Sydenham classified diseases into distinct species and prescribed specific remedies, such as cinchona bark (quinine) specifically to treat malaria and laudanum for pain relief. Therefore, treatments shifted from individual humoral rebalancing in the Middle Ages toward disease-specific pharmacological treatments in the Renaissance.",
    essay: "Explain why Thomas Sydenham was an important figure in the development of medicine in the seventeenth century. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["Observationes Medicae (1676)", "Treatments for smallpox and malaria (cinchona bark)"]
  },
  {
    lessonNum: 8,
    q4m: "Explain one way in which methods of anatomical training in the Renaissance (c1500–c1700) were similar to anatomical training in the nineteenth century. [4 marks]",
    q4m_model: "One way anatomical training was similar in both periods was the reliance on hands-on human dissection performed directly by medical students and professors. In the Renaissance, Andreas Vesalius transformed medical education at the University of Padua by personally dissecting human cadavers in front of students and insisting that students examine anatomical structures themselves rather than merely listening to ancient Galenic texts. Similarly, in the nineteenth century, medical schools in teaching hospitals made individual corpse dissection mandatory for all surgical students, formalised by the 1832 Anatomy Act which legally supplied bodies to anatomical laboratories. Therefore, both periods shared the pedagogical principle that true anatomical knowledge requires direct empirical dissection of human corpses rather than rote textual memorisation.",
    essay: "Explain why Andreas Vesalius made significant breakthroughs in the understanding of human anatomy in the sixteenth century. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["De Humani Corporis Fabrica (1543)", "Dissection of human corpses rather than animals"]
  },
  {
    lessonNum: 9,
    q4m: "Explain one way in which ideas about the human body in the Renaissance (c1500–c1700) were different from the Medieval period (c1250–c1500). [4 marks]",
    q4m_model: "One way ideas about the human body were different was the understanding of how blood moves through the vascular system. In the Medieval period, physicians accepted Galen's teaching that the liver continuously manufactured new blood from food, which was then consumed by bodily organs as fuel, with some passing through invisible pores in the heart's septum. In contrast, in the Renaissance, William Harvey proved in De Motu Cordis (1628) that the body contains a fixed quantity of blood that circulates continuously in one direction, pumped mechanically by the heart and directed through one-way valves in the veins. Therefore, medieval medicine viewed the body as an open consumer of liver-manufactured blood, whereas Renaissance medicine established that the body possesses a closed, mechanically pumped circulatory system.",
    essay: "Explain why William Harvey’s discovery of the circulation of the blood was a major breakthrough in medicine in the seventeenth century. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["De Motu Cordis (1628)", "Mechanical pump calculations and vein experiments"]
  },
  {
    lessonNum: 10,
    q4m: "Explain one way in which government responses to the Great Plague of London (1665) were different from government responses to the Black Death (1348). [4 marks]",
    q4m_model: "One way government responses were different was the introduction of highly organized, legally enforced municipal quarantine and inspection systems in 1665 compared to minimal government intervention in 1348. During the 1348 Black Death, the medieval crown issued occasional cleaning instructions (such as Edward III's letter to the Mayor of London in 1349), but possessed no local civil service or policing to enforce systematic quarantine. In contrast, during the 1665 Great Plague, the Mayor and Aldermen of London strictly enforced the Book of Orders: appointing parish searchers and wardens, locking infected households inside their homes for 40 days marked with a red cross, closing theaters, and hiring organized dead carts to collect bodies. Therefore, government action evolved from weak, ad-hoc medieval responses into systematic, legally enforced municipal isolation measures in the Renaissance.",
    essay: "‘Approaches to dealing with the Great Plague in 1665 were completely different from approaches to the Black Death in 1348.’ How far do you agree? Explain your answer. [16 marks + 4 marks SPaG]",
    tariff: "16+4 marks",
    type: "judgement_16m",
    stimuli: ["Mayor’s plague orders and quarantine (red crosses)", "Beliefs in miasma, astrology, and supernatural causes"]
  },
  {
    lessonNum: 11,
    q4m: "Explain one way in which ideas about the cause of disease in the late nineteenth century (c1860–c1890) were different from ideas in the Renaissance (c1500–c1700). [4 marks]",
    q4m_model: "One way ideas about the causes of disease were different was the transition from believing in miasma and spontaneous generation to scientific bacteriology. In the Renaissance, doctors and the public believed diseases arose spontaneously from rotting organic waste and that breathing poisonous environmental miasmas corrupted the body. In contrast, in the late nineteenth century, Louis Pasteur published his Germ Theory (1861) proving that airborne microbes cause decay and disease, and Robert Koch developed staining and culturing techniques to identify specific bacterial pathogens, such as the tuberculosis bacterium in 1882. Therefore, Renaissance ideas relied on vague environmental smells and spontaneous generation, whereas late nineteenth-century medicine proved that specific living microorganisms cause distinct diseases.",
    essay: "Explain why there was rapid progress in understanding the causes of disease in the period c1860–c1890. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["Louis Pasteur's Germ Theory (1861)", "Robert Koch's work on bacteria"]
  },
  {
    lessonNum: 12,
    q4m: "Explain one way in which methods of preventing smallpox in the late eighteenth century were different from methods used in the seventeenth century. [4 marks]",
    q4m_model: "One way methods of preventing smallpox were different was the introduction of clinical immunization in the late eighteenth century compared to passive isolation in the seventeenth century. In the seventeenth century, people had no medical prevention for smallpox, relying on praying, wearing red clothes, or isolating victims in pest houses once symptoms appeared. In contrast, in the late eighteenth century, medical practitioners actively immunized patients: first through inoculation (introducing live smallpox into the skin) and then in 1796 through Edward Jenner's safe cowpox vaccination, which conferred immunity without risk of creating a fatal smallpox outbreak. Therefore, seventeenth-century prevention was passive and medically ineffective, whereas the late eighteenth century established active preventative vaccination to stimulate biological immunity.",
    essay: "‘Edward Jenner’s development of the smallpox vaccine was the most significant breakthrough in the prevention of disease in the period c1700–c1900.’ How far do you agree? [16+4 marks]",
    tariff: "16+4 marks",
    type: "judgement_16m",
    stimuli: ["Inoculation", "The Public Health Act (1875)"]
  },
  {
    lessonNum: 13,
    q4m: "Explain one way in which hospital care in the late nineteenth century was different from hospital care in the Medieval period. [4 marks]",
    q4m_model: "One way hospital care was different was that late nineteenth-century hospitals were hygienic, curative clinical environments, whereas medieval hospitals were religious hospices providing spiritual shelter. In the Medieval period, hospitals like St Leonard's were run by religious orders where monks and nuns prayed for patients' souls and provided basic food and bedding, strictly excluding sick patients with contagious diseases. In contrast, in the late nineteenth century, hospitals were transformed by Florence Nightingale's nursing standards, sterile pavilion wards, and Joseph Lister's antiseptic operating techniques, turning hospitals into professional medical institutions where qualified doctors cured physical trauma and disease. Therefore, medieval hospital care was focused on religious comfort and charity, while late nineteenth-century hospital care was focused on professional, scientific medical cure.",
    essay: "Explain why the standard of hospital care and nursing improved so significantly in the second half of the nineteenth century. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["Florence Nightingale's work in the Crimea (1854–56)", "The pavilion hospital plan"]
  },
  {
    lessonNum: 14,
    q4m: "Explain one way in which surgical operations in the early nineteenth century (before 1846) were similar to surgery in the Medieval period. [4 marks]",
    q4m_model: "One way surgical operations were similar in both periods was that surgeons had to perform procedures on conscious patients with extreme speed because effective anaesthetics did not exist. In the Medieval period, barber-surgeons amputated limbs or removed bladder stones in minutes using physical restraint and alcohol or herbal sponges that failed to block excruciating agony. Similarly, in the early nineteenth century before Robert Liston used ether in 1846, surgeons relied entirely on manual dexterity and lightning speed—often amputating a leg in under 30 seconds—while assistants physically pinned the screaming patient down to prevent death from surgical shock. Therefore, both periods were severely restricted by the absence of general anaesthesia, forcing surgeons to prioritize speed over precision on conscious patients.",
    essay: "Explain why surgery became significantly safer in the period c1840–c1900. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["James Simpson's discovery of chloroform (1847)", "Joseph Lister's use of carbolic acid (1865)"]
  },
  {
    lessonNum: 15,
    q4m: "Explain one way in which government action on public health in the late nineteenth century was different from government action in the Renaissance. [4 marks]",
    q4m_model: "One way government action was different was that the late nineteenth-century government established permanent, compulsory municipal sanitation laws, whereas Renaissance governments only acted with temporary emergency measures during epidemics. In the Renaissance, authorities maintained a strict laissez-faire attitude during normal times, intervening only during plague outbreaks by shutting theatres and quarantining homes. In contrast, in the late nineteenth century, Parliament passed compulsory legislation like the 1875 Public Health Act, forcing local town councils to maintain clean water supplies, install covered sewer networks, inspect food, and employ medical officers of health. Therefore, Renaissance government action was sporadic and temporary, whereas late nineteenth-century government action created permanent, compulsory public health infrastructure.",
    essay: "‘The work of John Snow was the main reason for improvements in public health in the nineteenth century.’ How far do you agree? [16+4 marks]",
    tariff: "16+4 marks",
    type: "judgement_16m",
    stimuli: ["Edwin Chadwick’s 1842 Report", "The Public Health Act (1875)"]
  },
  {
    lessonNum: 16,
    q4m: "Explain one way in which scientific methods for investigating disease causes in the late twentieth century (c1950–c2000) were different from methods used in the late nineteenth century (c1870–c1900). [4 marks]",
    q4m_model: "One way scientific methods were different was the shift from optical bacteriology to molecular and genetic sequencing. In the late nineteenth century, researchers like Robert Koch investigated causes by cultivating bacteria on solid agar, staining them with synthetic chemical dyes, and viewing them under optical light microscopes. In contrast, between 1950 and 2000, scientists used X-ray crystallography (such as Rosalind Franklin's Photograph 51) to discover the double helix structure of DNA, followed by automated genetic sequencing machines during the Human Genome Project to identify hereditary disease mutations at the molecular level. Therefore, late nineteenth-century methods investigated whole bacterial cells through light microscopy, whereas late twentieth-century methods investigated diseases at the molecular genetic level inside human DNA.",
    essay: "Explain why there was rapid progress in understanding the causes of disease in the period c1950 to the present. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["Rosalind Franklin's Photograph 51 (1952)", "The Human Genome Project (1990–2003)"]
  },
  {
    lessonNum: 17,
    q4m: "Explain one way in which methods of diagnosing illness in the late twentieth century (c1970–present) were different from methods used in the nineteenth century (c1800–c1900). [4 marks]",
    q4m_model: "One way diagnostic methods were different was the development of computerized, non-invasive internal 3D scanning technologies compared to manual physical examinations. In the nineteenth century, doctors diagnosed internal illnesses by listening through stethoscopes, tapping chest cavities, and checking pulse and temperature, which often failed to detect deep tumors or organ damage until autopsy. In contrast, from the 1970s onwards, hospitals introduced CT scanners, MRI machines, and ultrasound technology, which use computer algorithms to generate precise 3D cross-sectional images of soft tissue, brain tissue, and internal organs without surgery. Therefore, nineteenth-century diagnosis was limited to external physical signs, whereas late twentieth-century diagnosis allows doctors to view internal pathology non-invasively with digital precision.",
    essay: "‘Technological innovations in medical diagnosis were more important than public health lifestyle campaigns in improving health in Britain c1900–present.’ How far do you agree? [16+4 marks]",
    tariff: "16+4 marks",
    type: "judgement_16m",
    stimuli: ["Wilhelm Röntgen’s X-rays (1895)", "The 2007 smoking ban in public places"]
  },
  {
    lessonNum: 18,
    q4m: "Explain one way in which healthcare access in Britain after 1948 was different from healthcare access in the 1930s. [4 marks]",
    q4m_model: "One way healthcare access was different was that post-1948 healthcare was universal and completely free at the point of delivery, whereas 1930s access was unequal and dependent on income or private insurance. In the 1930s, the 1911 National Insurance scheme covered GP visits only for working men, leaving women, children, and the elderly unable to afford doctors' fees and forcing many to delay medical care until illnesses became fatal. In contrast, after Aneurin Bevan launched the National Health Service (NHS) in July 1948, every British citizen became legally entitled to free GP consultations, hospital treatment, prescriptions, and operations funded entirely through taxation. Therefore, healthcare access transformed from a financial commodity dependent on individual wealth into a universal social right for all citizens.",
    essay: "‘The establishment of the National Health Service in 1948 was the most significant turning point in medical care in the period c1900–present.’ How far do you agree? [16+4 marks]",
    tariff: "16+4 marks",
    type: "judgement_16m",
    stimuli: ["The National Health Service (1948)", "The discovery of Salvarsan 606 (1909)"]
  },
  {
    lessonNum: 19,
    q4m: "Explain one way in which Alexander Fleming’s discovery of penicillin in 1928 was similar to Edward Jenner’s discovery of the smallpox vaccine in 1796. [4 marks]",
    q4m_model: "One way both discoveries were similar was that both pioneers made their initial breakthroughs through acute empirical observation of natural biological anomalies rather than deliberate laboratory chemical synthesis. In 1796, Edward Jenner observed that milkmaids who contracted mild cowpox from cows appeared completely immune to deadly smallpox, prompting him to empirically test this observation by inoculating James Phipps. Similarly, in 1928, Alexander Fleming returned to his laboratory to find that a drifting spore of Penicillium notatum mould on an unwashed petri dish had naturally killed the surrounding Staphylococcus bacteria. Therefore, both monumental breakthroughs began when an observant scientist noticed a natural biological phenomenon that killed or prevented deadly pathogens and investigated it empirically.",
    essay: "Explain why penicillin was successfully developed and mass-produced in the period 1928–1945. [12 marks]",
    tariff: "12 marks",
    type: "causation_12m",
    stimuli: ["Alexander Fleming’s discovery (1928)", "The impact of the Second World War"]
  },
  {
    lessonNum: 20,
    q4m: "Explain one way in which the diagnosis of lung cancer was different in the twenty-first century from diagnosis in the nineteenth century. [4 marks]",
    q4m_model: "One way the diagnosis of lung cancer was different was the availability of advanced cellular and radiological technology to detect tumors in living patients. In the nineteenth century, lung cancer was almost never diagnosed during life; doctors lacked internal imaging and often misdiagnosed symptoms like coughing blood as tuberculosis, only confirming tumors during post-mortem autopsies. In contrast, twenty-first-century clinicians utilize low-dose helical CT scans, PET scans, and bronchoscopies to capture microscopic images of tumors and extract cellular biopsies for genetic testing while the patient is alive. Therefore, nineteenth-century diagnosis was speculative and post-mortem, whereas twenty-first-century diagnosis is non-invasive, microscopic, and capable of identifying malignant tumors in living patients at early stages.",
    essay: "‘Government action was the main reason for progress in combating lung cancer in the twenty-first century.’ How far do you agree? [16+4 marks]",
    tariff: "16+4 marks",
    type: "judgement_16m",
    stimuli: ["The Health Act 2006 (2007 public smoking ban)", "High-tech diagnostic scans and treatments"]
  }
];

let updatedCount = 0;

workbookData.forEach(item => {
  const l = d.lessons[item.lessonNum - 1];
  if (!l) return;
  
  if (!l.exam_practice) l.exam_practice = { questions: [] };
  if (!l.exam_practice.questions) l.exam_practice.questions = [];
  
  // Q1: 4m comparison
  const q1 = {
    tariff: "4 marks",
    type: "similarity_difference_4m",
    question: item.q4m,
    prompt: "Identify one similarity or difference, explain ideas from both periods with precise detail, and conclude with an analytical comparison.",
    model: item.q4m_model,
    scaffolding: {
      acronym: "P-E-E-C",
      acronym_title: "4-Mark Comparison Formula",
      steps: [
        { letter: "P", name: "Point", desc: "State the clear comparative criterion (similarity or difference)." },
        { letter: "E", name: "Evidence (Period 1)", desc: "Provide specific, named historical detail from the first period." },
        { letter: "E", name: "Evidence (Period 2)", desc: "Provide specific, named historical detail from the second period." },
        { letter: "C", name: "Comparison", desc: "Conclude with an explicit analytical sentence tying both periods together." }
      ]
    },
    model_tiers: {
      tier_1m: {
        title: "1/4 Assertion",
        score: "1 / 4 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: `<p>${item.q4m_model.split('.')[0]}.</p>`,
        verdict: "AO2 (1 mark). Simple assertion identifying a general comparative theme without specific historical detail from either period."
      },
      tier_2m: {
        title: "2/4 Partial Trap",
        score: "2 / 4 Marks",
        level: "Level 1 Top (Supported Statement)",
        text: `<p>${item.q4m_model.split('.').slice(0, 2).join('.')}. However, in the other period, conditions were different.</p>`,
        verdict: "AO2 (2 marks). Valid point with evidence from one period, but missing supporting detail for the comparator period."
      },
      tier_4m: {
        title: "4/4 Grade 9 Exam ★",
        score: "4 / 4 Marks",
        level: "Level 2 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: item.q4m_model,
        verdict: "AO2 (4 marks). Full marks awarded. Valid comparative criterion explicitly supported with precise named evidence from BOTH periods and direct comparative conclusion."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: `<p>The comparative paradigm reflects an epistemological transformation from deductive classical authority to empirical clinical nosology across British medicine.<br><br>${item.q4m_model}</p>`,
        verdict: "Elite historiographical comparison analyzing ontological shifts and clinical methodology."
      }
    }
  };
  
  // Q2: 12m or 16+4m essay
  const existingQ2 = l.exam_practice.questions[1] || {};
  const q2 = {
    tariff: item.tariff,
    type: item.type,
    question: item.essay,
    prompt: item.tariff.includes('16') 
      ? "Assess the stated factor, balance with at least two alternative factors (using both stimulus points and your own knowledge), and reach a justified conclusion."
      : "Explain at least three distinct causal factors using specific evidence (including both stimulus points and your own knowledge), and link each back to the question stem.",
    stimulus: item.stimuli,
    model: existingQ2.model || `In addressing ${item.essay}, historical analysis demonstrates the interaction between ${item.stimuli.join(' and ')}, alongside broader socio-scientific catalysts.`,
    model_tiers: existingQ2.model_tiers || {
      tier_4m: {
        title: "Full Mark Standard",
        text: existingQ2.model || "Full mark exemplar addressing both stimulus points and outside knowledge."
      }
    }
  };
  
  l.exam_practice.questions = [q1, q2];
  
  // Also sync gcse_task
  l.gcse_task = {
    title: `Edexcel GCSE (9–1) Paper 1 Section B Practice: Q3 & Q4`,
    tasks: [
      {
        type: "written",
        tariff: `Q3: Explain one way in which ideas were ${item.q4m.includes('similar') ? 'similar' : 'different'} [4 marks]`,
        text: item.q4m,
        model: item.q4m_model
      },
      {
        type: "written",
        tariff: item.tariff.includes('16') ? `Q5/6: Judgement Essay [${item.tariff}]` : `Q4: Causal Explanation [${item.tariff}]`,
        text: item.essay,
        stimulus: item.stimuli,
        model: q2.model
      }
    ]
  };
  
  updatedCount++;
});

// Write to data/edexcel_medicine.json
fs.writeFileSync(medicineJsonPath, JSON.stringify(d, null, 2), 'utf8');

// Write to public/data/edexcel_medicine.json
const pubPath = 'public/data/edexcel_medicine.json';
if (fs.existsSync(pubPath)) {
  fs.writeFileSync(pubPath, JSON.stringify(d, null, 2), 'utf8');
}

// Write to units/edexcel_medicine/data.js (as ES module export default)
const unitDataJsPath = 'units/edexcel_medicine/data.js';
fs.writeFileSync(unitDataJsPath, 'export default ' + JSON.stringify(d, null, 2) + ';\n', 'utf8');

console.log(`✅ Successfully reconciled all ${updatedCount} core lessons in edexcel_medicine!`);

