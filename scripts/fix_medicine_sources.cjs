const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'units', 'edexcel_medicine', 'data.js');
const content = fs.readFileSync(filePath, 'utf8');
const jsonText = content.replace(/^export default\s+/, '').replace(/;\s*$/, '');
const data = JSON.parse(jsonText);

// ---------------------------------------------------------
// FIX LESSON 3.2 (Jenner & Smallpox)
// ---------------------------------------------------------
const l32 = data.lessons.find(l => l.id === 'lesson_3_2');
if (!l32) throw new Error('lesson_3_2 not found');

const l32_source_a = {
  id: "med_l32_src_a",
  letter: "Source A",
  type: "written",
  title: "Source A: Lady Mary Wortley Montagu on Smallpox Inoculation (1 April 1717)",
  author: "Lady Mary Wortley Montagu (Aristocratic Letter from Adrianople, Ottoman Empire)",
  date: "1717",
  text: "\"The small-pox, so fatal, and so general amongst us, is here entirely harmless, by the invention of ingrafting (which is the term they give it)... An old woman comes with a nut-shell full of the matter of the best sort of small-pox, and asks what vein you please to have opened. She immediately puts into the vein as much venom as can lie upon the head of her needle... The children play together all the rest of the day, and are in perfect health to the eighth day. Then the fever begins to seize them, and they keep their beds two days, very seldom three. Every year thousands undergo this operation... and there is no example of any one that has died in it.\"",
  source_context: "Written by Lady Mary Wortley Montagu in a letter from Adrianople (Edirne, Ottoman Empire) to her friend Sarah Chiswell in London in April 1717. Montagu had survived smallpox herself but was left severely scarred; observing the Ottoman practice of variolation, she had her own son inoculated and introduced the method to the British royal family in 1721. **Hinge Question:** Why did British doctors and clergy resist Montagu's introduction of Ottoman variolation for decades despite its proven success?",
  prompt: "What can you infer from Source A about the technique and perceived safety of smallpox inoculation in the Ottoman Empire compared to British medical practice?",
  model_answer: "Source A reveals that inoculation ('ingrafting') was treated as a routine, safe community procedure in the Ottoman Empire, carried out by experienced practitioners using tiny amounts of live smallpox matter. Montagu contrasts its mild symptoms and zero fatalities with the lethal terror of smallpox epidemics in Britain, presenting it as an undeniable medical salvation.",
  hinge_question: "Why did British doctors and clergy resist Montagu's introduction of Ottoman variolation for decades despite its proven success?",
  question_badge: "EARLY INOCULATION"
};

const l32_source_b = {
  id: "med_l32_src_b",
  letter: "Source B",
  type: "visual",
  title: "Source B: Hand of Sarah Nelmes Infected with Cowpox, Wellcome Collection (1796/1798)",
  caption: "Hand of dairymaid Sarah Nelmes showing active cowpox vesicles from which Dr Edward Jenner extracted matter to inoculate James Phipps on 14 May 1796.",
  image: "/images/sarah_nelmes_cowpox_hand.jpg",
  source_context: "Published in Dr Edward Jenner’s landmark 1798 treatise An Inquiry into the Causes and Effects of the Variolae Vaccinae. Jenner observed that dairymaids infected with mild cowpox from touching cow udders were completely immune to lethal smallpox; on 14 May 1796, he scraped matter from Sarah Nelmes's hand and inserted it into eight-year-old James Phipps. **Hinge Question:** Why was Jenner's decision to test his cowpox hypothesis on young James Phipps both scientifically revolutionary and ethically controversial by modern standards?",
  prompt: "How does Source B illustrate the physical evidence Dr Edward Jenner used to develop the world's first successful vaccine?",
  model_answer: "Source B provides the empirical visual evidence that underpinned Jenner's discovery. By isolating cowpox pustules from dairymaid Sarah Nelmes, Jenner demonstrated that exposure to a mild, non-fatal bovine disease provided cross-immunity against the deadly human smallpox virus, establishing the biological principle of vaccination.",
  hinge_question: "Why was Jenner's decision to test his cowpox hypothesis on young James Phipps both scientifically revolutionary and ethically controversial by modern standards?",
  question_badge: "EMPIRICAL DISCOVERY"
};

const l32_source_c = {
  id: "med_l32_src_c",
  letter: "Source C",
  type: "visual",
  title: "Source C: James Gillray, 'The Cow-Pock—or—the Wonderful Effects of the New Inoculation!' (12 June 1802)",
  caption: "The Cow-Pock (1802) by James Gillray. Famous satirical etching showing patients at St Pancras Smallpox Hospital sprouting miniature cows after vaccination.",
  image: "/images/gillray_cow_pock_1802.jpg",
  source_context: "Published by leading political and social caricaturist James Gillray in London in June 1802. The cartoon lampoons the hysterical public and religious fears surrounding Jenner's cowpox vaccine, depicting patients developing bovine horns, cow muzzles, and miniature cattle bursting out of their boils. **Hinge Question:** Did satirical cartoons like Gillray's help or hinder the public acceptance of vaccination in early nineteenth-century Britain?",
  prompt: "What does Source C reveal about the nature of public and religious opposition to Jenner's cowpox vaccine in 1802?",
  model_answer: "Source C reveals widespread anxiety, disgust, and moral panic over injecting biological animal matter into human bodies. Gillray satirises the absurd fear that receiving cowpox would physically transform humans into cattle, highlighting both religious objections to meddling with God's creation and professional medical resistance from established variolators.",
  hinge_question: "Did satirical cartoons like Gillray's help or hinder the public acceptance of vaccination in early nineteenth-century Britain?",
  question_badge: "SATIRICAL OPPOSITION"
};

// Preserve existing Source D (Commons debate 1802) and Source E (Anti-Vaccination League 1871)
const l32_source_d = l32.sources.find(s => s.title && s.title.includes('Commons')) || l32.sources[3];
l32_source_d.letter = "Source D";
l32_source_d.title = "Source D: Debate in the House of Commons on Dr Jenner's Petition (2 June 1802)";

const l32_source_e = l32.sources.find(s => s.title && s.title.includes('Anti-Vaccination')) || l32.sources[4];
l32_source_e.letter = "Source E";
l32_source_e.title = "Source E: Manifesto of the Anti-Vaccination League, London (1871)";

l32.sources = [ l32_source_a, l32_source_b, l32_source_c, l32_source_d, l32_source_e ];

// ---------------------------------------------------------
// FIX LESSON 3.3 (Nightingale & Hospital Care)
// ---------------------------------------------------------
const l33 = data.lessons.find(l => l.id === 'lesson_3_3');
if (!l33) throw new Error('lesson_3_3 not found');

// Update narrative blocks visual plates
l33.narrative_blocks[0].image = "/images/pre_nightingale_middlesex_hospital.jpg";
l33.narrative_blocks[0].caption = "Middlesex Hospital Ward by Thomas Rowlandson and Augustus Pugin (1808), showing cramped beds, poor cross-ventilation, and unhygienic conditions in pre-modern voluntary hospitals.";

l33.narrative_blocks[1].image = "/images/nightingale_scutari.jpg";
l33.narrative_blocks[1].caption = "Florence Nightingale attending wounded soldiers in the Barrack Hospital at Scutari during the Crimean War (1854), where sanitary reforms slashed death rates from 42% to 2%.";

l33.narrative_blocks[3].image = "/images/nightingale_scutari_hospital_ward.jpg";
l33.narrative_blocks[3].caption = "The Pavilion Plan: Hospital ward designed with high ceilings, separate pavilion wings, and large opposing windows to ensure maximum cross-ventilation and prevent foul air accumulation (1860s).";

// Aligned Sources
const l33_source_a = {
  id: "med_l33_src_a",
  letter: "Source A",
  type: "written",
  title: "Source A: John Howard on Squalor and Infection in British Voluntary Hospitals (1789)",
  author: "John Howard (Hospital and Prison Reformer)",
  date: "1789",
  text: "\"In many of our hospitals, the wards are so close, dark, and ill-ventilated, that offensive smells are immediately perceived upon entering. The bedclothes are dirty, the mattresses soaked with corrupt matter, and the nurses negligent and drunken. The floors are rarely washed, and the dead are left lying among the living for hours. In such pestilential wards, wounds never heal cleanly; hospital gangrene and putrid fever seize upon every patient, rendering the institution a place of destruction rather than recovery.\"",
  source_context: "Published in John Howard’s landmark survey, An Account of the Principal Lazarettos in Europe (London, 1789). Howard travelled across Great Britain inspecting voluntary hospitals and lazarettos, documenting how unwashed mattresses and lack of clean water turned charity hospitals into death traps. **Hinge Question:** Why did middle-class patients in the early nineteenth century refuse to be treated in hospitals, preferring to be operated on at home?",
  prompt: "What does Source A reveal about the hygiene, nursing standards, and mortality risks inside eighteenth- and early nineteenth-century British hospitals?",
  model_answer: "Source A reveals that pre-modern British hospitals were filthy, unventilated breeding grounds for deadly hospital-acquired infections like gangrene and typhus. Untrained nurses, dirty bedding soaked in discharges, and lack of sanitation meant that entering a hospital dramatically increased a patient's risk of dying.",
  hinge_question: "Why did middle-class patients in the early nineteenth century refuse to be treated in hospitals, preferring to be operated on at home?",
  question_badge: "PRE-MODERN HOSPITAL CONDITIONS"
};

const l33_source_b = {
  id: "med_l33_src_b",
  letter: "Source B",
  type: "written",
  title: "Source B: Florence Nightingale, Letter from the Barrack Hospital, Scutari (November 1854)",
  author: "Florence Nightingale (Superintendent of the Female Nursing Establishment in the English General Hospitals in Turkey)",
  date: "November 1854",
  text: "\"There are no basins, no soap, no brushes, no clothes-horses, no towels, no clean linen whatsoever. The men are lying on the floor in their uniforms, stiff with dried blood and covered with vermin. There are four miles of beds packed together, with not eighteen inches between them, over raw sewers overflowing into the corridors. The smell is so terrible that one can hardly breathe. The medical staff are entirely overwhelmed, and the army bureaucracy refuses even to supply scrubbing brushes without official requisitions from London.\"",
  source_context: "Written by Florence Nightingale to Sidney Herbert, the Secretary at War, shortly after her arrival at the Barrack Hospital at Scutari in November 1854 during the Crimean War. Nightingale took 38 volunteer nurses to Turkey and was horrified to find that ten times as many soldiers were dying of typhus, cholera, and dysentery as from battlefield injuries. **Hinge Question:** Why did the British military hierarchy initially view Nightingale's sanitary and organizational demands with deep hostility?",
  prompt: "What does Source B demonstrate about the immediate administrative and sanitary failures facing Florence Nightingale at Scutari?",
  model_answer: "Source B demonstrates catastrophic systemic failure: wounded soldiers lay untreated in filth, with zero clean linen, overcrowded beds sitting directly over blocked sewers, and paralyzing military bureaucracy that refused to supply basic cleaning equipment. Nightingale highlights that filth and administrative negligence, not Russian bullets, were decimating the British Army.",
  hinge_question: "Why did the British military hierarchy initially view Nightingale's sanitary and organizational demands with deep hostility?",
  question_badge: "CRIMEAN SANITARY CRISIS"
};

const l33_source_c = {
  id: "med_l33_src_c",
  letter: "Source C",
  type: "visual",
  title: "Source C: Florence Nightingale's 'Coxcomb' Polar Area Diagram of Crimean War Mortality (1858)",
  caption: "Nightingale's revolutionary 1858 'Diagram of the Causes of Mortality in the Army in the East', using wedge-shaped areas to prove preventable diseases (blue) dwarfed combat deaths (red).",
  image: "/images/nightingale_coxcomb.jpg",
  source_context: "Published in Nightingale’s official report to Queen Victoria and Parliament, Notes on Matters Affecting the Health, Efficiency, and Hospital Administration of the British Army (1858). Inventing the polar area diagram ('coxcomb'), Nightingale proved mathematically that blue wedges (preventable zymotic diseases like cholera and typhus) caused over 80% of military fatalities, which collapsed once the Sanitary Commission flushed the sewers in spring 1855. **Hinge Question:** Why was Nightingale's statistical visualization more effective in persuading Parliament than thousands of pages of written government testimony?",
  prompt: "How did Florence Nightingale use the visual evidence in Source C to prove that poor hospital sanitation was the primary cause of British military deaths?",
  model_answer: "Source C provided undeniable mathematical visual proof. The huge blue wedges demonstrate that the vast majority of soldiers died from preventable contagious diseases caused by filthy hospital conditions, while combat wounds (red wedges) were tiny in comparison. It also showed that when sanitary reforms were implemented in 1855, the disease wedges shrank almost to zero.",
  hinge_question: "Why was Nightingale's statistical visualization more effective in persuading Parliament than thousands of pages of written government testimony?",
  question_badge: "STATISTICAL EVIDENCE"
};

const l33_source_d = {
  id: "med_l33_src_d",
  letter: "Source D",
  type: "written",
  title: "Source D: Florence Nightingale on the Pavilion Hospital Plan in 'Notes on Hospitals' (1859)",
  author: "Florence Nightingale",
  date: "1859",
  text: "\"It may seem a strange principle to enunciate as the very first requirement in a Hospital, that it should do the sick no harm. Yet it is quite necessary, as hospital diseases—erysipelas, pyæmia, and gangrene—are produced entirely by defective construction and overcrowding. Every hospital must be built on the Pavilion Plan: separate detached blocks connected only by covered walkways, containing not more than 30 beds per ward, with tall opposite windows reaching almost to the ceiling to ensure continuous cross-ventilation and allow direct sunlight to flood every corner.\"",
  source_context: "Published in Florence Nightingale’s influential architectural and medical treatise Notes on Hospitals (1859). Drawing on her Crimean experience and French hospital designs, Nightingale argued that large single-block hospitals trapped miasma and stagnant air. Her Pavilion Plan became the universal design standard for Victorian hospitals, including the rebuilt St Thomas' Hospital in London (1871). **Hinge Question:** Even though Nightingale believed in miasma rather than Germ Theory, why was her Pavilion Plan still medically effective in saving patients' lives?",
  prompt: "What does Source D demonstrate about the revolutionary architectural design principles Nightingale introduced to Victorian hospital construction?",
  model_answer: "Source D shows that Nightingale revolutionized hospital design by insisting that buildings must promote healing through fresh air, sunlight, and isolation. Her Pavilion Plan eliminated lethal cross-infection by separating patients into detached, high-ceilinged wards with opposing windows for constant cross-ventilation, replacing dark, contiguous, airless death-traps.",
  hinge_question: "Even though Nightingale believed in miasma rather than Germ Theory, why was her Pavilion Plan still medically effective in saving patients' lives?",
  question_badge: "PAVILION ARCHITECTURE"
};

const l33_source_e = {
  id: "med_l33_src_e",
  letter: "Source E",
  type: "visual",
  title: "Source E: Portrait of Mary Seacole (1869) and 'The British Hotel' at Spring Hill",
  caption: "Portrait of Jamaican nurse and doctress Mary Seacole (1869) by Albert Charles Challen, Wellcome Collection, London.",
  image: "/images/mary_seacole.jpg",
  source_context: "Painted in oil by Albert Charles Challen in 1869, depicting Mary Seacole wearing her British, French, and Turkish campaign medals. Rejected by the War Office and Nightingale's nursing mission due to racial prejudice, Seacole funded her own voyage to the Crimea in 1855, building the 'British Hotel' at Spring Hill near Balaclava where she provided warm food, herbal medicines, and frontline medical treatment directly under artillery fire. **Hinge Question:** Why did the British War Office and Nightingale's committee reject Mary Seacole's nursing application despite her extensive clinical experience in Jamaica and Panama?",
  prompt: "What does Source E demonstrate about the contributions, resilience, and recognition of Mary Seacole during and after the Crimean War?",
  model_answer: "Source E demonstrates that despite facing systemic racial prejudice and institutional rejection from the British War Office, Mary Seacole independently established vital frontline care for wounded soldiers. Her portrait proudly displaying four military medals proves that frontline soldiers and the British public deeply valued her holistic medical and humanitarian service.",
  hinge_question: "Why did the British War Office and Nightingale's committee reject Mary Seacole's nursing application despite her extensive clinical experience in Jamaica and Panama?",
  question_badge: "PIONEERING RESILIENCE"
};

l33.sources = [ l33_source_a, l33_source_b, l33_source_c, l33_source_d, l33_source_e ];

const outputContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(filePath, outputContent, 'utf8');
console.log('Successfully updated units/edexcel_medicine/data.js');

const publicFilePath = path.join(__dirname, '..', 'public', 'units', 'edexcel_medicine', 'data.js');
fs.writeFileSync(publicFilePath, outputContent, 'utf8');
console.log('Successfully updated public/units/edexcel_medicine/data.js');

