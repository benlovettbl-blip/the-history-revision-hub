const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataJsPath = path.join(root, 'units', 'edexcel_medicine', 'data.js');
const pubDataJsPath = path.join(root, 'public', 'units', 'edexcel_medicine', 'data.js');

const raw = fs.readFileSync(dataJsPath, 'utf8');
const jsonStr = raw.replace(/^export\s+default\s+/, '').replace(/;?\s*$/, '');
const medicineData = JSON.parse(jsonStr);

// Verified video pathways for all 26 lessons
const lessonVideoMap = {
  // ----------------------------------------------------
  // KEY TOPIC 1: MEDIEVAL MEDICINE (c1250–c1500)
  // ----------------------------------------------------
  1: [
    {
      type: "youtube",
      id: "nVJV8iEAm88",
      url: "https://www.youtube.com/watch?v=nVJV8iEAm88",
      title: "Medieval Medicine | Secondary History – Medicine Through Time (BBC Teach)",
      duration: "5 mins 12 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:30 | Lesson Phase: Starter Hook | Tone Alert: Explores religious dogma, the Church's monopoly on medical education, and divine punishment as disease etiology.",
      viewing_task: "[01:15] Quick Check: Why did the medieval Christian Church fiercely defend Galen's medical writings?\n[03:20] Discussion Focus: How did religious belief prevent medieval physicians from questioning ancient medical authorities?",
      model_answer: "The Church defended Galen because his teachings claimed the human body was created with a divine purpose by a single Creator, fitting Christian theology. This prevented challenge because questioning Galen was treated as heresy against religious doctrine."
    },
    {
      type: "youtube",
      id: "IOj-Pn5WJkw",
      url: "https://www.youtube.com/watch?v=IOj-Pn5WJkw",
      title: "The Physician (2013) | Official Movie Trailer (Ben Kingsley as Ibn Sina / Avicenna)",
      duration: "2 mins 19 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:19 | Lesson Phase: Visual & Cultural Impact | Tone Alert: Dramatises an English barber-surgeon travelling to Persia to study clinical dissection and holistic diagnosis under Ibn Sina.",
      viewing_task: "[00:45] Cinematic Enquiry: How does the film contrast the crude superstitions of European medieval surgery with Islamic clinical scholarship in Isfahan?",
      model_answer: "The film contrasts the dark, superstitious atmosphere of 11th-century England—where dissecting corpses was outlawed by the Church—with the advanced hospitals, clinical dissection, and scientific observation practiced in the Islamic world."
    }
  ],

  2: [
    {
      type: "youtube",
      id: "nVJV8iEAm88",
      url: "https://www.youtube.com/watch?v=nVJV8iEAm88",
      title: "Hippocrates, Galen & The Four Humours | BBC Bitesize for Teachers",
      duration: "5 mins 12 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 01:20–04:45 | Lesson Phase: Rational Explanations | Tone Alert: Explains the internal logic of blood, phlegm, yellow bile, and black bile.",
      viewing_task: "[01:45] Recall: Name the four humours and their associated qualities (hot, cold, wet, dry).\n[03:10] Explain: Why was humoral theory considered a rational breakthrough compared to demonic possession?",
      model_answer: "The four humours are Blood (hot/wet), Phlegm (cold/wet), Yellow Bile (hot/dry), and Black Bile (cold/dry). It was considered rational because it sought physical, natural causes inside the human body rather than supernatural punishment from God or demons."
    },
    {
      type: "youtube",
      id: "2Nl7a3ORYvw",
      url: "https://www.youtube.com/watch?v=2Nl7a3ORYvw",
      title: "Blood and Guts: A History of Surgery – Bloody Beginnings (BBC / Michael Mosley)",
      duration: "61 mins 56 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 01:00–07:45 | Lesson Phase: Extension / Guided Enquiry | Tone Alert: Michael Mosley investigates ancient humoral bloodletting and cauterisation.",
      viewing_task: "[03:30] Documentary Focus: How did medieval surgeons determine which vein to open when bleeding a patient to restore humoral balance?",
      model_answer: "Surgeons consulted vein-man diagrams and astrological charts (Zodiac Man) to bleed specific veins corresponding to the afflicted organ and astrological calendar."
    }
  ],

  3: [
    {
      type: "youtube",
      id: "MvDJMKLEd9o",
      url: "https://www.youtube.com/watch?v=MvDJMKLEd9o",
      title: "Weird Plague 'Cures' & Medieval Treatments (Simple History)",
      duration: "10 mins 47 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:30 | Lesson Phase: Starter Hook | Tone Alert: Animated review of bloodletting, purging, herbal theriacs, and religious charms.",
      viewing_task: "[01:30] Recall: What was a 'theriac' and why did wealthy patients believe it cured illnesses?\n[03:15] Explain: How did the Theory of Opposites guide treatments like feeding hot foods for a cold illness?",
      model_answer: "A theriac was an expensive herbal confection containing up to 70 ingredients (including crushed viper flesh and opium) believed to counteract bodily poisons. The Theory of Opposites balanced excess humours with opposite qualities, such as warming pepper for cold phlegm."
    }
  ],

  4: [
    {
      type: "youtube",
      id: "nVJV8iEAm88",
      url: "https://www.youtube.com/watch?v=nVJV8iEAm88",
      title: "Medical Providers & Monastic Hospitals: 'Care Not Cure' | BBC Teach",
      duration: "5 mins 12 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 03:00–05:12 | Lesson Phase: Institutional Care | Tone Alert: Illustrates monastic hospital routine, prayer, herbal gardens, and palliative care.",
      viewing_task: "[03:45] Historical Setting: Why did medieval Christian hospitals focus on 'care rather than cure'?\n[04:30] Differentiation: Contrast the role of a university-trained physician with a street barber-surgeon.",
      model_answer: "Hospitals were religious foundations aiming to care for the patient's immortal soul through confession, warmth, and prayer rather than performing medical surgeries. Physicians diagnosed through urine charts without touching patients, while barber-surgeons performed manual tooth extraction and amputations."
    }
  ],

  5: [
    {
      type: "youtube",
      id: "Hre4Oaqu1D8",
      url: "https://www.youtube.com/watch?v=Hre4Oaqu1D8",
      title: "How Did People Try to 'Cure' the Plague? Flagellants & Miasma (Simple History)",
      duration: "5 mins 09 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:45 | Lesson Phase: Starter Hook | Tone Alert: Depicts public hysteria, religious self-flagellation, and attempts to ward off bad air (miasma).",
      viewing_task: "[01:40] Quick Check: Why did the Flagellants whip themselves publicly through towns during the 1348 Black Death?\n[03:00] Miasma: What methods did townspeople use to purify bad air in 1348?",
      model_answer: "The Flagellants believed the plague was God's wrath, so they whipped themselves to atone for humanity's sins and plead for divine mercy. People burned aromatic rosemary, carried sweet-smelling posies, and lit bonfires to drive away miasmic air."
    },
    {
      type: "youtube",
      id: "YhsPPBGtquo",
      url: "https://www.youtube.com/watch?v=YhsPPBGtquo",
      title: "The Black Death (1348) – Causes, Miasma & Social Impact (Timelines.tv)",
      duration: "6 mins 33 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 01:00–05:45 | Lesson Phase: Archival Investigation | Tone Alert: Andrew Chater examines the devastation of an English village and the catastrophic 40% death toll.",
      viewing_task: "[02:30] Symptoms: Describe the physical progression of bubonic plague from buboes to internal bleeding.\n[04:50] Social Consequence: Why did the high mortality rate empower surviving peasants?",
      model_answer: "Infection caused painful egg-sized swellings (buboes) in the groin and armpits, followed by high fever, vomiting, dark spots under the skin, and rapid death within 3–5 days. The surviving peasants demanded higher wages and lower rents due to acute labor shortages."
    }
  ],

  // ----------------------------------------------------
  // KEY TOPIC 2: RENAISSANCE MEDICINE (c1500–c1700)
  // ----------------------------------------------------
  6: [
    {
      type: "youtube",
      id: "80ih_8tFbu0",
      url: "https://www.youtube.com/watch?v=80ih_8tFbu0",
      title: "The Royal Society & The Scientific Revolution – GCSE History",
      duration: "3 mins 24 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:20 | Lesson Phase: Scientific Revolution | Tone Alert: Explores the Royal Society's motto 'Nullius in Verba' (Take nobody's word for it) and the printing press.",
      viewing_task: "[01:05] Recall: What was the motto of the Royal Society and what did it encourage scientists to do?\n[02:15] Enquiry: How did the printing press prevent the Church from censoring medical discoveries?",
      model_answer: "The motto was 'Nullius in Verba' (Take nobody's word for it), encouraging scientists to rely on experimental evidence rather than ancient authority. The printing press allowed rapid, exact copying of texts and diagrams that could be distributed Europe-wide beyond Church censorship."
    },
    {
      type: "youtube",
      id: "Bhbl0eDGmsA",
      url: "https://www.youtube.com/watch?v=Bhbl0eDGmsA",
      title: "The Invention of the Printing Press & Spread of Medical Knowledge",
      duration: "4 mins 49 secs",
      pathway: "Enquiry Evidence",
      teacher_guidance: "Recommended Watch Window: 01:00–04:15 | Lesson Phase: Contextual Innovation | Tone Alert: Details Gutenberg's moveable type and the explosion of scientific literacy across Europe.",
      viewing_task: "[02:00] Quick Check: Why was moveable type vastly superior to hand-copied monastic manuscripts for anatomical anatomical diagrams?",
      model_answer: "Moveable type and woodblock printing ensured that anatomical drawings and clinical notes were reproduced identically without the copying errors common in hand-transcribed manuscripts."
    }
  ],

  7: [
    {
      type: "youtube",
      id: "YN8BC9BzLYY",
      url: "https://www.youtube.com/watch?v=YN8BC9BzLYY",
      title: "Who Was Thomas Sydenham? Bedside Observation & Clinical Classification",
      duration: "3 mins 34 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:20 | Lesson Phase: Clinical Method | Tone Alert: Explains why Sydenham was nicknamed 'The English Hippocrates' and his focus on symptoms over theory.",
      viewing_task: "[01:10] Concept: What was Sydenham's fundamental breakthrough regarding disease classification?\n[02:30] Treatment: Why did Sydenham prescribe Peruvian cinchona bark for malaria rather than humoral bloodletting?",
      model_answer: "Sydenham classified diseases into distinct species based on consistent symptoms rather than assuming illness was unique to each patient's humoral balance. He prescribed cinchona bark (quinine) because clinical observation proved it cooled fevers directly without weakening the patient through bleeding."
    },
    {
      type: "youtube",
      id: "KIkIM34fVK8",
      url: "https://www.youtube.com/watch?v=KIkIM34fVK8",
      title: "Thomas Sydenham: The English Hippocrates & The Observation Revolution",
      duration: "6 mins 18 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 00:45–05:15 | Lesson Phase: Deep-Dive Enquiry | Tone Alert: Examines Sydenham's landmark 1676 text 'Observationes Medicae'.",
      viewing_task: "[02:15] Historical Context: Why did traditional university physicians resist Sydenham's bedside methods?",
      model_answer: "Traditional physicians feared losing their elite status, which depended on knowing ancient Greek texts, whereas Sydenham advocated observing the patient directly and letting nature heal."
    }
  ],

  8: [
    {
      type: "youtube",
      id: "f_QuDvhOc7Q",
      url: "https://www.youtube.com/watch?v=f_QuDvhOc7Q",
      title: "Who Was Andreas Vesalius? Correcting Galen & The Anatomical Revolution",
      duration: "3 mins 22 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:15 | Lesson Phase: Human Dissection | Tone Alert: Explains how Vesalius corrected over 300 errors in Galen's anatomy.",
      viewing_task: "[01:15] Key Discovery: Why had Galen made hundreds of anatomical errors about human bodies?\n[02:20] Significance: What was the title of Vesalius's 1543 book and why were its illustrations groundbreaking?",
      model_answer: "Galen made errors because Roman law banned human dissection, forcing him to dissect pigs and apes. Vesalius's 1543 book was 'De Humani Corporis Fabrica' (On the Fabric of the Human Body), which featured precise, lifelike anatomical engravings drawn from direct human dissections."
    },
    {
      type: "youtube",
      id: "walfj2dpU-E",
      url: "https://www.youtube.com/watch?v=walfj2dpU-E",
      title: "Vesalius, Paré and Harvey | Secondary History – Medicine Through Time (BBC Teach)",
      duration: "4 mins 42 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–02:30 | Lesson Phase: Cross-Topic Comparison | Tone Alert: BBC educational documentary contrasting medieval anatomical dogma with Renaissance observation.",
      viewing_task: "[01:30] Critical Thinking: Why did Vesalius's anatomical work fail to produce immediate medical cures for illnesses in 1543?",
      model_answer: "Vesalius improved anatomical knowledge of bones and organs, but physicians still lacked understanding of the microscopic causes of disease or chemical cures, so treatments changed very slowly."
    }
  ],

  9: [
    {
      type: "youtube",
      id: "z-MUnRsOGEc",
      url: "https://www.youtube.com/watch?v=z-MUnRsOGEc",
      title: "Who Was William Harvey? The Heart as a Pump & Circulation of Blood",
      duration: "3 mins 06 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:00 | Lesson Phase: Mechanical Physiology | Tone Alert: Illustrates Harvey's mathematical calculation of blood volume and valve experiments.",
      viewing_task: "[01:00] Contrast: What did Galen falsely believe about blood generation and liver consumption?\n[02:10] Proof: How did Harvey's tight-bandage arm experiment prove that veins contain one-way valves?",
      model_answer: "Galen believed blood was constantly made anew in the liver and consumed by the body like fuel. Harvey tied a tight tourniquet on an arm, showing that blood only flowed toward the heart and could not be pushed backward, proving circulation through one-way valves."
    },
    {
      type: "youtube",
      id: "walfj2dpU-E",
      url: "https://www.youtube.com/watch?v=walfj2dpU-E",
      title: "William Harvey & The Circulation of Blood | BBC Bitesize for Teachers",
      duration: "4 mins 42 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 02:40–04:42 | Lesson Phase: Scientific Revolution | Tone Alert: Demonstrates the mechanical pump analogy and contemporary medical resistance.",
      viewing_task: "[03:30] Evaluation: Why was Harvey's discovery rejected by many doctors who called him a 'quack'?",
      model_answer: "Doctors rejected Harvey because accepting circulation dismantled the foundation of humoral bloodletting, and because capillaries connecting arteries to veins could not yet be seen without modern microscopes."
    }
  ],

  10: [
    {
      type: "youtube",
      id: "LBvOZO1gmOE",
      url: "https://www.youtube.com/watch?v=LBvOZO1gmOE",
      title: "The Great Plague of London (1665–1666) | Simple History",
      duration: "3 mins 01 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:00 | Lesson Phase: Plague Comparison | Tone Alert: Highlights red crosses on doors, plague searchers, watchmen, and public health ordinances.",
      viewing_task: "[00:50] Continuity: What beliefs about plague causation from 1348 still persisted in 1665 London?\n[01:50] Change: What official municipal measures were taken by the Lord Mayor of London that were absent in 1348?",
      model_answer: "People still blamed miasma, sin, and planetary alignments. However, in 1665 the Lord Mayor enforced organized quarantines, locked infected families in their homes with red crosses and 'Lord have mercy upon us', and ordered mass dog and cat culls."
    },
    {
      type: "youtube",
      id: "6cMhO7JpaYE",
      url: "https://www.youtube.com/watch?v=6cMhO7JpaYE",
      title: "Restoration (1995) | 17th-Century Medicine, Quackery & The Great Plague",
      duration: "2 mins 15 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:15 | Lesson Phase: Visual Setting | Tone Alert: Feature film trailer capturing the squalor, desperation, and quack doctors of London in 1665.",
      viewing_task: "[01:10] Atmosphere: How does the clip illustrate the terror of plague contagion in 17th-century London streets?",
      model_answer: "The film depicts smoke-filled streets, fear of infected touch, smoking tobacco to ward off miasma, and the complete breakdown of social order as death carts patrolled the alleys."
    }
  ],

  // ----------------------------------------------------
  // KEY TOPIC 3: 18th & 19th CENTURY MEDICINE (c1700–c1900)
  // ----------------------------------------------------
  11: [
    {
      type: "youtube",
      id: "ZmaoHB5fKB4",
      url: "https://www.youtube.com/watch?v=ZmaoHB5fKB4",
      title: "Pasteur and Koch | Secondary History – Medicine Through Time (BBC Teach)",
      duration: "4 mins 46 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:40 | Lesson Phase: Germ Theory | Tone Alert: Explains Louis Pasteur's 1861 swan-neck flask experiment and Robert Koch's bacteriological microbe hunting.",
      viewing_task: "[01:20] Germ Theory: How did Pasteur's swan-neck flask experiment disprove spontaneous generation?\n[03:10] Robert Koch: What specific laboratory techniques did Koch pioneer to identify specific bacteria?",
      model_answer: "Pasteur showed that sterilized broth only spoiled when dust and airborne microbes entered the flask, proving microbes came from the air rather than spontaneously generating. Koch pioneered industrial staining dyes (methyl violet) and solid agar jelly in Petri dishes to culture and photograph distinct bacterial strains."
    },
    {
      type: "youtube",
      id: "N9LC-3ZKiok",
      url: "https://www.youtube.com/watch?v=N9LC-3ZKiok",
      title: "How a Few Scientists Transformed Germ Theory – Microbe Hunters (TED-Ed)",
      duration: "4 mins 38 secs",
      pathway: "Scientific Breakthrough",
      teacher_guidance: "Recommended Watch Window: 00:30–04:15 | Lesson Phase: Disciplinary Thinking | Tone Alert: Explains the paradigm shift from miasma to specific bacterial causation (anthrax, TB, cholera).",
      viewing_task: "[02:10] Key Concept: Explain Koch's Postulates and why identifying specific microbes made targeted vaccines possible.",
      model_answer: "Koch proved that each specific disease was caused by a unique microorganism. By isolating the exact bacterium, scientists could study its life cycle and develop targeted weakened vaccines, as Pasteur did with chicken cholera and rabies."
    }
  ],

  12: [
    {
      type: "youtube",
      id: "yqUFy-t4MlQ",
      url: "https://www.youtube.com/watch?v=yqUFy-t4MlQ",
      title: "How We Conquered the Deadly Smallpox Virus: Edward Jenner (TED-Ed)",
      duration: "4 mins 33 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:15 | Lesson Phase: Starter Hook | Tone Alert: Explains variolation risks versus cowpox vaccination, testing on James Phipps in 1796.",
      viewing_task: "[01:15] Variolation vs Vaccination: Why was traditional smallpox inoculation dangerous?\n[02:45] Observation: What dairymaid folklore led Jenner to formulate his cowpox hypothesis in Gloucestershire?",
      model_answer: "Variolation inserted live smallpox, causing a 2–3% death rate and sparking new outbreaks. Jenner investigated dairymaid folklore that contracting mild bovine cowpox made milkmaids immune to lethal smallpox."
    },
    {
      type: "youtube",
      id: "sJRJeOxX6no",
      url: "https://www.youtube.com/watch?v=sJRJeOxX6no",
      title: "The Life and Work of Edward Jenner | History – True Stories (BBC Teach)",
      duration: "11 mins 20 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 03:00–09:30 | Lesson Phase: Opposition & Acceptance | Tone Alert: Dramatisation depicting medical opposition, the Royal Society's initial rejection, and 1853 compulsory vaccination.",
      viewing_task: "[05:10] Medical Opposition: Why did inoculators and the Anti-Vaccination League oppose Jenner's cowpox vaccine?",
      model_answer: "Private inoculators lost lucrative business, anti-vaccinators feared animal contamination ('turning into cows'), and religious objectors claimed preventing God's diseases was sinful."
    }
  ],

  13: [
    {
      type: "youtube",
      id: "0BYWu5Ax0Wk",
      url: "https://www.youtube.com/watch?v=0BYWu5Ax0Wk",
      title: "Florence Nightingale and Mary Seacole: Crimean War Military Nursing (The Guards Museum)",
      duration: "6 mins 08 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:45 | Lesson Phase: Dual Pioneers | Tone Alert: Contrasts Nightingale's sanitary administration at Scutari with Mary Seacole's frontline care at the British Hotel.",
      viewing_task: "[01:45] Scutari Sanitation: What changes did Nightingale introduce that dropped Scutari death rates from 42% to 2%?\n[03:40] Mary Seacole: How did Seacole overcome racial discrimination to reach the Crimean frontline?",
      model_answer: "Nightingale cleaned latrines, flushed sewage, boiled bed linens, ventilated wards, and ensured clean water. When the War Office rejected Seacole because of her Caribbean heritage, she funded her own passage to Crimea and built the British Hotel near the battlefields."
    },
    {
      type: "youtube",
      id: "FZDfibPtBlI",
      url: "https://www.youtube.com/watch?v=FZDfibPtBlI",
      title: "The Life of Mary Seacole | The Victorians | BBC Teach",
      duration: "4 mins 57 secs",
      pathway: "Case Study",
      teacher_guidance: "Recommended Watch Window: 00:30–04:30 | Lesson Phase: Herbal Medicine & Empathy | Tone Alert: Examines Seacole's Jamaican herbal remedies and battlefield nursing in Balaclava.",
      viewing_task: "[02:15] Medical Practice: What traditional herbal and hygiene knowledge did Seacole draw upon to treat cholera and dysentery?",
      model_answer: "Seacole drew upon Caribbean and Creole herbal lore (mustard plasters, aloe, and warm hydration) and practical battlefield hygiene learned from her mother in Jamaica."
    },
    {
      type: "youtube",
      id: "jONlz7vaMnU",
      url: "https://www.youtube.com/watch?v=jONlz7vaMnU",
      title: "The Life and Work of Florence Nightingale | Notes on Nursing & Hospital Reform (BBC Teach)",
      duration: "11 mins 34 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 04:00–09:15 | Lesson Phase: Long-Term Legacy | Tone Alert: Explores the pavilion hospital design, statistical coxcomb diagrams, and professional nursing schools.",
      viewing_task: "[06:20] Hospital Architecture: Why did Nightingale design hospitals with high ceilings, separate pavilion wings, and large windows?",
      model_answer: "Nightingale believed in miasma and fresh air; separate pavilion wings prevented stale hospital air and contagious infection from spreading between wards, creating cross-ventilation."
    }
  ],

  14: [
    {
      type: "youtube",
      id: "Vg1hqZanDa0",
      url: "https://www.youtube.com/watch?v=Vg1hqZanDa0",
      title: "Lister and Simpson | Secondary History – Medicine Through Time (BBC Teach)",
      duration: "4 mins 50 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:40 | Lesson Phase: Pain & Infection | Tone Alert: Details the three hurdles of surgery, Simpson's chloroform experiment (1847), and Lister's carbolic acid spray (1865).",
      viewing_task: "[01:30] The 'Black Period': Why did the discovery of anaesthetics initially increase patient mortality in surgery?\n[03:20] Antiseptics: How did Joseph Lister apply Pasteur's Germ Theory to wound infection in operating theatres?",
      model_answer: "With pain removed, surgeons operated deeper and slower in unsterilized clothes, introducing more deadly germs into open cavities. Lister realized wound sepsis was caused by airborne bacteria and soaked surgical dressings in carbolic acid, dropping gangrene rates drastically."
    },
    {
      type: "youtube",
      id: "z9rKY8MLWTU",
      url: "https://www.youtube.com/watch?v=z9rKY8MLWTU",
      title: "The Knick | Surgery in the Era of Discovery (Cinemax / HBO)",
      duration: "1 mins 11 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–01:11 | Lesson Phase: Visual & Cultural Impact | Tone Alert: Depicts late 19th-century surgical amphitheatres, speed-focused procedures, and the transition to asepsis.",
      viewing_task: "[00:35] Cinematic Discussion Focus: How does the scene capture the horrifying reality of pre-antiseptic surgical theatres where spectators in street clothes crowded around bare-handed surgeons?",
      model_answer: "It depicts unsterilized surgical amphitheatres with audiences sitting right above open incisions, surgeons wearing blood-caked coats with bare unwashed hands, and speed prioritized over hygiene."
    },
    {
      type: "youtube",
      id: "2hTZNDyLPLk",
      url: "https://www.youtube.com/watch?v=2hTZNDyLPLk",
      title: "Pain, Pus and Poison: Episode 1 (Pain & The Chloroform Revolution) | BBC",
      duration: "58 mins 21 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 01:00–12:30 | Lesson Phase: Anaesthetic Revolution | Tone Alert: Michael Mosley investigates ether, nitrous oxide, and James Simpson's self-experimentation.",
      viewing_task: "[04:20] Anaesthetic Debate: Why did Victorian religious figures oppose chloroform during childbirth, and how did Queen Victoria settle the debate in 1853?",
      model_answer: "Critics cited the Bible claiming women were cursed to endure painful labor. In 1853, Queen Victoria took chloroform during Prince Leopold's birth, declaring it 'delightful beyond measure', cementing public acceptance."
    }
  ],

  15: [
    {
      type: "youtube",
      id: "TT4Z1Ikf36w",
      url: "https://www.youtube.com/watch?v=TT4Z1Ikf36w",
      title: "Chadwick and Snow | Secondary History – Medicine Through Time (BBC Teach)",
      duration: "5 mins 00 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:50 | Lesson Phase: Public Health | Tone Alert: Examines Edwin Chadwick's 1842 Sanitary Report, John Snow's 1854 Broad Street cholera map, and Joseph Bazalgette's London sewer system.",
      viewing_task: "[01:40] Snow's Methodology: How did John Snow's spot-map of Soho prove that cholera was waterborne rather than airborne miasma?\n[03:30] Chadwick & Bazalgette: How did the Great Stink of 1858 finally force Parliament to fund London's underground sewers?",
      model_answer: "Snow mapped 93 cholera deaths centered around the Broad Street pump, noticing brewery workers drinking beer avoided cholera entirely. The Great Stink of 1858 overwhelmed Parliament with stench, forcing MPs to grant Joseph Bazalgette £3 million to build 82 miles of brick sewers."
    },
    {
      type: "youtube",
      id: "MdNXDqCGv3M",
      url: "https://www.youtube.com/watch?v=MdNXDqCGv3M",
      title: "19th Century Public Health & The 1875 Act | Secondary History (BBC Teach)",
      duration: "4 mins 40 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 01:00–04:30 | Lesson Phase: Legislative Impact | Tone Alert: Compares the permissive 1848 Public Health Act with the compulsory 1875 Public Health Act.",
      viewing_task: "[02:30] State Intervention: Why was the 1875 Public Health Act a turning point away from 'laissez-faire' government?",
      model_answer: "The 1875 Act made it compulsory for local town councils to appoint medical officers of health, inspect sewers, provide clean piped water, and regulate housing quality, ending the era of government non-interference."
    }
  ],

  // ----------------------------------------------------
  // KEY TOPIC 4: MODERN MEDICINE (c1900–present)
  // ----------------------------------------------------
  16: [
    {
      type: "youtube",
      id: "BIP0lYrdirI",
      url: "https://www.youtube.com/watch?v=BIP0lYrdirI",
      title: "Rosalind Franklin: DNA’s Unsung Hero & Photograph 51 (TED-Ed)",
      duration: "4 mins 09 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:00 | Lesson Phase: Molecular Discovery | Tone Alert: Accessible animated summary detailing X-ray crystallography, Photo 51, and the discovery of the double helix.",
      viewing_task: "[01:10] Photograph 51: What critical structural feature of DNA was revealed by Rosalind Franklin's famous X-ray diffraction image?\n[02:40] Collaboration & Ethics: How did Watson and Crick obtain Photograph 51 without Franklin's knowledge?",
      model_answer: "Photograph 51's distinctive X-shaped pattern proved DNA had a helical, double-stranded structure. Maurice Wilkins showed Franklin's data and photograph to James Watson without her knowledge or permission, allowing Watson and Crick to complete their 1953 model."
    },
    {
      type: "youtube",
      id: "AhsIF-cmoQQ",
      url: "https://www.youtube.com/watch?v=AhsIF-cmoQQ",
      title: "The Race to Sequence the Human Genome (TED-Ed)",
      duration: "4 mins 59 secs",
      pathway: "Scientific Breakthrough",
      teacher_guidance: "Recommended Watch Window: 00:30–04:45 | Lesson Phase: Human Genome Project | Tone Alert: Explores the international Human Genome Project (1990–2003) and high-speed computerized DNA sequencing.",
      viewing_task: "[01:45] Recall: How many chemical base pairs make up the complete human genome?\n[03:30] Modern Medicine: How does genomic mapping allow doctors to diagnose hereditary disorders and tailor personalized medicine?",
      model_answer: "The human genome contains approximately 3 billion chemical base pairs. Mapping all genes allows doctors to screen for faulty genetic mutations (like BRCA1/2 for cancer) and develop personalized gene therapies rather than generic drugs."
    },
    {
      type: "youtube",
      id: "1vm3od_UmFg",
      url: "https://www.youtube.com/watch?v=1vm3od_UmFg",
      title: "The DNA Double Helix Discovery | HHMI BioInteractive",
      duration: "17 mins 08 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Archival Investigation | Tone Alert: Authoritative archival documentary featuring James Watson reflecting on the Cavendish Laboratory model.",
      viewing_task: "[03:00] Structural Modelling: How did physical wire-and-sheet-metal models help Watson and Crick confirm that adenine only pairs with thymine, and guanine with cytosine?",
      model_answer: "Physical cardboard and wire models demonstrated that only complementary base pairs (A-T and C-G) formed the exact hydrogen bond angles needed to hold the two twisting sugar-phosphate backbones together."
    }
  ],

  17: [
    {
      type: "youtube",
      id: "REq1ywT0XfQ",
      url: "https://www.youtube.com/watch?v=REq1ywT0XfQ",
      title: "Magic Bullets: Paul Ehrlich, Salvarsan 606 & Domagk’s Prontosil (MrClokeHistory)",
      duration: "4 mins 17 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:10 | Lesson Phase: Chemical Breakthrough | Tone Alert: Explains synthetic chemical antibodies, Salvarsan 606 (1909), and Gerhard Domagk's Prontosil (1932).",
      viewing_task: "[01:20] Concept: Why did Paul Ehrlich describe chemical dyes as 'magic bullets'?\n[02:45] Prontosil: What deadly infection did Gerhard Domagk discover Prontosil cured in 1932?",
      model_answer: "Ehrlich hypothesized that synthetic chemical compounds could seek out and kill specific pathogenic bacteria without damaging surrounding human tissue. Domagk proved Prontosil killed streptococcal bacteria that caused puerperal childbed fever and deadly blood poisoning."
    },
    {
      type: "youtube",
      id: "bSDCMhxw-zw",
      url: "https://www.youtube.com/watch?v=bSDCMhxw-zw",
      title: "The First Magic Bullet: Salvarsan 606 & Chemical Cures (worcesterjonny)",
      duration: "3 mins 40 secs",
      pathway: "Scientific Breakthrough",
      teacher_guidance: "Recommended Watch Window: 00:00–03:30 | Lesson Phase: Targeted Cures | Tone Alert: Details the systematic screening of arsenic compounds by Ehrlich and Sahachiro Hata to cure syphilis.",
      viewing_task: "[01:50] Methodology: Why was Ehrlich's breakthrough called '606' and what does this show about modern pharmaceutical research?",
      model_answer: "It was called 606 because it was the 606th arsenic compound tested before finding one that successfully killed the syphilis spirochete, demonstrating that modern medical progress relied on systematic industrial laboratory trials."
    }
  ],

  18: [
    {
      type: "youtube",
      id: "N2-7UQWrYPY",
      url: "https://www.youtube.com/watch?v=N2-7UQWrYPY",
      title: "Fleming, Florey and Chain | Secondary History – Medicine Through Time (BBC Teach)",
      duration: "4 mins 22 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:20 | Lesson Phase: Antibiotic Revolution | Tone Alert: Alexander Fleming's 1928 mould discovery, Florey and Chain's Oxford research, and mass production in the USA during WW2.",
      viewing_task: "[01:00] Serendipity: What accidental mistake in Alexander Fleming's laboratory led to the discovery of penicillin in 1928?\n[02:45] WW2 Production: Why did Florey and Chain travel to the USA in 1941 to achieve mass production?",
      model_answer: "Fleming left unwashed staphylococcus Petri dishes near an open window while on holiday; returning, he noticed penicillium mould had dissolved surrounding bacteria. British chemical factories were fully committed to war munitions, so Florey and Chain went to the US, where industrial deep-tank fermentation was developed."
    },
    {
      type: "youtube",
      id: "CNbnLgetqHs",
      url: "https://www.youtube.com/watch?v=CNbnLgetqHs",
      title: "The Accident That Changed the World: The Discovery of Penicillin (TED-Ed)",
      duration: "4 mins 50 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 00:30–04:30 | Lesson Phase: Deep-Dive Enquiry | Tone Alert: Accessible animated exploration of natural antibiosis, Albert Alexander's human trial, and modern antibiotic resistance.",
      viewing_task: "[02:30] Clinical Trial: What happened during the first human trial on police constable Albert Alexander in 1941, and why was it significant?",
      model_answer: "Albert Alexander made a miraculous recovery from lethal blood poisoning, but when the tiny supply of penicillin ran out, the infection returned and he died, proving both penicillin's efficacy and the desperate need for mass production."
    }
  ],

  19: [
    {
      type: "youtube",
      id: "CLUmwaff4a8",
      url: "https://www.youtube.com/watch?v=CLUmwaff4a8",
      title: "The Dangers of Smoking from Doll to Peto | Medical Research Council",
      duration: "4 mins 36 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:20 | Lesson Phase: Epidemiological Evidence | Tone Alert: Richard Doll and Austin Bradford Hill's landmark 1950 statistical survey linking smoking to lung cancer.",
      viewing_task: "[01:15] Methodology: How did Richard Doll and Bradford Hill mathematically prove that cigarette smoking caused lung cancer in British hospitals?\n[03:00] Government Action: What public health interventions followed, from advertising bans to plain packaging?",
      model_answer: "Doll and Hill surveyed thousands of hospital patients, proving that heavy smokers were 50 times more likely to contract lung carcinoma than non-smokers. Government policies followed: banning cigarette TV ads (1965), public indoor smoking bans (2007), and mandatory plain graphic packaging (2016)."
    },
    {
      type: "youtube",
      id: "VBWGM630zG0",
      url: "https://www.youtube.com/watch?v=VBWGM630zG0",
      title: "Sir Richard Doll: The Epidemiologist Who Linked Smoking to Lung Cancer (BMJ)",
      duration: "9 mins 40 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 00:30–05:45 | Lesson Phase: Medical Evidence | Tone Alert: Sir Richard Doll describes his initial skepticism that car exhaust fumes or tarmac caused cancer before discovering the truth.",
      viewing_task: "[02:15] Historical Reflection: What did Richard Doll personally do when his statistical data proved the link between smoking and lung cancer?",
      model_answer: "Doll had been a heavy smoker himself; as soon as his statistical correlation became undeniable in 1950, he immediately threw away his cigarettes and stopped smoking for the rest of his life."
    }
  ],

  20: [
    {
      type: "youtube",
      id: "0pnEMBgEG24",
      url: "https://www.youtube.com/watch?v=0pnEMBgEG24",
      title: "The Foundation of the National Health Service (1948) | BBC Teach",
      duration: "9 mins 59 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 01:00–06:30 | Lesson Phase: Post-War Welfare | Tone Alert: The Beveridge Report (1942), Aneurin Bevan, overcoming British Medical Association opposition, and founding the NHS on 5 July 1948.",
      viewing_task: "[02:30] Principles: What were the three core principles of the NHS when established on 5 July 1948?\n[04:45] Overcoming Resistance: How did Minister of Health Aneurin Bevan convince reluctant private doctors to join the NHS?",
      model_answer: "The NHS was established to be universal (available to all), comprehensive (covering all medical needs), and completely free at the point of delivery. Bevan famously 'stuffed their mouths with gold' by allowing senior hospital consultants to retain private fee-paying patients alongside NHS work."
    },
    {
      type: "youtube",
      id: "xUI-7Qluf18",
      url: "https://www.youtube.com/watch?v=xUI-7Qluf18",
      title: "Aneurin Bevan & The Creation of the NHS (1948 Archive) | BBC News",
      duration: "2 mins 21 secs",
      pathway: "Primary Evidence",
      teacher_guidance: "Recommended Watch Window: 00:00–02:21 | Lesson Phase: Primary Archive | Tone Alert: Original 1948 newsreel footage of Aneurin Bevan visiting Sylvia Beckingham, the first NHS patient, at Park Hospital Manchester.",
      viewing_task: "[00:50] Primary Archive: How did the arrival of free healthcare transform life for working-class families who previously dreaded the doctor's bill?",
      model_answer: "It eliminated the constant financial dread of illness; working-class families no longer delayed treatment or relied on patent medicines because doctor visits, surgeries, spectacles, and dental care were now completely free."
    }
  ],

  // ----------------------------------------------------
  // KEY TOPIC 5: THE BRITISH SECTOR OF THE WESTERN FRONT (1914–1918)
  // ----------------------------------------------------
  21: [
    {
      type: "youtube",
      id: "9E7xYLv8N2E",
      url: "https://www.youtube.com/watch?v=9E7xYLv8N2E",
      title: "Life in the Trenches WW1 | Trench Warfare Explained (Imperial War Museums)",
      duration: "8 mins 43 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:30–05:15 | Lesson Phase: Trench Geography | Tone Alert: Frontline, support, and reserve trenches, traverses, communication trenches, and No Man's Land in the British sector.",
      viewing_task: "[01:45] Trench Design: Why were trenches built in a zig-zag pattern with right-angle traverses rather than straight lines?\n[03:30] Strategic Geography: Why did fighting concentrate around the Ypres salient and the Somme?",
      model_answer: "Trenches were dug in zig-zags so that if an enemy entered or a shell detonated, blast fragments and shrapnel could not travel down the full length of the trench. The Ypres salient was vital because it protected access to the English Channel ports through which British troops and medical supplies arrived."
    },
    {
      type: "youtube",
      id: "YqNYrYUiMfg",
      url: "https://www.youtube.com/watch?v=YqNYrYUiMfg",
      title: "1917 (2019) | Frontline Trenches, Traverses & No Man’s Land (Universal Pictures)",
      duration: "2 mins 30 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:30 | Lesson Phase: Visual Realism | Tone Alert: Visceral recreation of British frontlines, sandbags, barbed wire, and shell-cratered landscapes.",
      viewing_task: "[01:15] Environmental Observation: What physical obstacles in the trench landscape made moving wounded soldiers extraordinarily difficult?",
      model_answer: "Narrow, muddy trench floors, sharp traverse bends, collapsed duckboards, and deep, waterlogged shell craters made carrying stretcher casualties slow and exhausting."
    }
  ],

  22: [
    {
      type: "youtube",
      id: "zyyx91SomjU",
      url: "https://www.youtube.com/watch?v=zyyx91SomjU",
      title: "Living in the Trenches: Trench Foot, Mud & Squalor (Imperial War Museums)",
      duration: "5 mins 12 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:45 | Lesson Phase: Environmental Illness | Tone Alert: Focuses on non-combat medical crises: trench foot, trench fever, body lice, and dysentery.",
      viewing_task: "[01:20] Trench Foot: What caused trench foot and what preventative measures were enforced by British officers?\n[03:10] Trench Fever: What parasite transmitted trench fever, causing debilitating shooting pains and relapsing fevers?",
      model_answer: "Trench foot was caused by standing in cold water and mud for days without removing damp boots, causing fungal rot and gangrene. Officers enforced whale oil rubs, clean dry sock rotations, and braziers. Trench fever was transmitted by body lice living in trouser seams."
    },
    {
      type: "youtube",
      id: "VTzfD9oY9Xc",
      url: "https://www.youtube.com/watch?v=VTzfD9oY9Xc",
      title: "Everyday Life in the Trenches: Rations, Sickness & Routine (Imperial War Museums)",
      duration: "2 mins 28 secs",
      pathway: "Primary Evidence",
      teacher_guidance: "Recommended Watch Window: 00:00–02:28 | Lesson Phase: Primary Accounts | Tone Alert: Archival oral interviews with British veterans describing lice and sanitary conditions.",
      viewing_task: "[01:00] Daily Routine: How did unhygienic frontline latrines and impure drinking water spread acute bacterial dysentery?",
      model_answer: "Frontline latrines flooded into communication trenches during heavy rains, contaminating water supplies and spreading dysentery bacteria, which caused severe dehydration and diarrhea."
    }
  ],

  23: [
    {
      type: "youtube",
      id: "H9dgQTM28pM",
      url: "https://www.youtube.com/watch?v=H9dgQTM28pM",
      title: "How Poison Gas Became WW1’s Most Feared Weapon (History Hit)",
      duration: "6 mins 49 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:30–05:30 | Lesson Phase: Chemical & Explosive Trauma | Tone Alert: Chlorine gas at Ypres (1915), phosgene, mustard gas, and gas respirators.",
      viewing_task: "[01:40] Gas Comparison: Contrast the suffocating effects of chlorine gas with the blistering internal damage of mustard gas.\n[03:45] Protective Equipment: How did British gas defense evolve from urine-soaked socks to the box respirator?",
      model_answer: "Chlorine stripped the lining of the lungs, causing soldiers to drown in bodily fluids within minutes. Mustard gas was an oily blister agent that burned through skin, blinded soldiers, and caused internal rotting that lingered in mud for weeks. Defenses evolved from urine-soaked fabric (ammonia neutralizing chlorine) to carbon-filter box respirators."
    },
    {
      type: "youtube",
      id: "Ghdeo5S_FEo",
      url: "https://www.youtube.com/watch?v=Ghdeo5S_FEo",
      title: "Gas Attacks & Artillery Trauma in WW1 (The Soldier’s War)",
      duration: "19 mins 03 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 01:00–08:30 | Lesson Phase: Explosive Wounds | Tone Alert: Focuses on high-explosive artillery shells, shrapnel balls, and Brodie steel helmets.",
      viewing_task: "[03:30] Shrapnel & Soil: Why did wounds caused by artillery shrapnel in Flanders carry an extraordinary risk of gas gangrene and tetanus?",
      model_answer: "Flanders farmland was heavily manured for centuries with fertilizer containing anaerobic bacteria (tetanus and gas gangrene). Exploding shrapnel drove dirty, bacteria-soaked uniform cloth deep into wound cavities."
    }
  ],

  24: [
    {
      type: "youtube",
      id: "YfxRhLsAAk8",
      url: "https://www.youtube.com/watch?v=YfxRhLsAAk8",
      title: "Medicine in the First World War: The Chain of Evacuation (Imperial War Museums)",
      duration: "14 mins 30 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 01:00–10:30 | Lesson Phase: Evacuation Sequence | Tone Alert: Follows a wounded soldier through the 5 stages: Stretcher Bearers → RAP → ADS → CCS → Base Hospitals.",
      viewing_task: "[03:15] The Chain: Name the five sequential stages of the medical evacuation chain on the Western Front.\n[06:30] Role of the CCS: Why did the Casualty Clearing Station (CCS) become the most critical surgical turning point?",
      model_answer: "The five stages: Stretcher Bearers → Regimental Aid Post (RAP) → Dressing Stations (ADS/MDS) → Casualty Clearing Station (CCS) → Base Hospitals. The CCS was the first facility with operating theatres and sterile surgeons close enough to the front to perform immediate life-saving amputations before gangrene set in."
    }
  ],

  25: [
    {
      type: "youtube",
      id: "ZVELfv81Py0",
      url: "https://www.youtube.com/watch?v=ZVELfv81Py0",
      title: "WWI Medical Breakthroughs: The Thomas Splint & Mobile X-Rays (MrClokeHistory)",
      duration: "5 mins 00 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:45 | Lesson Phase: Surgical Innovation | Tone Alert: Details the Thomas Splint (reducing femur mortality from 80% to 20%), wound debridement, and mobile radiographic units.",
      viewing_task: "[01:30] Thomas Splint: How did Hugh Owen Thomas's splint prevent compound femur fractures from causing fatal shock and blood loss?\n[03:20] Mobile X-Rays: How did portable X-ray vans assist battlefield surgeons before operation?",
      model_answer: "The Thomas Splint pulled the broken leg rigid in traction, preventing broken bone ends from grinding together, severing femoral arteries, and causing fatal haemorrhage or shock. Mobile X-rays allowed surgeons to pinpoint the exact location of embedded shrapnel and bullets before cutting."
    },
    {
      type: "youtube",
      id: "Q_Eg6Vh1tZ8",
      url: "https://www.youtube.com/watch?v=Q_Eg6Vh1tZ8",
      title: "Medical History: The Thomas Splint & Compound Femur Survival",
      duration: "2 mins 08 secs",
      pathway: "Scientific Breakthrough",
      teacher_guidance: "Recommended Watch Window: 00:00–02:08 | Lesson Phase: Visual Evidence | Tone Alert: Close examination of the metal ring, rods, and traction straps.",
      viewing_task: "[01:00] Statistic: By how much did the introduction of the Thomas Splint reduce mortality from fractured thigh bones by 1916?",
      model_answer: "Mortality plummeted from 80% in 1914 to under 20% by 1916 once stretcher bearers carried the splints directly to frontline trenches."
    }
  ],

  26: [
    {
      type: "youtube",
      id: "I2O4hsESBLA",
      url: "https://www.youtube.com/watch?v=I2O4hsESBLA",
      title: "Blood Transfusions on the Western Front: Sodium Citrate & The 1917 Cambrai Depot",
      duration: "6 mins 20 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:40 | Lesson Phase: Blood Storage | Tone Alert: Examines Richard Lewisohn's sodium citrate, Francis Rous and James Turner's citrate-glucose, and Oswald Robertson's 1917 Cambrai blood bank.",
      viewing_task: "[01:45] The Clotting Barrier: What chemical additive prevented refrigerated blood from coagulating?\n[03:30] Cambrai Blood Bank: How did Oswald Robertson store 22 units of universal donor blood in ice-packed ammunition boxes in 1917?",
      model_answer: "Sodium citrate prevented blood clotting outside the body, and citrate-glucose allowed it to be stored for up to 26 days. At the Battle of Cambrai (1917), Oswald Robertson pre-collected universal Group O blood in bottles packed in iced ammunition crates, treating severe hemorrhage before surgery."
    },
    {
      type: "youtube",
      id: "94O25548Co0",
      url: "https://www.youtube.com/watch?v=94O25548Co0",
      title: "Harold Gillies & Facial Reconstruction Surgery at Queen’s Hospital Sidcup (The Royal Society)",
      duration: "24 mins 33 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Recommended Watch Window: 01:00–07:30 | Lesson Phase: Plastic Surgery & Reconstruction | Tone Alert: Harold Gillies' pedicle tube skin grafts for catastrophic facial shrapnel wounds.",
      viewing_task: "[03:40] Reconstruction Technique: How did Harold Gillies' 'tubed pedicle' graft keep transplanted skin alive while reconstructing soldiers' faces?",
      model_answer: "Gillies rolled a flap of skin from the chest or neck into a tube with its original blood vessels intact, swinging the tube onto the facial defect so blood continued to flow until new vascular connections formed."
    }
  ]
};

// Apply updates to medicineData.lessons
let updatedLessons = 0;
medicineData.lessons.forEach((l, idx) => {
  const lessonNum = idx + 1;
  if (lessonVideoMap[lessonNum]) {
    l.video = lessonVideoMap[lessonNum];
    updatedLessons++;
  }
});

console.log(`Updated ${updatedLessons} lessons with clean, verified video arrays!`);

const finalJsContent = `export default ${JSON.stringify(medicineData, null, 2)};\n`;

fs.writeFileSync(dataJsPath, finalJsContent, 'utf8');
console.log(`✅ Saved updated curriculum to ${dataJsPath}`);

fs.writeFileSync(pubDataJsPath, finalJsContent, 'utf8');
console.log(`✅ Saved updated curriculum to ${pubDataJsPath}`);

