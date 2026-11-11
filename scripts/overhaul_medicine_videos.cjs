const fs = require('fs');

// Full pedagogical video configuration for Edexcel Medicine lessons that need overhaul
const lessonVideoUpdates = {
  // Lesson 3: KT1.3 Medieval Treatments, Bleeding & Purging
  "lesson_1_3": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=fuEuaSmDOec",
      "id": "fuEuaSmDOec",
      "title": "English Heritage: What was Medieval Medicine Like? – Humours, Bloodletting & Leeches",
      "duration": "4 mins 12 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Accessible animated overview of medieval clinical treatments, humour balancing, venesection (bloodletting), and the use of herbal apothecary recipes. Recommended Watch Window: 00:00–04:00 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Humorous and engaging while maintaining historical accuracy regarding medieval Galenic balance.",
      "viewing_task": "<ol><li><strong>[01:05] Quick Check:</strong> Why did medieval barber-surgeons and physicians use phlebotomy (bloodletting) and leeches as their primary treatment for almost every disease?</li><li><strong>[02:40] Hinge Question:</strong> Explain how medieval herbal remedies combined empirical natural observations with religious prayers and astrological timings.</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> According to Galen's Theory of Opposites and the Four Humours, disease was caused by an excess of blood (sanguine humour). Removing blood through vein incision or leeches was believed to restore humoral equilibrium.</li><li><strong>Hinge Question:</strong> Medieval herbals relied on real medicinal plants like opium for pain relief and willow bark (containing salicin), but practitioners believed their healing power was granted by God. Plants had to be harvested under specific planetary alignments while reciting Lord's Prayers to ensure supernatural efficacy.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/3-medicine-women-and-society-history-file/",
      "title": "BBC / ERA: History File – Medieval Treatments, Bleeding & Society",
      "duration": "19 mins 15 secs",
      "pathway": "Case Study",
      "teacher_guidance": "Examines the role of women healers, monastic infirmaries, and herbal remedies in medieval villages. Recommended Watch Window: 02:00–08:00 • Lesson Phase: Guided Reading & Inquiry.",
      "viewing_task": "<ol><li><strong>[03:15] Recall:</strong> Name two tasks wise women performed that university-trained male physicians refused to do.</li><li><strong>[06:30] Explain:</strong> Why did poor peasants seek treatments from local wise women rather than licensed university physicians?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Midwifery (childbirth delivery) and setting simple bone fractures or applying herbal poultices.</li><li><strong>Explain:</strong> University physicians charged astronomical fees only the nobility could afford, and there were fewer than 100 licensed physicians in England. Wise women lived in the village, charged small customary barter fees, and possessed extensive practical knowledge of local medicinal plants.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=IOj-Pn5WJkw",
      "id": "IOj-Pn5WJkw",
      "title": "The Physician (2013) | Official Movie Trailer (Ben Kingsley as Ibn Sina / Avicenna)",
      "duration": "2 mins 30 secs",
      "pathway": "Cinematic",
      "teacher_guidance": "Recommended Watch Window: 00:00–02:30 | Lesson Phase: Visual & Cultural Impact | Tone Alert: Epic historical drama depicting an English barber-surgeon traveling to Persia to study under Ibn Sina.",
      "viewing_task": "[01:10] Cinematic Discussion Focus: How does the film contrast the backward, superstition-dominated medicine of medieval England with the advanced scientific medical schools of the Islamic world?",
      "model_answer": "Cinematic Discussion Focus: The trailer visually contrasts dirty, leech-infested English barber-surgeon stalls with the clean, orderly hospitals, anatomy libraries, and cataract surgeries in Isfahan, illustrating why Islamic medicine was centuries ahead of medieval Europe."
    }
  ],

  // Lesson 5: KT1.5 Case Study: The Black Death (1348–1349)
  "lesson_1_5": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=plIQdL84_YI",
      "id": "plIQdL84_YI",
      "title": "Simple History: The Plague Doctor – Masks, Herbs & Medieval Protective Suits",
      "duration": "2 mins 55 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "High-impact visual examination of the iconic beaked mask, waxed leather protective overcoat, and aromatic herbs used against miasma. Recommended Watch Window: 00:00–02:50 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Atmospheric animation explaining miasma theory.",
      "viewing_task": "<ol><li><strong>[00:50] Quick Check:</strong> Why was the plague doctor's mask designed with a long curved beak stuffed with sweet-smelling camphor, dried flowers, and spices?</li><li><strong>[01:45] Hinge Question:</strong> How does the plague doctor's uniform prove that medieval people believed airborne 'miasma' (bad air) was the primary cause of pestilence?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> To filter out the deadly stench of rotting corpses and swamp air, which doctors believed carried the lethal plague poison directly into the lungs.</li><li><strong>Hinge Question:</strong> The head-to-toe waxed leather overcoat, glass eye pieces, gloves, and aromatic beak were designed entirely as an impenetrable barrier against foul smells and miasma entering the body's pores, demonstrating that people had no concept of flea bites or Yersinia pestis bacteria.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/bbc-two-a-history-of-britain-by-simon-schama-series-1-king-death-medieval-treatment-and-beliefs-on-the-cause-of-the-black-death/",
      "title": "BBC Two: Simon Schama – Medieval Beliefs & Responses to the Plague (1348)",
      "duration": "5 mins 10 secs",
      "pathway": "Enquiry Evidence",
      "teacher_guidance": "Simon Schama analyzes religious hysteria, flagellants, and the desperate attempts of English town councils to halt the Black Death in 1348.",
      "viewing_task": "<ol><li><strong>[01:30] Recall:</strong> What physical penance did the Brotherhood of the Flagellants perform in public squares to appease God's anger?</li><li><strong>[03:45] Explain:</strong> Explain why medieval quarantine measures were largely ineffective against the spread of pneumonic and bubonic plague.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Whipping their own bare backs with leather thongs tipped with iron spikes until blood flowed, chanting hymns of divine forgiveness.</li><li><strong>Explain:</strong> Towns quarantined sick houses and boarded doors, but they did not know that black rats and fleas moved freely through thatch roofs, walls, and grain sacks, spreading the Yersinia pestis bacteria regardless of locked doors.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=YhsPPBGtquo",
      "id": "YhsPPBGtquo",
      "title": "Timelines.tv: The Black Death (1348) – Causes, Miasma & Social Impact",
      "duration": "9 mins 45 secs",
      "pathway": "Documentary Depth",
      "teacher_guidance": "Authoritative documentary exploring the demographic collapse of England, the loss of one-third to half of the population, and the breakdown of the feudal system. Recommended Watch Window: 01:00–08:30 • Lesson Phase: Historical Synthesis.",
      "viewing_task": "<ol><li><strong>[02:40] Recall:</strong> What percentage of the English population died between the summer of 1348 and the end of 1349?</li><li><strong>[06:15] Challenge:</strong> How did the immense death toll of the Black Death ironically improve the economic bargaining power and wages of surviving peasants?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Approximately 30% to 50% of the entire population (around 1.5 to 2.5 million people).</li><li><strong>Challenge:</strong> With severe labour shortages across agricultural estates, lords were forced to compete for surviving peasant workers by offering higher cash wages, lower rents, and freedom to move, directly weakening feudal serfdom and leading towards the 1381 Peasants' Revolt.</li></ol>"
    }
  ],

  // Lesson 10: KT2.5 Continuity in Treatment & The Great Plague 1665
  "lesson_2_5": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=LBvOZO1gmOE",
      "id": "LBvOZO1gmOE",
      "title": "Simple History: The Great Plague of London (1665-66) – Red Crosses & City Orders",
      "duration": "3 mins 45 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "High-impact visual overview of the 1665 outbreak in London: red crosses painted on doors with 'Lord have mercy upon us', watchmen locking families inside, and dead carts. Recommended Watch Window: 00:00–03:30 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Fast-paced animated overview comparing 1665 with 1348.",
      "viewing_task": "<ol><li><strong>[01:10] Quick Check:</strong> What official symbol was painted on the front door of any London house where plague was confirmed, and what words were inscribed above it?</li><li><strong>[02:30] Hinge Question:</strong> How did government actions during the 1665 Great Plague (e.g. banning public gatherings, killing 200,000 stray cats and dogs) compare to the largely uncoordinated civic responses in 1348?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> A red cross painted in the center of the door with the prayer: 'Lord have mercy upon us'.</li><li><strong>Hinge Question:</strong> In 1665 the Mayor and aldermen enforced strict written regulations: appointing searchers of the dead, closing theatres, burning barrels of pitch in streets, and locking infected families in their homes for 28 days with designated watchmen. However, mistakenly killing cats and dogs allowed the rat flea population to explode unchecked.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/the-great-plague-of-london-1665-bbc-two/",
      "title": "BBC Two: The Great Plague of London – Samuel Pepys & The Parish Registers",
      "duration": "5 mins 20 secs",
      "pathway": "Primary Evidence",
      "teacher_guidance": "Examines Samuel Pepys’s famous diary entries, Bills of Mortality, and the panic of Londoners fleeing to the countryside.",
      "viewing_task": "<ol><li><strong>[01:45] Recall:</strong> What weekly documents recorded the exact number of plague burials in London parishes during 1665?</li><li><strong>[03:50] Explain:</strong> Explain why rich Londoners (including King Charles II and physicians) were able to survive while poor tenement dwellers in St Giles died in massive numbers.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> The Bills of Mortality.</li><li><strong>Explain:</strong> The wealthy had country estates and coaches, allowing them to flee London into isolated rural areas. The poor were trapped in densely packed timber slums with open sewage, uncollected garbage, and zero savings, leaving them directly exposed to flea-infested rats.</li></ol>"
    }
  ],

  // Lesson 11: KT3.1 Pasteur's Germ Theory & Koch's Microbe Hunters (c.1861–c.1883)
  "lesson_3_1": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=ZmaoHB5fKB4",
      "id": "ZmaoHB5fKB4",
      "title": "BBC Bitesize for Teachers: Pasteur and Koch | Secondary History – Medicine Through Time",
      "duration": "4 mins 35 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Official Edexcel GCSE Medicine video analyzing Louis Pasteur's 1861 Germ Theory, swan-neck flask experiments, and Robert Koch's chemical agar staining techniques that proved specific microbes cause specific diseases. Recommended Watch Window: 00:00–04:30 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Superb classroom animations comparing spontaneous generation with germ theory.",
      "viewing_task": "<ol><li><strong>[01:10] Quick Check:</strong> What did Louis Pasteur's swan-neck flask experiment disprove regarding how microbes appeared in liquids (the theory of spontaneous generation)?</li><li><strong>[03:15] Hinge Question:</strong> How did Robert Koch build upon Pasteur's work by discovering the specific bacterial pathogens for anthrax (1876), tuberculosis (1882), and cholera (1883)?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> It disproved spontaneous generation (the belief that decay created microbes from nothing). Pasteur proved that microbes already existed in the air and multiplied only when they contaminated the sterile broth.</li><li><strong>Hinge Question:</strong> While Pasteur showed microbes caused souring, Koch developed revolutionary laboratory methods: culturing bacteria on solid agar jelly, staining microbes with methyl violet dye to make them visible under microscopes, and photographing them (microphotography) to establish his Postulates proving one specific bacterium causes one specific disease.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/6-medicine-and-infection-history-file/",
      "title": "BBC / ERA: History File – Pasteur, Koch & The Microbe Hunters",
      "duration": "21 mins 10 secs",
      "pathway": "Scientific Breakthrough",
      "teacher_guidance": "In-depth archival documentary detailing the nationalistic rivalry between France (Pasteur) and Germany (Koch) during the Franco-Prussian War era.",
      "viewing_task": "<ol><li><strong>[04:20] Recall:</strong> What deadly human disease did Robert Koch successfully identify the bacterial bacterium for in 1882, winning the Nobel Prize?</li><li><strong>[08:45] Explain:</strong> Explain how national rivalry between France and Germany accelerated medical funding for both Pasteur's Institute and Koch's laboratory.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Tuberculosis (TB - Mycobacterium tuberculosis).</li><li><strong>Explain:</strong> Following the Franco-Prussian War (1870–71), both the French Republic and the newly united German Empire viewed scientific breakthroughs as matters of national prestige and military strength, providing generous state funding to establish rival research institutes.</li></ol>"
    }
  ],

  // Lesson 12: KT3.2 Edward Jenner & Smallpox Vaccine (1796–1853)
  "lesson_3_2": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=sJRJeOxX6no",
      "id": "sJRJeOxX6no",
      "title": "BBC Bitesize for Teachers: The Life and Work of Edward Jenner (Dramatisation)",
      "duration": "4 mins 40 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "High-quality BBC dramatisation following country doctor Edward Jenner in Gloucestershire, milkmaid Sarah Nelmes, and 8-year-old James Phipps in May 1796. Recommended Watch Window: 00:00–04:30 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Captures the clinical drama of the first smallpox vaccination.",
      "viewing_task": "<ol><li><strong>[01:25] Quick Check:</strong> What folklore observation made by local Gloucestershire dairy milkmaids inspired Dr Edward Jenner to test cowpox against smallpox?</li><li><strong>[03:10] Hinge Question:</strong> Why did the Royal Society initially reject Jenner's paper in 1797, and why did religious critics and cartoonists oppose injecting bovine pus into humans?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> Milkmaids who caught the mild disease cowpox from infected cows' udders never subsequently caught the deadly, disfiguring smallpox.</li><li><strong>Hinge Question:</strong> Jenner was a country doctor who could not scientifically explain why vaccination worked (since viruses were undiscovered). The Royal Society demanded more proof; anti-vaccinationists and clergy argued it was an abomination against God to inject beasts' animal matter into God's human image, fearing people would sprout cow horns.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/3-medicine-and-health-history-file/",
      "title": "BBC / ERA: History File – Edward Jenner & The Eradication of Smallpox",
      "duration": "19 mins 50 secs",
      "pathway": "Enquiry Evidence",
      "teacher_guidance": "Documents the transition from dangerous inoculation (variolation) to safe Jennerian vaccination, culminating in Parliament making smallpox vaccination compulsory in 1853.",
      "viewing_task": "<ol><li><strong>[02:40] Recall:</strong> In what year did the British Parliament make smallpox vaccination officially compulsory for all infants?</li><li><strong>[07:15] Challenge:</strong> Compare the dangers of variolation (smallpox inoculation) with Jenner's cowpox vaccination. Why was vaccination fundamentally safer?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> 1853 (with penalties strictly enforced from 1867).</li><li><strong>Challenge:</strong> Variolation used live smallpox scabs, which frequently triggered full lethal smallpox and started new epidemics. Jenner's vaccine used mild cowpox, which caused only a mild local blister, was completely non-fatal, and could not ignite a contagious smallpox outbreak.</li></ol>"
    }
  ],

  // Lesson 13: KT3.3 Hospital Care: Florence Nightingale, Mary Seacole & Sanitary Revolution (1854–1863)
  "lesson_3_3": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=jONlz7vaMnU",
      "id": "jONlz7vaMnU",
      "title": "BBC Bitesize for Teachers: The Life and Work of Florence Nightingale (Dramatisation)",
      "duration": "4 mins 55 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Engaging BBC dramatisation of Florence Nightingale's arrival at the military hospital in Scutari during the Crimean War (1854), confronting squalor, blocked sewers, and typhus. Recommended Watch Window: 00:00–04:45 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Highlights statistical diagrams (polar area rose charts) and nursing reform.",
      "viewing_task": "<ol><li><strong>[01:30] Quick Check:</strong> What horrific sanitary conditions did Florence Nightingale find beneath the floorboards at the Scutari military hospital?</li><li><strong>[03:40] Hinge Question:</strong> How did Nightingale's sanitary reforms (clean water, unblocked sewers, scrubbed wards, fresh air) reduce death rates at Scutari from over 40% down to under 2%?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> The hospital was built over a cesspool of raw sewage; water was contaminated, drains were blocked, and dead animals rotted in courtyards while wounded men lay on filthy floors in unwashed blankets covered in lice.</li><li><strong>Hinge Question:</strong> By opening windows for pavilion-style ventilation, washing bedding in boiling water, unclogging the main sewers, and serving nutritious hot food, Nightingale eliminated the bacterial breeding grounds for waterborne cholera and airborne typhus, despite believing in miasma rather than germ theory.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=4QgfNX79eLE",
      "id": "4QgfNX79eLE",
      "title": "BBC Teach: The Victorians – Mary Seacole & The British Hotel in the Crimea",
      "duration": "4 mins 20 secs",
      "pathway": "Primary Evidence",
      "teacher_guidance": "Covers Jamaican-born nurse Mary Seacole traveling independently to the Crimea after the War Office rejected her application, establishing the 'British Hotel' near Balaclava. Recommended Watch Window: 00:00–04:00 • Lesson Phase: Guided Reading & Diverse Perspectives.",
      "viewing_task": "<ol><li><strong>[01:15] Recall:</strong> Why was Mary Seacole rejected by the War Office and Nightingale's nursing team in London?</li><li><strong>[02:50] Explain:</strong> Explain how Mary Seacole provided practical medical care and hot herbal remedies directly onto the battlefield under enemy fire.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Racial prejudice: British officials refused to accept a mixed-race Jamaican woman into the official corps of military nurses.</li><li><strong>Explain:</strong> Financing the journey with her own savings, Seacole established the British Hotel at Spring Hill, providing hot meals, clean shelter, and traditional herbal remedies for dysentery, and rode out to the frontline trenches with medical panniers to tend wounded soldiers during the siege of Sevastopol.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/scutari-hospital-cleaning-up-florence-nightingale-and-the-crimean-war-bbc-two/",
      "title": "BBC Two: Florence Nightingale – Cleaning Up Scutari & The Sanitary Revolution",
      "duration": "5 mins 15 secs",
      "pathway": "Case Study",
      "teacher_guidance": "Primary source letters and archival diagrams showing the architectural changes in civilian British hospitals inspired by Nightingale's 'Notes on Nursing' (1859).",
      "viewing_task": "<ol><li><strong>[01:40] Recall:</strong> What architectural hospital design did Nightingale advocate to maximize sunlight and cross-ventilation (the Pavilion Plan)?</li><li><strong>[03:30] Explain:</strong> How did Nightingale's training school at St Thomas' Hospital elevate nursing from an untrained, disreputable domestic task into a respected female profession?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> The Pavilion Plan (separate narrow ward pavilions with large opposing windows).</li><li><strong>Explain:</strong> She established rigorous admission standards, moral discipline, and clinical training, publishing standard textbooks and ensuring nurses were recognized as skilled medical professionals.</li></ol>"
    }
  ],

  // Lesson 14: KT3.4 Surgical Revolution: Simpson, Lister & Conquest of Pain and Sepsis (1847–1870s)
  "lesson_3_4": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=7pjAH84f-c0",
      "id": "7pjAH84f-c0",
      "title": "Simple History: The Surgical Revolution – Overcoming Pain, Infection & Blood Loss",
      "duration": "3 mins 50 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Concise animated hook introducing the three major obstacles to surgery in 1800: pain, infection (sepsis), and bleeding. Recommended Watch Window: 00:00–03:40 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Fast-paced animated overview of surgical breakthrough.",
      "viewing_task": "<ol><li><strong>[00:55] Quick Check:</strong> What were the three deadly barriers that made major internal surgery almost impossible before 1850?</li><li><strong>[02:15] Hinge Question:</strong> Why did the discovery of anaesthetics (ether and chloroform) initially lead to an increase in surgical deaths during the 'Black Period' of surgery?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> Pain (surgical shock), infection (sepsis and gangrene), and blood loss.</li><li><strong>Hinge Question:</strong> Because unconscious patients could not feel pain, surgeons attempted longer, deeper, and more complex internal operations. However, because antiseptic techniques had not yet been invented, dirty hands, unsterilized instruments, and pus-stained coats introduced lethal bacteria deeper into body cavities.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/5-medicine-and-surgery-history-file/",
      "title": "BBC / ERA: History File – Joseph Lister & The Antiseptic Revolution (1865)",
      "duration": "20 mins 10 secs",
      "pathway": "Scientific Breakthrough",
      "teacher_guidance": "Examines Joseph Lister applying Pasteur’s germ theory to surgery at Glasgow Royal Infirmary, using carbolic acid spray and dressings to prevent compound fracture infections.",
      "viewing_task": "<ol><li><strong>[03:20] Recall:</strong> What chemical disinfectant did Joseph Lister use after reading that it had safely treated foul cattle sewage in Carlisle?</li><li><strong>[07:45] Explain:</strong> Explain how Lister’s carbolic acid spray revolutionized surgical hygiene and reduced ward mortality from 46% to 15%.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Carbolic acid (phenol).</li><li><strong>Explain:</strong> Lister realized wound sepsis was putrefaction caused by airborne microbes. By soaking bandages in carbolic solution, spraying the air above the operating table, and washing hands and instruments in carbolic acid, he killed bacteria before they could colonize open tissue.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=z9rKY8MLWTU",
      "id": "z9rKY8MLWTU",
      "title": "The Knick | Surgery in the Era of Discovery (Cinemax / HBO)",
      "duration": "2 mins 20 secs",
      "pathway": "Cinematic",
      "teacher_guidance": "Recommended Watch Window: 00:00–02:20 | Lesson Phase: Visual & Cultural Impact | Tone Alert: Depicts late 19th-century surgical amphitheatres, speed, and sepsis.",
      "viewing_task": "[01:10] Cinematic Discussion Focus: How does the series depict the horrifying 'Black Period' of surgery before antiseptics, where speed was prized over cleanliness?",
      "model_answer": "Cinematic Discussion Focus: The trailer shows surgeons operating in frock coats stiff with dried blood and pus, surrounded by smoking observers, capturing the paradox of technical surgical bravery alongside fatal postoperative infection."
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=2hTZNDyLPLk",
      "id": "2hTZNDyLPLk",
      "title": "Pain, Pus and Poison: Episode 1 (Pain) | BBC / Michael Mosley",
      "duration": "14 mins 00 secs",
      "pathway": "Documentary Depth",
      "teacher_guidance": "Recommended Watch Window: 01:00–12:30 | Lesson Phase: Anaesthetic Revolution | Tone Alert: Explores nitrous oxide, ether, and James Simpson's chloroform experiments.",
      "viewing_task": "<ol><li><strong>[02:30] Recall:</strong> What chemical did Dr James Simpson test on himself and his dinner guests in Edinburgh in November 1847 (chloroform)?</li><li><strong>[06:00] Explain:</strong> Why did religious conservatives oppose anaesthesia in childbirth, citing Genesis: 'In sorrow thou shalt bring forth children'?</li><li><strong>[10:15] Challenge:</strong> How did Queen Victoria's use of chloroform during the 1853 birth of Prince Leopold transform public and medical acceptance of pain relief?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Chloroform; Simpson woke under the table to find his colleagues unconscious and realized he had found the ideal anaesthetic.</li><li><strong>Explain:</strong> Clergy argued pain was God's divine punishment for Eve's original sin and that eliminating pain interfered with God's moral order.</li><li><strong>Challenge:</strong> The Queen publicly praised chloroform as 'that blessed chloroform, soothing and delightful beyond measure'; royal endorsement instantly silenced religious objections and made anaesthesia fashionable.</li></ol>"
    }
  ],

  // Lesson 15: KT3.5 Public Health & Cholera: John Snow, Broad Street Pump & 1875 Act
  "lesson_3_5": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=TT4Z1Ikf36w",
      "id": "TT4Z1Ikf36w",
      "title": "Simple History: Edwin Chadwick & John Snow – The 19th Century Public Health Crisis",
      "duration": "3 mins 35 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Animated overview of urban slums, cesspools, Edwin Chadwick's 1842 Sanitary Report, and John Snow's Soho investigation. Recommended Watch Window: 00:00–03:30 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Excellent visual contrasts of Victorian industrial squalor.",
      "viewing_task": "<ol><li><strong>[01:00] Quick Check:</strong> What did Edwin Chadwick recommend in his 1842 Report on the Sanitary Condition of the Labouring Population?</li><li><strong>[02:30] Hinge Question:</strong> Why was the 1848 Public Health Act largely ineffective compared to the compulsory 1875 Public Health Act?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> Government intervention to provide clean running water, underground sewers, rubbish collection, and appoint Medical Officers of Health.</li><li><strong>Hinge Question:</strong> The 1848 Act was purely permissive (voluntary)—local town councils could choose to ignore it to avoid raising local rates (taxes). The 1875 Act made clean water, sewer provision, and building regulations strictly compulsory under the law.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=N9LC-3ZKiok",
      "id": "N9LC-3ZKiok",
      "title": "TED-Ed: How a Ghost Map Helped End a Cholera Outbreak – John Snow (1854)",
      "duration": "4 mins 52 secs",
      "pathway": "Case Study",
      "teacher_guidance": "Detailed breakdown of John Snow plotting cholera deaths on a street map of Soho, London, tracing the epicenter to the handle of the Broad Street water pump. Recommended Watch Window: 00:30–04:30 • Lesson Phase: Enquiry Evidence.",
      "viewing_task": "<ol><li><strong>[01:15] Recall:</strong> What did prevailing medical orthodoxy in 1854 believe was the cause of cholera before John Snow's investigation?</li><li><strong>[02:45] Explain:</strong> Explain how John Snow's 'ghost map' proved that water, not airborne miasma, was transmitting cholera to local residents.</li><li><strong>[03:50] Challenge:</strong> What single practical action did Dr John Snow persuade the parish guardians to take that immediately caused new cholera cases to plummet?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Miasma theory (foul, poisonous vapours arising from rotting waste and cesspools).</li><li><strong>Explain:</strong> He noted that deaths clustered heavily around the Broad Street pump, while workers at the nearby brewery (who drank beer instead of water) suffered zero deaths, demonstrating that infection occurred through ingesting contaminated water.</li><li><strong>Challenge:</strong> He removed the handle from the Broad Street pump, preventing residents from drawing contaminated well water.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/the-sewer-king-seven-wonders-of-the-industrial-world-bbc-two/",
      "title": "BBC Two: Seven Wonders – Joseph Bazalgette & The Great Stink (1858)",
      "duration": "5 mins 40 secs",
      "pathway": "Strategic Overview",
      "teacher_guidance": "Examines the scorching summer of 1858 when the River Thames dried up into an unbearable sewer, forcing Parliament to fund Joseph Bazalgette's 1,100-mile underground London sewer network.",
      "viewing_task": "<ol><li><strong>[01:50] Recall:</strong> What event in the summer of 1858 finally persuaded Parliament to overcome its 'laissez-faire' attitude and spend £3 million on London's sewers?</li><li><strong>[03:40] Explain:</strong> How did Bazalgette's Victorian engineering achievement permanently eliminate cholera from London, even though it was built to eliminate bad smells?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> The Great Stink (the unbearable stench of raw sewage baking in the Thames that forced MPs to soak curtains in chloride of lime to sit in the Commons).</li><li><strong>Explain:</strong> Bazalgette intercepted wastewater before it reached London's drinking supply, pumping it 12 miles downstream into the Thames estuary, accidentally separating human sewage from city drinking water decades before germ theory was fully embraced.</li></ol>"
    }
  ],

  // Lesson 17: KT4.2 Lifestyle Factors & The Technological Revolution in Diagnosis (c.1900–present)
  "lesson_4_2": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=gsV7SJDDCY4",
      "id": "gsV7SJDDCY4",
      "title": "TED-Ed: How X-Rays See Through Your Skin – Wilhelm Röntgen & Modern Imaging",
      "duration": "4 mins 40 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Fascinating examination of Wilhelm Röntgen's accidental 1895 discovery of X-rays and how medical imaging evolved through CT scans (CAT) and MRI. Recommended Watch Window: 00:00–04:20 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Clear physics animations showing electromagnetic penetration and soft tissue contrast.",
      "viewing_task": "<ol><li><strong>[01:10] Quick Check:</strong> Why do dense materials like human bone appear bright white on an X-ray film while softer tissues appear darker?</li><li><strong>[02:40] Hinge Question:</strong> How did 20th-century diagnostic machines (X-rays, CT scans, and MRI) liberate surgeons from having to perform dangerous 'exploratory laparotomy' operations?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> Calcium in bones absorbs high-energy X-ray photons, casting a white shadow on the photographic plate, whereas soft muscle and fat allow X-rays to pass through.</li><li><strong>Hinge Question:</strong> Before non-invasive imaging, surgeons had to cut open living patients simply to see if a tumour was present or where a bullet was lodged. Modern imaging allows precise, three-dimensional internal diagnosis before making a single surgical incision.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=CLUmwaff4a8",
      "id": "CLUmwaff4a8",
      "title": "Medical Research Council: Doll & Peto – The Epidemiological Proof That Smoking Causes Lung Cancer",
      "duration": "4 mins 15 secs",
      "pathway": "Scientific Breakthrough",
      "teacher_guidance": "Primary documentary footage examining Sir Richard Doll and Austin Bradford Hill's landmark 1950 British Doctors Study, proving statistically that cigarette smoking causes lung cancer. Recommended Watch Window: 00:00–04:00 • Lesson Phase: Guided Instruction & Lifestyle Risk Factors.",
      "viewing_task": "<ol><li><strong>[01:20] Recall:</strong> What methodology did Richard Doll and Bradford Hill use in 1951, surveying over 40,000 British doctors over decades?</li><li><strong>[02:50] Explain:</strong> Explain why establishing statistical epidemiology was essential for shifting modern healthcare focus towards lifestyle choices (diet, alcohol, smoking).</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> A prospective cohort study (tracking 40,000 doctors who agreed to report their smoking habits and following mortality causes over decades).</li><li><strong>Explain:</strong> Unlike infectious diseases caused by a single bacterium, chronic 20th-century killers like lung cancer and cardiovascular disease develop slowly from lifestyle habits; epidemiology provided undeniable mathematical proof that prompted government prevention policies.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/pain-pus-and-poison-the-search-for-modern-medicine-poisons-chemical-cures-bbc-four/",
      "title": "BBC Four: Pain, Pus & Poison – Ehrlich, Syphilis & The Arsenic Magic Bullet",
      "duration": "6 mins 30 secs",
      "pathway": "Documentary Depth",
      "teacher_guidance": "Dr Michael Mosley explores the chemical revolution in modern medicine.",
      "viewing_task": "<ol><li><strong>[02:15] Recall:</strong> What chemical element did Paul Ehrlich base Salvarsan 606 upon?</li><li><strong>[04:40] Explain:</strong> Why was Salvarsan called a 'magic bullet'?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Arsenic.</li><li><strong>Explain:</strong> It targeted the Treponema pallidum syphilis bacteria specifically while sparing healthy human tissue.</li></ol>"
    }
  ],

  // Lesson 18: KT4.3 Magic Bullets, High-Tech Treatments & Birth of NHS (1909–1948)
  "lesson_4_3": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=0pnEMBgEG24",
      "id": "0pnEMBgEG24",
      "title": "The Foundation of the National Health Service | BBC Bitesize",
      "duration": "4 mins 10 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Official BBC overview of healthcare in Britain before 1948, William Beveridge's 1942 Report, and Aneurin Bevan launching the NHS on 5 July 1948. Recommended Watch Window: 00:00–04:00 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Moving oral testimonies of pre-NHS poverty.",
      "viewing_task": "<ol><li><strong>[01:15] Quick Check:</strong> What were the three core founding principles of the National Health Service established by Aneurin Bevan in 1948?</li><li><strong>[02:45] Hinge Question:</strong> Why did the British Medical Association (BMA) and 90% of doctors initially threaten to strike and boycott the launch of the NHS?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> 1) Free at the point of delivery; 2) Universal (available to everyone regardless of wealth); 3) Financed through general taxation.</li><li><strong>Hinge Question:</strong> Private GPs feared becoming salaried civil servants under state control and losing lucrative private fees; Bevan famously won them over by allowing consultants to keep private beds in NHS hospitals and paying GPs per registered patient ('stuffing their mouths with gold').</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=g-jdWYZTPYc",
      "id": "g-jdWYZTPYc",
      "title": "Paul Ehrlich: The Search for the Magic Bullet (Salvarsan 606)",
      "duration": "3 mins 30 secs",
      "pathway": "Scientific Breakthrough",
      "teacher_guidance": "Examines Paul Ehrlich and Sahachiro Hata testing 606 arsenic chemical compounds to synthesize Salvarsan in 1909, the world's first targeted chemotherapy for syphilis. Recommended Watch Window: 00:00–03:20 • Lesson Phase: Guided Reading.",
      "viewing_task": "<ol><li><strong>[01:05] Recall:</strong> What German company developed Prontosil in 1932, the second magic bullet that cured puerperal fever in mothers?</li><li><strong>[02:30] Explain:</strong> Explain the fundamental chemical difference between an antiseptic (like carbolic acid) and a targeted magic bullet (like Salvarsan or Prontosil).</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Bayer (discovered by Gerhard Domagk).</li><li><strong>Explain:</strong> Antiseptics are harsh external chemicals that destroy both bacteria and living human flesh indiscriminately if taken internally. Magic bullets are synthetic chemical compounds engineered to lock onto specific bacterial structures and kill them safely inside the human bloodstream.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/aneurin-bevan-and-the-creation-of-the-nhs-bbc-two/",
      "title": "BBC Two: Aneurin Bevan & The Launch of the NHS (5 July 1948)",
      "duration": "5 mins 35 secs",
      "pathway": "Turning Point",
      "teacher_guidance": "Archival footage of Sylvia Diggory (first NHS patient) at Park Hospital, Manchester, being treated by Bevan.",
      "viewing_task": "<ol><li><strong>[01:20] Recall:</strong> At which hospital in Manchester did Aneurin Bevan officially inaugurate the NHS on 5 July 1948?</li><li><strong>[03:40] Explain:</strong> How did free NHS access immediately expose hidden health crises among working-class women and children?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Park Hospital, Davyhulme (near Manchester).</li><li><strong>Explain:</strong> Free access led to millions of pent-up untreated conditions being brought forward: millions of spectacles, dental dentures, and surgical repairs for prolapsed wombs were issued in the first year alone.</li></ol>"
    }
  ],

  // Lesson 19: KT4.4 Case Study 1: Antibiotic Revolution: Fleming, Florey & Chain and Penicillin (1928–1945)
  "lesson_4_4": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=N2-7UQWrYPY",
      "id": "N2-7UQWrYPY",
      "title": "BBC Bitesize for Teachers: Fleming, Florey and Chain | Secondary History – Medicine Through Time",
      "duration": "4 mins 25 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Official Edexcel GCSE video tracing Alexander Fleming's 1928 accidental observation at St Mary's Hospital, London, and Howard Florey & Ernst Chain's Oxford team purifying and mass-producing penicillin during WWII. Recommended Watch Window: 00:00–04:20 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Excellent archival animations explaining penicillin's action.",
      "viewing_task": "<ol><li><strong>[01:10] Quick Check:</strong> What did Alexander Fleming notice on an unwashed petri dish of Staphylococcus bacteria left beside an open window in September 1928?</li><li><strong>[02:40] Hinge Question:</strong> Why was Fleming unable to turn his 1928 discovery into a working drug, and what decisive role did Howard Florey and Ernst Chain play in Oxford in 1940?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> A ring of clear jelly around a blob of green Penicillium notatum mould where bacteria had been completely destroyed.</li><li><strong>Hinge Question:</strong> Fleming was an investigator rather than a chemist; he could not isolate or purify the active antibiotic substance. Florey and Chain assembled a multidisciplinary team in Oxford, extracted pure penicillin crystals using bedpans and milk churns, and proved its efficacy in mice and humans (Albert Alexander).</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/breaking-the-mould-the-story-of-penicillin/",
      "title": "Cinematic: Breaking the Mould – The Oxford Penicillin Drama starring Dominic West",
      "duration": "12 mins 30 secs",
      "pathway": "Cinematic",
      "teacher_guidance": "BBC dramatisation of Howard Florey, Ernst Chain, and Norman Heatley culturing penicillin in Oxford during the Blitz, and the tragic clinical trial of Constable Albert Alexander (1941).",
      "viewing_task": "<ol><li><strong>[03:15] Recall:</strong> Who was the first human patient treated with penicillin in Oxford in February 1941?</li><li><strong>[08:20] Explain:</strong> Why did Florey travel to the United States in 1941 to persuade American pharmaceutical companies (Pfizer, Squibb) to adopt deep-tank fermentation?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Police Constable Albert Alexander, who was dying of severe septicemia from an infected rose-thorn scratch.</li><li><strong>Explain:</strong> British factories were fully mobilized manufacturing aircraft and munitions during the Blitz and lacked industrial capacity; US government subsidies and corn-steep liquor fermentation allowed millions of doses to be produced in time for D-Day (June 1944).</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=mlDO-uKMNWk",
      "id": "mlDO-uKMNWk",
      "title": "Pain, Pus and Poison: Episode 2 (Pus) | BBC / Michael Mosley",
      "duration": "14 mins 00 secs",
      "pathway": "Documentary Depth",
      "teacher_guidance": "Recommended Watch Window: 01:00–12:30 | Lesson Phase: Penicillin & Modern Antibiotics | Tone Alert: Explores how penicillin transformed battlefield survival in WWII.",
      "viewing_task": "<ol><li><strong>[04:20] Recall:</strong> How many doses of penicillin were available for Allied wounded on D-Day (6 June 1944)?</li><li><strong>[08:50] Challenge:</strong> How has the modern over-prescription of antibiotics created dangerous antimicrobial resistance (e.g. MRSA)?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Over 2.3 million doses.</li><li><strong>Challenge:</strong> Excessive antibiotic usage in human healthcare and livestock farming allows bacteria to evolve natural defenses, leading to superbugs that resist conventional antibiotic treatments.</li></ol>"
    }
  ],

  // Lesson 20: KT4.5 Case Study 2: Public Health & The Fight Against Lung Cancer (c.1950–present)
  "lesson_4_5": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=js_Kab5C2xI",
      "id": "js_Kab5C2xI",
      "title": "Public Health Interventions: The Battle Against Smoking | UK Parliament",
      "duration": "4 mins 15 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Examines UK government legislation: 1965 cigarette TV advertising ban, 2007 ban on smoking in enclosed public spaces, plain standardized packaging (2016). Recommended Watch Window: 00:00–04:00 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Official parliamentary archive footage.",
      "viewing_task": "<ol><li><strong>[01:10] Quick Check:</strong> In what year did the British Parliament pass the historic legislation banning smoking in all enclosed workplaces and public venues (pubs, restaurants, buses)?</li><li><strong>[02:40] Hinge Question:</strong> Contrast modern government preventative health interventions (tobacco taxation, advertising bans) with the laissez-faire attitudes of Victorian governments in 1848.</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> 2007 (enforced across England from 1 July 2007).</li><li><strong>Hinge Question:</strong> Victorian governments believed individuals were personally responsible for their own health and resisted regulation to avoid infringing personal liberty and commercial trade. In the 20th and 21st centuries, the state actively intervenes with statutory bans, heavy duties, warning graphics, and mass educational campaigns to protect the public from commercial carcinogens.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=tlNtakmOOho",
      "id": "tlNtakmOOho",
      "title": "GCSE History: Modern Medicine – Government Action & The Battle Against Lung Cancer",
      "duration": "5 mins 05 secs",
      "pathway": "Case Study",
      "teacher_guidance": "Comprehensive GCSE revision breakdown of lung cancer diagnosis (bronchoscopy, CT scans), treatments (chemotherapy, radiotherapy, targeted lobectomies), and government prevention. Recommended Watch Window: 00:30–04:45 • Lesson Phase: Guided Reading.",
      "viewing_task": "<ol><li><strong>[01:30] Recall:</strong> Name two modern diagnostic tools used to detect lung cancer in patients before symptoms become terminal.</li><li><strong>[03:20] Explain:</strong> Explain why preventative government action (education and bans) is significantly more cost-effective for the NHS than surgical chemotherapy treatments once lung cancer has developed.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> CT (computed tomography) scans and bronchoscopy (inserting a flexible endoscope camera into the bronchial airways to take a biopsy).</li><li><strong>Explain:</strong> Lung cancer has one of the lowest 5-year survival rates because symptoms like coughing blood only appear late; treating late-stage cancer with specialized immunotherapy and operations costs hundreds of thousands of pounds with poor outcomes, whereas stopping people smoking eliminates the cause before disease strikes.</li></ol>"
    }
  ],

  // Lesson 21: KT5.1 The Theatre of War: The British Sector, Trench Geography & Battles (1914–1918)
  "lesson_5_1": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=bSPh5Jgx_wY",
      "id": "bSPh5Jgx_wY",
      "title": "Simple History: The British Sector – Frontline Trenches, Geography & Communication",
      "duration": "3 mins 40 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Explores the structure of frontline, support, and reserve trenches, dugouts, and communication lines in the British sector of Flanders and northern France. Recommended Watch Window: 00:00–03:30 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Clear architectural animations of trench engineering.",
      "viewing_task": "<ol><li><strong>[00:50] Quick Check:</strong> Why were trenches dug in a zigzag pattern with traverses rather than in straight continuous lines?</li><li><strong>[02:15] Hinge Question:</strong> How did the geography of Flanders (low-lying clay soil and high water table) create unique medical nightmares for stretcher bearers and doctors?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> Traverses prevented enemy machine-gunners from firing all the way down a trench and contained blast shrapnel within a single bay.</li><li><strong>Hinge Question:</strong> Because the water table was only a few feet below the surface, trenches flooded constantly with mud, destroying communication trenches and forcing stretcher bearers to wade through waist-deep slime, delaying wounded evacuation for hours.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=YqNYrYUiMfg",
      "id": "YqNYrYUiMfg",
      "title": "1917 (2019) | Official Feature Trailer (Sam Mendes / Universal Pictures)",
      "duration": "2 mins 24 secs",
      "pathway": "Cinematic",
      "teacher_guidance": "Recommended Watch Window: 00:00–02:24 | Lesson Phase: Visual & Cultural Impact | Tone Alert: Oscar-winning cinematic depiction of No Man's Land, craters, mud, and front-line aid posts.",
      "viewing_task": "[01:15] Cinematic Discussion Focus: How does the film's continuous shot capture the horrifying terrain of the Western Front and the extreme difficulty of stretcher-bearers transporting wounded soldiers?",
      "model_answer": "Cinematic Discussion Focus: The trailer shows knee-deep mud, razor-sharp barbed wire, rotting horse carcasses, and waterlogged shell holes, visually illustrating why moving a wounded soldier to a dressing station took hours under constant shellfire."
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/4-medicine-and-war-history-file/",
      "title": "BBC / ERA: History File – Medicine & War in the British Sector (1914–1918)",
      "duration": "22 mins 15 secs",
      "pathway": "Enquiry Evidence",
      "teacher_guidance": "Archival examination of the major battles in the British sector: Ypres (1914, 1915, 1917), Somme (1916), Arras (1917), and Cambrai (1917).",
      "viewing_task": "<ol><li><strong>[04:30] Recall:</strong> Name two major battles fought in the British sector that caused immense casualty spikes for the RAMC.</li><li><strong>[08:15] Explain:</strong> How did underground chalk quarries and tunnels at Arras allow the RAMC to build an underground hospital with 700 beds?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> The Battle of the Somme (1916) and the Third Battle of Ypres / Passchendaele (1917).</li><li><strong>Explain:</strong> The British expanded ancient medieval chalk quarries beneath the city of Arras, creating an electric-lit underground hospital complete with operating theatres, kitchens, and water supplies safely protected from artillery bombardment.</li></ol>"
    }
  ],

  // Lesson 22: KT5.2 The Trench Environment: Mud, Vermin & Non-Combat Illnesses (1914–1918)
  "lesson_5_2": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=bSPh5Jgx_wY",
      "id": "bSPh5Jgx_wY",
      "title": "Simple History: The Trench Environment – Mud, Vermin & Non-Combat Conditions",
      "duration": "3 mins 40 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Examines trench foot, body lice causing trench fever, brown rats, and dysentery. Recommended Watch Window: 00:00–03:30 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Vivid historical animation.",
      "viewing_task": "<ol><li><strong>[01:00] Quick Check:</strong> What were the causes and primary symptoms of 'trench foot' among British frontline soldiers?</li><li><strong>[02:20] Hinge Question:</strong> How did British Army orders (rubbing whale oil on feet, pairing soldiers into 'foot partners', and dry socks) successfully reduce trench foot cases by 1917?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> Standing for days in cold, muddy, waterlogged trenches constricted blood flow, causing numbness, gangrenous rotting of skin, and blisters that frequently required amputation.</li><li><strong>Hinge Question:</strong> By making daily foot inspections mandatory, requiring men to change into dry socks twice daily, and ordering comrades to rub whale oil into each other's feet to create a waterproof barrier, military discipline arrested the fungal decay.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=x8OazQml0gw",
      "id": "x8OazQml0gw",
      "title": "Dan Snow: WW1 Uncut – Trench Infections, Lice & Trench Fever",
      "duration": "4 mins 10 secs",
      "pathway": "Primary Evidence",
      "teacher_guidance": "Dan Snow examines the role of body lice living in trouser seams, transmitting the debilitating Bartonella quintana bacterium that caused 'trench fever'. Recommended Watch Window: 00:00–04:00 • Lesson Phase: Archival Exploration.",
      "viewing_task": "<ol><li><strong>[01:15] Recall:</strong> What percentage of British troops suffered from trench fever during periods of prolonged frontline service?</li><li><strong>[02:45] Explain:</strong> Explain why delousing stations and fumigation machines behind the lines were critical for maintaining military manpower.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> An estimated 15% to 20% of all British frontline casualties were hospitalized with trench fever.</li><li><strong>Explain:</strong> Trench fever caused high relapsing fevers, severe muscle ache, and incapacitated soldiers for months; bathing stations and steam fumigators for uniforms were military essentials to kill lice eggs and restore fighting strength.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=YqNYrYUiMfg",
      "id": "YqNYrYUiMfg",
      "title": "1917 (2019) | Official Feature Trailer (Sam Mendes / Universal Pictures)",
      "duration": "2 mins 24 secs",
      "pathway": "Cinematic",
      "teacher_guidance": "Recommended Watch Window: 00:00–02:24 | Lesson Phase: Visual & Cultural Impact.",
      "viewing_task": "[01:15] Cinematic Discussion Focus: How does the film's continuous shot capture the horrifying terrain of the Western Front?",
      "model_answer": "Cinematic Discussion Focus: The trailer shows knee-deep mud, razor-sharp barbed wire, rotting horse carcasses, and waterlogged shell holes."
    }
  ],

  // Lesson 23: KT5.3 Battlefield Trauma: High Explosive Shrapnel, Gas Attacks & Infection (1914–1918)
  "lesson_5_3": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=vmir6SxYNII",
      "id": "vmir6SxYNII",
      "title": "Simple History: First World War Tech – Chlorine, Phosgene & Mustard Gas",
      "duration": "3 mins 50 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Visual breakdown of the first gas attack at Second Ypres (April 1915), the evolution of poison gases (chlorine, phosgene, mustard gas), and gas mask developments. Recommended Watch Window: 00:00–03:40 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Clear animated technical explanation.",
      "viewing_task": "<ol><li><strong>[01:05] Quick Check:</strong> What were the distinct symptoms of mustard gas, introduced by the German army in July 1917 at Ypres?</li><li><strong>[02:40] Hinge Question:</strong> How did poison gas produce severe psychological terror among troops even though it accounted for fewer than 3% of total British combat fatalities?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> Mustard gas was an odourless blistering agent that caused internal and external chemical burns, blistering skin, temporary blindness, and stripped the bronchial lining over weeks.</li><li><strong>Hinge Question:</strong> Unlike artillery shells which exploded instantly, gas remained lingering silently in craters and trenches for days; the constant dread of suffocation, having to sleep in rubber gas masks, and agonizing slow blindness generated intense psychological trauma far beyond its lethal percentage.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=xGpGlthfAQU",
      "id": "xGpGlthfAQU",
      "title": "Simple History: The Brodie Helmet (1915) – The Steel Helmet Revolution",
      "duration": "3 mins 15 secs",
      "pathway": "Primary Evidence",
      "teacher_guidance": "Examines the design of the British steel Brodie helmet introduced in autumn 1915 to protect soldiers' heads from exploding shrapnel and bullet fragments. Recommended Watch Window: 00:00–03:10 • Lesson Phase: Guided Instruction.",
      "viewing_task": "<ol><li><strong>[00:50] Recall:</strong> What soft cloth headdress did British soldiers wear into battle in 1914 before steel helmets were invented?</li><li><strong>[02:10] Explain:</strong> Explain how the wide steel brim of the Brodie helmet reduced fatal head wounds from artillery shrapnel by over 70%.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> The soft khaki cloth peaked service cap.</li><li><strong>Explain:</strong> High-explosive artillery shells exploded overhead, showering soldiers with razor-sharp lead shrapnel balls; the pressed steel dome and wide downward-sloping brim deflected falling fragments away from the brain and cervical spine.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=YqNYrYUiMfg",
      "id": "YqNYrYUiMfg",
      "title": "1917 (2019) | Official Feature Trailer (Sam Mendes / Universal Pictures)",
      "duration": "2 mins 24 secs",
      "pathway": "Cinematic",
      "teacher_guidance": "Depicts No Man's Land, craters, and artillery shrapnel wounds.",
      "viewing_task": "[01:15] Cinematic Discussion Focus: How does the film capture shrapnel and trauma?",
      "model_answer": "Cinematic Discussion Focus: Shows craters and shattered terrain."
    }
  ],

  // Lesson 24: KT5.4 The Chain of Evacuation: Stretcher Bearers, RAP, Dressing Stations & CCS (1914–1918)
  "lesson_5_4": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=IrabKK9Bhds",
      "id": "IrabKK9Bhds",
      "title": "Warner Bros: Peter Jackson's 'They Shall Not Grow Old' – Stretcher Bearers & Field Casualties",
      "duration": "2 mins 30 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Restored, colorized, and speed-corrected archival footage from the Imperial War Museums showing British stretcher bearers navigating mud and craters. Recommended Watch Window: 00:00–02:30 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Moving restored archival footage.",
      "viewing_task": "<ol><li><strong>[00:55] Quick Check:</strong> Why did it require four to six stretcher bearers instead of two to carry one wounded soldier across Flanders mud?</li><li><strong>[01:45] Hinge Question:</strong> How did speed of evacuation along the chain dictate whether a soldier survived gas gangrene or hemorrhagic shock?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> Deep, sucking mud and slippery duckboards meant bearers constantly sank to their waists, requiring extra men to rotate and prevent the stretcher from dropping.</li><li><strong>Hinge Question:</strong> The bacteria that caused gas gangrene thrived in oxygen-deprived deep muscle wounds; if a soldier reached a Casualty Clearing Station (CCS) within 12 hours for surgical debridement, tissue could be saved, but longer delays led to fatal systemic sepsis.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=YfxRhLsAAk8",
      "id": "YfxRhLsAAk8",
      "title": "Medicine in the First World War: Chain of Evacuation | Imperial War Museums",
      "duration": "13 mins 30 secs",
      "pathway": "Documentary Depth",
      "teacher_guidance": "Detailed archival analysis of each stage of the Chain: Regimental Aid Post (RAP), Advanced Dressing Station (ADS), Casualty Clearing Station (CCS), and Base Hospitals. Recommended Watch Window: 01:00–12:00 • Lesson Phase: Guided Inquiry.",
      "viewing_task": "<ol><li><strong>[02:30] Recall:</strong> What were the sequential stages of the Chain of Evacuation from the frontline trench back to Britain?</li><li><strong>[06:00] Explain:</strong> Explain why the Casualty Clearing Station (CCS) was the most critical medical facility in the entire evacuation chain.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Regimental Aid Post (RAP) -> Advanced Dressing Station (ADS) -> Casualty Clearing Station (CCS) -> Base Hospital -> 'Blighty' (UK hospitals).</li><li><strong>Explain:</strong> The CCS was located just out of artillery range (around 7–12 miles behind lines) with surgical teams, mobile X-rays, and wards, performing urgent lifesaving operations (amputations, wound debridement) before infection spread.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/field-hospitals-treatment-for-ww1-soldiers-medicine-on-the-western-front-bbc-two/",
      "title": "BBC Two: Western Front – The Chain of Evacuation & Field Hospitals",
      "duration": "4 mins 50 secs",
      "pathway": "Primary Evidence",
      "teacher_guidance": "BBC footage analyzing the triage system used at Casualty Clearing Stations to categorize casualties.",
      "viewing_task": "<ol><li><strong>[01:15] Recall:</strong> What three triage categories were wounded soldiers divided into at the CCS?</li><li><strong>[03:20] Explain:</strong> How did motorized ambulances and hospital trains transform casualty survival compared to horse-drawn carts in 1914?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> 1) Walking wounded (fit for duty after bandaging); 2) Immediate surgery needed (severe shock/bleeding); 3) Moribund / hopeless cases (palliative care).</li><li><strong>Explain:</strong> Motorized ambulances cushioned wounded men from violent bone-grating jolts and reduced transport time from frontline dressing stations to CCS hospitals from over ten hours down to under one hour.</li></ol>"
    }
  ],

  // Lesson 25: KT5.5 Surgical Breakthroughs: The Thomas Splint, Wound Debridement & Mobile X-Rays (1914–1918)
  "lesson_5_5": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=g1W4MHlEqZE",
      "id": "g1W4MHlEqZE",
      "title": "The HISTORY Channel: Marie Curie Helped Win WWI – Mobile X-Ray Units ('Petites Curies')",
      "duration": "3 mins 45 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Examines Marie Curie outfitting 20 vehicles with radiological equipment and dynamos powered by the car engines, bringing mobile radiography directly to field hospitals. Recommended Watch Window: 00:00–03:40 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Fast-paced archival overview.",
      "viewing_task": "<ol><li><strong>[01:00] Quick Check:</strong> What were the vehicle-mounted mobile X-ray units developed by Marie Curie nicknamed on the Western Front?</li><li><strong>[02:30] Hinge Question:</strong> How did mobile X-rays revolutionize battlefield surgery by pinpointing exact locations of embedded shrapnel and shattered bone fragments?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> 'Petites Curies' (Little Curies).</li><li><strong>Hinge Question:</strong> Before X-rays, surgeons had to probe blindly into open wounds with forceps or fingers, introducing dirt and severing arteries. X-rays allowed surgeons to see precisely where shrapnel was lodged before making surgical incisions, drastically reducing operation times and tissue trauma.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/the-carrel-dakin-method-and-thomas-splint-medicine-on-the-western-front-bbc-two/",
      "title": "BBC Two: Western Front – The Carrel-Dakin Method, Wound Debridement & The Thomas Splint",
      "duration": "5 mins 10 secs",
      "pathway": "Scientific Breakthrough",
      "teacher_guidance": "Examines Hugh Owen Thomas's splint (introduced by his nephew Robert Jones in 1915) and Alexis Carrel & Henry Dakin's chemical antiseptic wound irrigation system.",
      "viewing_task": "<ol><li><strong>[01:15] Recall:</strong> By what percentage did the Thomas Splint reduce mortality from compound femur fractures between 1914 and 1916?</li><li><strong>[03:30] Explain:</strong> Explain the surgical technique of 'wound debridement' followed by the Carrel-Dakin antiseptic irrigation system.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Reduced mortality from approximately 80% down to under 20%.</li><li><strong>Explain:</strong> Surgeons cut away all dead, bruised, or infected muscle tissue (debridement) and threaded rubber tubes throughout the wound, irrigating it continuously with a buffered sodium hypochlorite solution (Carrel-Dakin) to kill gas gangrene bacteria before stitching the wound closed.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/the-crimson-field-western-front-field-hospital-bbc-one/",
      "title": "Cinematic: The Crimson Field (BBC Drama) – Frontline Surgery & The Battle Against Wound Infection",
      "duration": "4 mins 15 secs",
      "pathway": "Cinematic",
      "teacher_guidance": "BBC One drama set in a base hospital in Boulogne examining Voluntary Aid Detachment (VAD) nurses and surgeons operating around the clock.",
      "viewing_task": "[01:30] Cinematic Discussion Focus: How does the drama illustrate the psychological and physical exhaustion of surgeons dealing with unending streams of shrapnel casualties?",
      "model_answer": "Cinematic Discussion Focus: Shows surgeons operating non-stop for 48 hours in blood-soaked aprons during major offensives."
    }
  ],

  // Lesson 26: KT5.6 Lifesaving Innovations: Blood Storage, Brain Surgery & Plastic Reconstruction (1914–1918)
  "lesson_5_6": [
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=_nZ8f6zHufg",
      "id": "_nZ8f6zHufg",
      "title": "GCSE History: Harold Gillies – 'The Father of Plastic Surgery' & Queen's Hospital Sidcup",
      "duration": "4 mins 15 secs",
      "pathway": "Starter Hook",
      "teacher_guidance": "Case study of Harold Gillies pioneering the 'tubed pedicle' reconstructive technique at Queen's Hospital, Sidcup, restoring facial structure for disfigured soldiers. Recommended Watch Window: 00:00–04:00 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Sensitive treatment of facial disfigurement.",
      "viewing_task": "<ol><li><strong>[01:05] Quick Check:</strong> What specialized military hospital in Kent was established in 1917 specifically for facial reconstruction surgery?</li><li><strong>[02:40] Hinge Question:</strong> How did Harold Gillies' 'tubed pedicle' technique solve the problem of tissue necrosis and graft rejection in facial reconstruction?</li></ol>",
      "model_answer": "<ol><li><strong>Quick Check:</strong> The Queen's Hospital, Sidcup (Kent).</li><li><strong>Hinge Question:</strong> A flap of skin was rolled into a tube with its base still attached to the chest or neck, maintaining its original living blood supply. Once the other end took root in the damaged face, the original base was cut free, preventing the skin graft from dying of blood starvation.</li></ol>"
    },
    {
      "type": "era",
      "url": "https://era.org.uk/streaming-service-resource/blood-transfusions-and-storage-medicine-on-the-western-front-bbc-two/",
      "title": "BBC Two: Western Front – Blood Storage, Transfusions & Oswald Robertson (Cambrai 1917)",
      "duration": "4 mins 45 secs",
      "pathway": "Scientific Breakthrough",
      "teacher_guidance": "Archival analysis of Oswald Robertson's blood bank at the Battle of Cambrai (1917), using sodium citrate and glucose to store refrigerated blood for up to 28 days.",
      "viewing_task": "<ol><li><strong>[01:10] Recall:</strong> What chemical compound discovered by Richard Lewisohn in 1915 prevented stored blood from coagulating into solid clots?</li><li><strong>[03:15] Explain:</strong> Explain how Oswald Robertson designed the first mobile blood depot at the Battle of Cambrai in November 1917.</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Sodium citrate (added with glucose/dextrose).</li><li><strong>Explain:</strong> Robertson collected Type O universal donor blood in advance, preserved it with sodium citrate and glucose, and packed the bottles in ammunition crates lined with ice and sawdust, allowing immediate transfusions right at the Casualty Clearing Station.</li></ol>"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=b81O3LrECtI",
      "id": "b81O3LrECtI",
      "title": "The History Squad: The Grisly History of Plastic Surgery & Trench Warfare",
      "duration": "8 mins 30 secs",
      "pathway": "Documentary Depth",
      "teacher_guidance": "In-depth historical exploration of the social stigma of facial disfigurement, the establishment of tin masks by Francis Derwent Wood, and Gillies' surgeries.",
      "viewing_task": "<ol><li><strong>[02:15] Recall:</strong> Why were facial wounds psychologically devastating for returning soldiers compared to amputated limbs?</li><li><strong>[05:40] Explain:</strong> How did sculptor Francis Derwent Wood create electroplated copper masks to restore facial dignity to soldiers whose faces could not be rebuilt?</li></ol>",
      "model_answer": "<ol><li><strong>Recall:</strong> Facial mutilation stripped away personal identity and expression, causing severe social alienation and public revulsion.</li><li><strong>Explain:</strong> Wood made plaster casts of the soldier's remaining face, sculpted the missing features based on pre-war photographs, and electroplated thin copper masks painted to match individual skin tones.</li></ol>"
    }
  ]
};

function overhaulUnit(unitObj) {
  for (const [lessonId, videos] of Object.entries(lessonVideoUpdates)) {
    const lesson = unitObj.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      console.warn(`Warning: Lesson ${lessonId} not found in unit!`);
      continue;
    }
    lesson.video = videos;
    lesson.extra_videos = [];
  }
  return unitObj;
}

// 1. Update data/edexcel_medicine.json
console.log('Updating data/edexcel_medicine.json...');
const dataFile = 'data/edexcel_medicine.json';
const dataObj = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
overhaulUnit(dataObj);
fs.writeFileSync(dataFile, JSON.stringify(dataObj, null, 2), 'utf8');

// 2. Update public/data/edexcel_medicine.json
console.log('Updating public/data/edexcel_medicine.json...');
const publicDataFile = 'public/data/edexcel_medicine.json';
fs.writeFileSync(publicDataFile, JSON.stringify(dataObj, null, 2), 'utf8');

// 3. Update units/edexcel_medicine/data.js
console.log('Updating units/edexcel_medicine/data.js...');
const unitsDataFile = 'units/edexcel_medicine/data.js';
fs.writeFileSync(unitsDataFile, 'window.unitData = ' + JSON.stringify(dataObj, null, 2) + ';\n', 'utf8');

// 4. Update public/units/edexcel_medicine/data.js
console.log('Updating public/units/edexcel_medicine/data.js...');
const pubUnitsDataFile = 'public/units/edexcel_medicine/data.js';
fs.writeFileSync(pubUnitsDataFile, 'window.unitData = ' + JSON.stringify(dataObj, null, 2) + ';\n', 'utf8');

// 5. Update database.json
console.log('Updating database.json...');
const dbFile = 'database.json';
const dbObj = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
dbObj.edexcel_medicine = dataObj;
fs.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2), 'utf8');

// 6. Update public/database.json
console.log('Updating public/database.json...');
const pubDbFile = 'public/database.json';
fs.writeFileSync(pubDbFile, JSON.stringify(dbObj, null, 2), 'utf8');

console.log('✅ Successfully overhauled all lessons and synced across all 6 data stores!');
