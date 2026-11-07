const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const { med26Questions } = require('./calibrate_medicine_2026.cjs');

console.log('--- Step 1: Integrating June 2026 questions into mock_exam_bank_data.js ---');

const bankPath = path.join(rootDir, 'src', 'engine', 'mock_exam_bank_data.js');
let bankCode = fs.readFileSync(bankPath, 'utf8');

// Parse UNIT_LESSON_MOCK_QUESTIONS
const cleaned = bankCode
  .replace(/export const UNIT_LESSON_MOCK_QUESTIONS\s*=/, 'const UNIT_LESSON_MOCK_QUESTIONS =')
  .replace(/export function getLessonMockQuestions[\s\S]*$/, '');

const parseFn = new Function(cleaned + '\nreturn UNIT_LESSON_MOCK_QUESTIONS;');
const bankData = parseFn();

if (!bankData.edexcel_medicine) {
  bankData.edexcel_medicine = {};
}

// Inject med26Questions into edexcel_medicine
let totalInjected = 0;
for (const [lessonId, qList] of Object.entries(med26Questions)) {
  if (!bankData.edexcel_medicine[lessonId]) {
    bankData.edexcel_medicine[lessonId] = [];
  }
  const currentList = bankData.edexcel_medicine[lessonId];
  
  // Filter out any existing question with matching id
  const newIds = new Set(qList.map(q => q.id));
  const filtered = currentList.filter(q => !newIds.has(q.id));
  
  // Prepend the June 2026 questions so they appear first in the lesson station
  bankData.edexcel_medicine[lessonId] = [...qList, ...filtered];
  totalInjected += qList.length;
  console.log(`- ${lessonId}: prepended ${qList.length} June 2026 question(s). Total now: ${bankData.edexcel_medicine[lessonId].length}`);
}

// Write back to mock_exam_bank_data.js
const updatedBankCode = `/**
 * src/engine/mock_exam_bank_data.js
 *
 * Indexed official GCSE Mock Examination Questions mapped strictly to
 * their culminating syllabus lessons (ensuring pupils have been taught all prerequisite knowledge).
 */

export const UNIT_LESSON_MOCK_QUESTIONS = ${JSON.stringify(bankData, null, 2)};

export function getLessonMockQuestions(unitId, lessonId) {
  if (!unitId || !lessonId) return [];
  const unitMap = UNIT_LESSON_MOCK_QUESTIONS[unitId];
  if (!unitMap) return [];
  return unitMap[lessonId] || [];
}
`;

fs.writeFileSync(bankPath, updatedBankCode, 'utf8');
console.log(`✅ Saved updated src/engine/mock_exam_bank_data.js (${totalInjected} questions integrated).`);

console.log('\n--- Step 2: Adding mock_june_2026_live to units/edexcel_medicine/data.js and public/units/edexcel_medicine/data.js ---');

const mockJune2026 = {
  "id": "mock_june_2026_live",
  "title": "Edexcel GCSE June 2026 Live Standardised Paper (1HI0/11)",
  "paper_reference": "1HI0/11",
  "total_marks": 52,
  "spag_marks": 4,
  "time_minutes": 80,
  "has_mark_scheme": true,
  "section_a": {
    "title": "SECTION A: The British sector of the Western Front, 1914–18: injuries, treatment and the trenches",
    "questions": [
      {
        "num": "1 (a)",
        "text": "Describe one feature of a Casualty Clearing Station (CCS) on the Western Front.",
        "marks": 2,
        "lines": 5,
        "model_answer": "Feature: Casualty Clearing Stations operated a strict clinical triage system to prioritize incoming wounded based on medical urgency.\n\nDetail: Medical officers divided casualties into three categories: the walking wounded, those in need of immediate surgery (to stop fatal haemorrhage or gas gangrene), and moribund cases given palliative comfort care, ensuring surgical teams operated on patients with the greatest chance of survival."
      },
      {
        "num": "1 (b)",
        "text": "Describe one feature of developments in the storage of blood on the Western Front.",
        "marks": 2,
        "lines": 5,
        "model_answer": "Feature: Medical researchers developed chemical anticoagulants combined with glucose and refrigeration to store donor blood for up to four weeks.\n\nDetail: In 1915–1916, Francis Rous and Joseph Turner added dextrose (citrate-glucose) to sodium-citrated blood and stored the glass containers in portable ice boxes, allowing US Army doctor Oswald Hope Robertson to establish the world's first blood bank during the Battle of Cambrai in 1917, stocking 22 units to treat soldiers in severe hypovolaemic shock."
      },
      {
        "num": "2 (a)",
        "text": "Study Sources A and B in the Sources Booklet.\n\nHow useful are Sources A and B for an enquiry into the problems of transporting the wounded along the chain of evacuation on the Western Front?\n\nExplain your answer, using Sources A and B and your knowledge of the historical context.",
        "marks": 8,
        "lines": 24,
        "sources": [
          {
            "id": "Source A",
            "provenance": "From the diary of Edward Munro, 7 November 1916. Munro was a stretcher bearer on the Western Front. Here he is describing his work during the Battle of the Somme.",
            "content": "The Sergeant in charge ordered us to stay and help his team, as there were many casualties and he did not have enough stretcher bearers. After a short rest, we started to carry the wounded and there were a large number of them. The soldiers had made an attack on the German line the previous night and had suffered many casualties. The land over which we carried the wounded is very difficult to cross, as it has many waterlogged shell holes. We were constantly shelled by the Germans. Yesterday, two stretcher bearers had been killed. Carrying the wounded is very difficult at night. The landmarks which guide us in the daytime are not visible at night, meaning it is easy to get lost. We are covered in mud, have sore feet and are tired."
          },
          {
            "id": "Source B",
            "provenance": "An official war photograph published in the Daily Mail, July 1916. It shows British soldiers pushing a motorised ambulance through deep mud during the Battle of the Somme.",
            "image": "/images/med26/source_b_ambulance_somme_1916.jpg",
            "caption": "Source B: Official War Photograph published in the Daily Mail (July 1916) showing British soldiers pushing a motorised ambulance through deep mud on the Somme.",
            "content": "[Archival Photograph: British soldiers manually pushing a bogged-down motorised ambulance through deep liquid mud and cratered ruts during the Battle of the Somme, July 1916.]"
          }
        ],
        "model_answer": "Source A is exceptionally useful for an enquiry into the problems of transporting wounded soldiers because it provides direct, first-hand testimony from an RAMC stretcher bearer operating under frontline combat conditions during the Battle of the Somme in November 1916. Munro details the severe physical and environmental obstacles of evacuation, emphasizing the sheer volume of casualties requiring transport, the 'waterlogged shell holes' that rendered terrain impassable, the constant danger of German artillery fire which had killed two bearers the day before, and the peril of stretcher-bearing in total darkness without visible landmarks. This aligns closely with my historical knowledge: during the 1916 Somme offensive (where the British suffered 57,000 casualties on the first day alone), stretcher bearers faced impossible logistical burdens. The pulverized clay soil turned into liquid mud that filled deep artillery craters, requiring up to six to eight bearers per stretcher rather than the standard two, while German counter-battery shelling inflicted heavy attrition on medical evacuation squads. Stretcher bearers also navigated under blackout conditions to avoid sniper fire, frequently suffering severe disorientation and physical exhaustion. In terms of provenance, as a private diary written on 7 November 1916, Munro had no propaganda motive to sanitize the ordeal, giving it high reliability regarding the psychological and physical exhaustion ('sore feet and are tired') of stretcher bearers at the front line.\n\nSource B is also highly useful because it provides contemporaneous photographic evidence of the mechanical and infrastructure failures that plagued motor transport during evacuation. The photograph shows an official War Office image from July 1916 depicting multiple soldiers straining with physical exertion to manually push a heavy motorised ambulance whose wheels are deeply bogged in thick liquid mud on the Somme. This is corroborated by my historical knowledge: although the British Red Cross and St John Ambulance raised funds to introduce 250 motor ambulances by late 1914, the brutal terrain of the Somme in 1916 severely compromised their effectiveness. Heavy motorised ambulances regularly broke down or sank up to their axles in deep mud and waterlogged shell holes along congested supply tracks, forcing the RAMC to revert to horse-drawn wagons, hand carts, or prolonged manual carrying to reach Casualty Clearing Stations situated several miles to the rear. In terms of provenance, while published in the Daily Mail as an official war photograph—and therefore vetted by wartime press censors—the image could not conceal the stark tactical reality of impassable roads, making it highly valuable evidence for the practical limitations of modern vehicular transport along the evacuation chain.\n\nIn conclusion, both sources are complementary and valuable: Source A highlights the human and geographic perils of initial stretcher transport across no-man's-land and communication trenches, while Source B illustrates the subsequent mechanical and infrastructural breakdown of vehicular evacuation further along the chain."
      },
      {
        "num": "2 (b)",
        "text": "Study Source A.\n\nHow could you follow up Source A to find out more about the problems of transporting the wounded along the chain of evacuation on the Western Front?\n\nIn your answer, you must give the question you would ask and the type of source you could use.\n\nComplete the table below.",
        "marks": 4,
        "type": "follow_up",
        "model_answer": "Detail in Source A that I would follow up: 'The Sergeant in charge ordered us to stay and help his team, as there were many casualties and he did not have enough stretcher bearers.'\n\nQuestion I would ask: How did RAMC field commanders adapt the staffing, rotation, and equipment of stretcher-bearer squads to cope with mass casualty battles on the Somme?\n\nType of source I could use: The official War Diary of an RAMC Field Ambulance or Battalion Medical Officer stationed on the Somme sector in November 1916.\n\nHow this might help answer my question: It would record daily statistical casualty returns, bearer casualty rates, and official commanding officer reports detailing logistical shortages and how relief rotations were organized."
      }
    ]
  },
  "section_b": {
    "title": "SECTION B: Medicine in Britain, c1250–present",
    "questions": [
      {
        "num": "3",
        "text": "Explain one way in which the prevention of infectious diseases in the Renaissance period (c1500–c1700) was different from the prevention of infectious diseases in the eighteenth and nineteenth centuries (c1700–c1900).",
        "marks": 4,
        "lines": 12,
        "model_answer": "One significant difference was that disease prevention in the Renaissance relied on individual avoidance of miasma and superstitious measures, whereas prevention in the eighteenth and nineteenth centuries utilized scientific, state-regulated biological immunisation.\n\nIn the Renaissance (c1500–c1700), prevention was dominated by belief in bad air and divine retribution. During epidemics like the 1665 Great Plague, individuals attempted to ward off infectious illness by carrying sweet-smelling herbs, posies, or pomanders to purify foul air, smoking tobacco, or fleeing the city, while authorities killed cats and dogs. There was no scientific understanding of the biological vectors of contagion.\n\nIn contrast, in the eighteenth and nineteenth centuries (c1700–c1900), medical prevention shifted to scientifically verified biological inoculation and vaccines. In 1796, Edward Jenner discovered the smallpox vaccine by demonstrating that cowpox infection conferred immunity against smallpox. By 1852, the British government passed the Compulsory Vaccination Act, systematically vaccinating infants nationwide and creating population-level immunity. Furthermore, following Louis Pasteur's 1861 Germ Theory and Robert Koch's bacteriological discoveries, scientists developed laboratory-attenuated vaccines against anthrax, rabies, and cholera, allowing medicine to prevent specific microscopic pathogens directly rather than trying to mask foul smells."
      },
      {
        "num": "4",
        "text": "Explain why hospital care and treatment improved in the period c1700–c1900.\n\nYou may use the following in your answer:\n• the Nightingale School for Nurses\n• antiseptics\n\nYou must also use information of your own.",
        "marks": 12,
        "lines": 32,
        "bullet_points": [
          "the Nightingale School for Nurses",
          "antiseptics"
        ],
        "model_answer": "Hospital care and treatment underwent a profound transformation in the period c1700–c1900, shifting from unhygienic resting houses of last resort into modern clinical institutions governed by antiseptic discipline, professional nursing standards, and advanced surgical safety.\n\nA primary catalyst for this improvement was the revolution in professional nursing standards and hospital architecture spearheaded by Florence Nightingale. Following her work at the Scutari hospital during the Crimean War (1854–1856), where she reduced mortality from over 40% to roughly 2% through sanitation, ventilation, and clean water, Nightingale returned to Britain to publish Notes on Hospitals (1859) and Notes on Nursing (1859). In 1860, she established the Nightingale Training School for Nurses at St Thomas’ Hospital in London. This initiative established nursing as an educated, respected, and highly disciplined profession, replacing the previous stereotype of drunken, untrained nurses like Charles Dickens' fictional 'Mrs Gamp'. Nightingale also championed the 'pavilion plan' of hospital construction: large, separated wards with high ceilings, polished impermeable floors, and tall windows that maximized ventilation and cross-drafts, which dramatically lowered the risk of airborne miasmatic and cross-infection between patients.\n\nSecondly, hospital surgical treatment was revolutionized by the development of chemical antiseptics, transforming surgical wards from fatal infection traps into sterile operating environments. In the mid-nineteenth century, post-operative infections like sepsis, gangrene, and erysipelas—collectively known as 'hospital gangrene'—killed almost half of all surgical patients in an era known as the 'Black Period' of surgery. Inspired by Louis Pasteur's 1861 Germ Theory showing that airborne microbes caused putrefaction, Scottish surgeon Joseph Lister realized in 1865 that carbolic acid (used to treat sewage in Carlisle) could kill living microbes on human tissue. Lister systematically applied carbolic acid solution to open compound fractures, soaked surgical dressings, sterilized surgical instruments, and used a carbolic mist spray during operations at Glasgow Royal Infirmary. As a result, his post-operative mortality rate plunged from 46% to 15% between 1865 and 1870. Lister's antiseptic method was rapidly adopted across British hospitals and eventually evolved into aseptic surgery by the 1890s, where surgical gowns, steam-sterilized autoclaved instruments, and rubber gloves ensured operating theatres were completely germ-free before an operation began.\n\nThirdly, a crucial third aspect of improvement—separate from nursing and antiseptics—was the introduction of effective chemical anaesthetics and the foundation of specialized voluntary hospitals. In 1847, James Simpson discovered the anesthetic properties of chloroform, replacing inefficient ether and nitrous oxide. Although the initial adoption of chloroform caused a temporary rise in mortality due to deeper, riskier operations, John Snow's 1848 chloroform inhaler standardized dosage, ensuring operations were completely painless and allowing surgeons to take time and operate with anatomical precision rather than terrifying speed. Furthermore, the eighteenth and nineteenth centuries witnessed the rapid expansion of endowed voluntary hospitals funded by private philanthropy (such as Guy's, Westminster, and St George's in London) alongside specialized institutions like the Royal Free Hospital (1828) and Great Ormond Street Hospital for Sick Children (1852). These voluntary hospitals were staffed by university-trained physicians and surgeons who used hospitals as teaching hubs to conduct clinical research and diagnose illnesses at the bedside, ensuring patients received specialized medical treatment rather than mere custodial care.\n\nIn conclusion, hospital care and treatment improved because these three developments reinforced one another: Simpson's anaesthetics allowed painless precision surgery, Lister's antiseptics eliminated lethal wound infections, and Nightingale's professional nursing regime ensured clinical cleanliness and hygiene throughout the patient's recovery."
      },
      {
        "type": "either_or",
        "instruction": "Answer EITHER Question 5 OR Question 6.\nSpelling, punctuation, grammar and use of specialist terminology will be assessed in this question.",
        "spag_marks": 4,
        "q5": {
          "num": "5",
          "text": "'In the medieval period (c1250–c1500), ideas about the cause of illness were mainly based on religion.'\n\nHow far do you agree? Explain your answer.\n\nYou may use the following in your answer:\n• the Church\n• miasma\n\nYou must also use information of your own.",
          "marks": 16,
          "bullet_points": [
            "the Church",
            "miasma"
          ],
          "model_answer": "Ideas about the cause of illness in the medieval period (c1250–c1500) were heavily dominated by religious and supernatural beliefs, reflecting a deeply pious society where the Catholic Church exercised an ideological monopoly over education, healthcare, and everyday morality. However, it would be historically inaccurate to claim that medieval medical theory was solely religious. Alongside divine explanations, medieval society possessed a highly structured, rational, and naturalistic medical framework based on the Greco-Roman Theory of the Four Humours, astrological alignments, and miasmatic environmental contagion.\n\nOn the one hand, religious explanations were indeed the primary framework through which ordinary people and Church authorities explained illness. The medieval Catholic Church taught that God was omnipotent and that illness was sent directly by God as a divine punishment for individual sin, a moral test of devotion, or a collective chastisement of society's wickedness. During catastrophic epidemics such as the 1348 Black Death, which killed one-third to one-half of the English population, priests preached that the plague was a manifestation of God's wrath. This supernatural diagnosis was reinforced by the popularity of religious preventative and curative rituals: thousands joined flagellant brotherhoods to whip themselves in public penance, communities organized mass religious processions, and individuals purchased indulgences, confessed their sins, and undertook pilgrimages to holy shrines like Canterbury. Furthermore, the Church strictly policed intellectual inquiry: medieval universities were ecclesiastical institutions where monks and clerical scholars treated biblical doctrine as absolute dogma, punishing any scholar—such as Roger Bacon in 1277—who advocated empirical scientific experimentation over orthodox theological acceptance.\n\nOn the other hand, medieval thinkers and university-trained physicians also relied heavily on natural, secular explanations derived from ancient Greek and Roman philosophy, specifically the Theory of the Four Humours and the belief in miasma. First developed by Hippocrates and expanded by Galen in the second century AD, humoural pathology asserted that the human body contained four vital fluids: blood, phlegm, black bile, and yellow bile. Disease was not viewed as a divine curse, but as a biological imbalance caused by diet, climate, emotional state, or physical excretion. Physicians diagnosed humoural disharmony using urine charts (observing color, smell, and sediment) and restored equilibrium through rational, physical interventions like phlebotomy (bloodletting), purging, and diet regulation. Crucially, the Catholic Church endorsed Galen's texts because Galen wrote that the intricate design of the human body proved the existence of a single divine Creator; thus, rational humoural theory was officially preserved and taught in every university alongside religious doctrine.\n\nFurthermore, medieval people possessed a widespread environmental theory of disease based on miasma (corrupt air). It was believed that rotting biological matter, stagnant marshes, open cesspits, unburied corpses, and volcanic fissures generated poisonous vapours that corrupted the atmosphere. When inhaled, this poisoned air corrupted the humours and induced fever. During the Black Death, town authorities and physicians recognized that bad air posed a physical threat: town councils across England ordered the clearing of open dung heaps, banned the dumping of butchered animal entrails in rivers, and citizens carried sweet-smelling posies and burned fragrant woods (like juniper and rosemary) to purify the atmosphere. Additionally, medieval astrology (the alignment of planets and zodiac signs) was widely regarded as a natural science; physicians used astrological tables called physician's almanacs and the 'Zodiac Man' to identify whether planetary conjunctions (such as the conjunction of Saturn, Jupiter, and Mars in 1345) had poisoned the elements.\n\nIn conclusion, while religion provided the ultimate philosophical justification for existence and the spiritual cause of illness, it was not the sole foundation of medieval medical thinking. Rather, medieval medical ideas existed in a dual reality: supernatural religious causes explained why God permitted a person or community to be afflicted, but rational humoural theory, astrological physics, and miasma explained how the biological mechanisms of disease operated within the physical body. Therefore, while religion was immensely powerful, medieval medical ideas were equally grounded in ancient classical natural philosophy."
        },
        "q6": {
          "num": "6",
          "text": "'Improvements in science and technology is the main reason why there has been progress in medicine in the modern period (c1900–present).'\n\nHow far do you agree? Explain your answer.\n\nYou may use the following in your answer:\n• high-tech surgery\n• the NHS\n\nYou must also use information of your own.",
          "marks": 16,
          "bullet_points": [
            "high-tech surgery",
            "the NHS"
          ],
          "model_answer": "Improvements in science and technology have undoubtedly served as a primary engine of medical progress in the modern period (c1900–present), revolutionizing both the precision of internal diagnostics and the survivability of invasive clinical treatment. The twentieth century witnessed an unprecedented leap from exploratory surgery to non-invasive visualization and micro-precision intervention. Following Röntgen’s discovery of X-rays in 1895, the mid-twentieth century developed advanced diagnostic imaging: Godfrey Hounsfield’s invention of Computerised Tomography (CT scans) in 1972 and the subsequent rollout of Magnetic Resonance Imaging (MRI) in the 1980s enabled clinicians to detect microscopic malignant tumors and cerebral hemorrhages in three dimensions without exploratory incisions. In surgical wards, technological innovation replaced traumatic open surgery with laparoscopic 'keyhole surgery' using fiber-optic endoscopes and robotic surgical systems (such as the da Vinci robotic console), drastically reducing tissue trauma, blood loss, and hospital recovery times. Concurrently, high-tech life support equipment—including Willem Kolff’s artificial dialysis kidney machine (1943), heart-lung bypass machines, and microsurgical techniques enabling Christiaan Barnard’s first human heart transplant in 1967—allowed doctors to treat previously fatal organ failures. In surgical and diagnostic terms, technological capability has fundamentally redefined the limits of human longevity.\n\nFurthermore, scientific breakthroughs in biochemistry, bacteriology, and molecular genetics provided the therapeutic weapons necessary to cure systemic infections and genetic conditions. In the early twentieth century, Paul Ehrlich developed Salvarsan 606 (1909), the first chemical 'magic bullet' to target specific syphilis microbes without poisoning the patient, followed by Gerhard Domagk’s discovery of the sulfonamide Prontosil in 1932. This chemical revolution culminated in Alexander Fleming’s 1928 discovery of penicillin and its subsequent purification and mass production by Howard Florey and Ernst Chain in 1941, which saved millions of lives from bacterial septicaemia during World War II and sparked the global antibiotic era. In the latter half of the century, pure scientific research unlocked the biological blueprint of human life: in 1953, James Watson, Francis Crick, Rosalind Franklin, and Maurice Wilkins mapped the double-helix structure of DNA. This scientific foundation culminated in the international Human Genome Project (1990–2003), which mapped all 20,000 human genes, unlocking gene therapy, synthetic monoclonal antibody therapies, and personalized genetic profiling to target hereditary conditions and cancer. Without these fundamental scientific breakthroughs, high-tech medical machines would have had no curative drugs or biological targets to administer.\n\nHowever, it is vital to recognize that scientific and technological breakthroughs were entirely dependent upon state action, political ideology, and the creation of universal healthcare infrastructure to achieve actual progress across society. Prior to 1948, groundbreaking medical treatments were privatized commodities accessible only to the wealthy; millions of working-class Britons suffered untreated illnesses because they could not afford doctors' consultation fees or voluntary hospital subscriptions. Guided by William Beveridge’s 1942 Report targeting the 'Five Giants' (including Disease), Labour Minister of Health Aneurin Bevan spearheaded the creation of the National Health Service (NHS) on 5 July 1948. The NHS established a universal, nationalized healthcare system funded through progressive taxation, providing medical, surgical, and dental care completely free at the point of delivery from cradle to grave. It was the vast economic purchasing power and organizational logistics of the NHS that allowed high-tech diagnostic machines, intensive care units, and expensive pharmaceutical antibiotics to be systematically deployed across every hospital in the United Kingdom. Furthermore, government public health campaigns—such as compulsory vaccination schedules eradicating polio and diphtheria, the Clean Air Acts of 1956 following the Great Smog, and aggressive twenty-first-century anti-smoking legislation (the 2006 Health Act banning smoking in enclosed public spaces)—prevented far more mortality than individual high-tech surgical procedures could ever cure.\n\nIn conclusion, while improvements in science and technology provided the indispensable intellectual knowledge, pharmaceutical therapies, and surgical apparatus that made medical cures possible, they were not the sole reason for medical progress. Technological invention in isolation is sterile without political will and social distribution. Therefore, modern medical progress is best understood as a symbiotic partnership: science and technology generated the revolutionary clinical breakthroughs, but the creation of the NHS and proactive state public health policy ensured those breakthroughs became a universal human reality rather than a privileged luxury."
        }
      }
    ]
  }
};

function updateMedicineDataFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Use regex to locate "mock_exams": [
  const match = content.match(/"mock_exams"\s*:\s*\[/);
  if (!match) {
    console.error('Could not find mock_exams in', filePath);
    return;
  }
  const mockIndex = match.index;
  const insertPos = mockIndex + match[0].length;
  
  // Check if mock_june_2026_live already present
  if (content.includes('"id": "mock_june_2026_live"')) {
    console.log(`mock_june_2026_live already exists in ${filePath}. Skipping injection.`);
    return;
  }
  
  const mockString = '\n' + JSON.stringify(mockJune2026, null, 4) + ',';
  let newContent = content.slice(0, insertPos) + mockString + content.slice(insertPos);
  
  // Also check and fix CCS frontline typo if still present
  if (newContent.includes('driving diagnostic X-ray units directly to front-line Casualty Clearing Stations')) {
    newContent = newContent.replace(
      /driving diagnostic X-ray units directly to front-line Casualty Clearing Stations/g,
      'driving diagnostic X-ray units directly to Casualty Clearing Stations located several miles behind the frontline'
    );
    console.log('Fixed CCS frontline typo in', filePath);
  }
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`✅ Successfully updated ${filePath}`);
}

updateMedicineDataFile(path.join(rootDir, 'units', 'edexcel_medicine', 'data.js'));
updateMedicineDataFile(path.join(rootDir, 'public', 'units', 'edexcel_medicine', 'data.js'));

console.log('\n--- Done integrating June 2026 Exam Station ---');
