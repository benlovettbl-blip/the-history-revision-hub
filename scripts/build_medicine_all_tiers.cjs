// scripts/build_medicine_all_tiers.cjs
const fs = require('fs');

const { medicine4mUpdates } = require('./medicine_4m_calibrated.cjs');
const { medicine12mUpdates: existing12m } = require('./medicine_12m_calibrated.cjs');

// 1. Add the 3 remaining 12m questions
const extra12m = {
  "lesson_2_3_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Top (Simple Story)",
      "text": "<p>Andreas Vesalius was a doctor who dissected human bodies instead of reading old books. He found out that Galen had made lots of mistakes because Galen only dissected animals. Vesalius wrote a famous book with drawings that showed the human body properly.</p>",
      "verdict": "AO1/AO2 (3 marks). Simple narrative statement; identifies Vesalius's book and dissection without explaining specific causal mechanisms."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 Ceiling (Descriptive Account)",
      "text": "<p>One reason Vesalius made breakthroughs was that he carried out human dissections himself. In medieval times, professors read Galen while barber-surgeons dissected animals. Vesalius did the dissections himself on executed criminals and proved that Galen was wrong about the human jaw having two bones and the liver having five lobes.</p><p>Another reason was his book <em>The Fabric of the Human Body</em> in 1543. It had very accurate pictures drawn by artists from Titian's workshop. This allowed medical students to see accurate anatomy for the first time.</p>",
      "verdict": "AO1/AO2 (6 marks). Accurate narrative of Vesalius's work, but lacks explicit causal link sentences connecting discoveries directly to wider historical impact."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One decisive reason Vesalius made breakthroughs in anatomy was his insistence on <strong>personally conducting human dissections</strong> rather than relying on ancient texts. Breaking with medieval academic tradition where university professors read Galen while barber-surgeons dissected animals below, Vesalius stepped down to dissect human cadavers himself. Therefore, this led to fundamental anatomical breakthroughs because direct physical observation allowed him to identify and correct over 300 errors in Galen’s animal-based anatomy.</p><p>Furthermore, Vesalius systematically proved that <strong>ancient Roman medical authorities were biologically fallible</strong>. By dissecting executed criminals, he demonstrated conclusively that the human lower jaw consisted of a single bone rather than two, the liver lacked five separate lobes, and the heart's septum had no invisible pores. Therefore, this resulted in significant anatomical breakthroughs because disproving Galen's anatomical infallibility freed Renaissance medical researchers to challenge ancient dogma and investigate human physiology empirically.</p><p>Finally, Vesalius's discoveries achieved widespread, permanent medical impact through <strong>printing technology and Renaissance art</strong>. In 1543, he published <em>De Humani Corporis Fabrica</em>, featuring extraordinarily precise anatomical woodcuts crafted by artists from Titian's Venetian workshop. Therefore, this accelerated breakthroughs in anatomical education because mass-printed, visually accurate anatomical plates were distributed to medical students across Europe, establishing empirical dissection as the mandatory foundation of modern surgery.</p>",
      "verdict": "AO1/AO2 (12 marks). Level 4 top. Precisely calibrated (~210 words). Three fully developed analytical paragraphs, each ending with an explicit causal link formula directly answering the question stem."
    }
  },
  "lesson_3_4_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Top (Simple Story)",
      "text": "<p>Surgery became safer because James Simpson found chloroform which put patients to sleep so they did not feel pain. Then Joseph Lister used carbolic acid to stop infections in hospital wards, and later hospitals became cleaner with aseptic surgery.</p>",
      "verdict": "AO1/AO2 (3 marks). Simple story mentioning anaesthetics and antiseptics without sustained causal explanation."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 Ceiling (Descriptive Account)",
      "text": "<p>One reason surgery became safer was the discovery of chloroform by James Simpson in 1847. Before this, patients screamed in agony and surgeons had to amputate limbs in seconds. Chloroform stopped the pain so surgeons could take more time operating.</p><p>Another reason was Joseph Lister using carbolic acid in 1865 after reading Pasteur's Germ Theory. He sprayed carbolic acid over wounds and on instruments, which cut gangrene and infection rates from 46% to 15%.</p>",
      "verdict": "AO1/AO2 (6 marks). Accurate narrative of Simpson and Lister, but omits the shift to asepsis and lacks explicit causal link conclusions."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One decisive reason surgery became safer was the conquest of pain through <strong>James Simpson's discovery of chloroform in 1847</strong>. Previously, unbearable agony forced surgeons to amputate limbs in seconds to prevent fatal shock, causing devastating blood loss and trauma. Chloroform fully anaesthetized patients, allowing surgeons to operate with deliberate care and precision. Therefore, this led to significantly safer surgery because overcoming agony reduced operative shock and allowed surgeons to attempt delicate, life-saving procedures without rushing.</p><p>Furthermore, surgical mortality was drastically reduced through <strong>Joseph Lister's introduction of carbolic acid in 1865</strong>. Applying Pasteur's 1861 Germ Theory, Lister realized that lethal hospital gangrene and sepsis were caused by microscopic airborne pathogens entering open incisions. Sprayed carbolic mist and carbolic-soaked dressings slashed Lister's surgical death rate from 46% to 15%. Therefore, this resulted in significantly safer surgery because destroying bacterial pathogens on dressings and wounds prevented fatal postoperative infections.</p><p>Finally, surgery was transformed by the late-nineteenth-century transition to <strong>total aseptic surgery</strong>. Rather than simply killing germs inside wounds, surgeons like Gustav Neuber sterilized instruments using steam autoclaves, scrubbed hands, wore clean boiled gowns, and introduced sterile rubber gloves in 1890. Operating theatres were fitted with wipe-clean tiles. Therefore, this made surgery substantially safer because preventing airborne and contact microbes from entering operative wounds eliminated chemical irritation and made internal abdominal operations routine.</p>",
      "verdict": "AO1/AO2 (12 marks). Level 4 top. Precisely calibrated (~210 words). Three fully developed analytical paragraphs, each ending with an explicit causal link formula directly answering the question stem."
    }
  },
  "lesson_4_4_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Top (Simple Story)",
      "text": "<p>Penicillin was developed because Alexander Fleming found mould on a petri dish. Then Florey and Chain purified it at Oxford and tested it on mice. During the Second World War, American factories mass-produced it to treat wounded soldiers.</p>",
      "verdict": "AO1/AO2 (3 marks). Simple narrative account without analytical depth or explanation of production bottlenecks."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 Ceiling (Descriptive Account)",
      "text": "<p>One reason penicillin was developed was the work of Howard Florey and Ernst Chain at Oxford. Fleming had abandoned penicillin because it was hard to purify. Florey and Chain extracted pure penicillin, proved it worked on mice in 1940, and treated human patients.</p><p>Another reason was the Second World War. British factories could not make enough penicillin because of bomb damage, so Florey went to America. The US government paid drug companies to make it in huge vats, saving many soldiers by D-Day.</p>",
      "verdict": "AO1/AO2 (6 marks). Descriptive narrative covering Oxford research and US wartime funding, but lacking explicit causal links."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One decisive reason penicillin was successfully developed was the scientific dedication of <strong>Howard Florey and Ernst Chain at Oxford University (1938–1941)</strong>. While Fleming discovered the mould in 1928, he could not extract or stabilize the substance. Chain successfully purified penicillin chemically, while Florey proved its effectiveness on infected mice and in human trials on Albert Alexander. Therefore, this led to the successful development of penicillin because Oxford's multidisciplinary teamwork transformed an unstable laboratory curiosity into a proven curative antibiotic.</p><p>Furthermore, the decisive catalyst for mass production was <strong>industrial mobilization and government funding during the Second World War</strong>. With British factories overwhelmed by explosives manufacturing, Florey secured emergency backing from the US War Production Board in 1941, which granted heavy subsidies and tax relief to pharmaceutical corporations like Pfizer and Squibb. Therefore, this resulted in the mass production of penicillin because state-subsidized chemical infrastructure and deep-tank fermentation with corn-steep liquor enabled industrial-scale manufacture.</p><p>Finally, penicillin's production was driven by the <strong>urgent military necessity of treating massive Allied casualties</strong>. By June 1944, American and British pharmaceutical plants were producing 2.3 million doses monthly, ensuring every wounded soldier in the Normandy landings received immediate antibiotic therapy. Therefore, this forced the successful mass production of penicillin because military commanders prioritized bacterial wound treatment to preserve military manpower, reducing Allied wartime infection mortality from 18% to under 1%.</p>",
      "verdict": "AO1/AO2 (12 marks). Level 4 top. Precisely calibrated (~216 words). Three fully developed analytical paragraphs, each ending with an explicit causal link formula directly answering the question stem."
    }
  }
};

// 2. The 9 16-mark evaluative essay questions
const medicine16mUpdates = {
  "lesson_1_1_q2": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1/2 (Simple / Unbalanced)",
      "text": "<p>In the medieval period, people believed disease was caused by God punishing them for sins. The Church taught that illness came from God, so people prayed and went on pilgrimages to be healed. However, people also believed in bad smells called miasma and the four humours.</p>",
      "verdict": "AO1/AO2 (4 marks). Simple descriptive response identifying religion and miasma, but lacks detailed evidence and evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 3 (Developed Two-Sided Description)",
      "text": "<p>On the one hand, religious beliefs were central to ideas about the cause of disease. The Catholic Church controlled education and taught that sickness was sent by God to cleanse the soul or punish sins. During the Black Death (1348), people engaged in public flagellation and prayers.</p><p>On the other hand, ideas were not solely based on religion because people also believed in the Theory of the Four Humours and miasma. Galen and Hippocrates taught that blood, phlegm, black bile, and yellow bile must be balanced. In conclusion, religion was important, but natural theories also played a big role.</p>",
      "verdict": "AO1/AO2 (8 marks). Two-sided explanation covering religious and natural causes, but evaluation in conclusion is brief and lacks comparative criteria."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>To a large extent, ideas about the cause of illness were dominated by religion because the Catholic Church held an institutional monopoly over medieval education, scripture, and hospital foundation. The Church taught that disease was sent directly by God as a divine punishment for personal sin or as a spiritual test of faith. During the Black Death of 1348, the primary official responses were prayers, fasting, and penitent flagellation to appease divine wrath. Therefore, religion was a powerful explanatory framework because citizens believed physical symptoms were manifestations of spiritual sickness.</p><p>However, ideas were not based solely on religion, as rational, naturalistic theories—specifically <strong>Galen’s Theory of the Four Humours and miasma</strong>—were equally prominent. University-trained physicians systematically diagnosed illness by assessing humoral imbalances between blood, phlegm, yellow bile, and black bile, checking urine charts and prescribing bloodletting and purges. Furthermore, corrupt air (miasma) generated by decaying organic waste was widely blamed for epidemic disease, prompting municipal authorities to clear cesspits. Therefore, natural causes were fundamental because physicians sought rational physical explanations alongside divine providence.</p><p>In conclusion, I disagree with the statement that ideas were based solely on religion. While the Church provided the overarching theological framework and enforced Galenic orthodoxy, medieval medical practice operated primarily through rational humoralism and environmental miasma. Religion explained why disease struck, but ancient humoral science explained how it afflicted the body, making medieval etiology a dual system of faith and natural philosophy.</p>",
      "verdict": "AO1/AO2 (16 marks). Level 4 top (~250 words). Comprehensive two-sided evaluative argument with precise factual grounding and an analytical, criteria-driven verdict distinguishing 'why' (theological) from 'how' (humoral)."
    }
  },
  "lesson_1_3_q2": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1/2 (Simple / Unbalanced)",
      "text": "<p>Medical treatment was ineffective because the Church banned dissection and made people believe in Galen. People prayed to God and used bloodletting, but no one knew about germs so they could not cure anything.</p>",
      "verdict": "AO1/AO2 (4 marks). Basic assertion linking ineffectiveness to the Church and Galen, but lacks detailed evidence."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 3 (Developed Two-Sided Description)",
      "text": "<p>On the one hand, the Church caused ineffectiveness because it controlled medical training and strictly forbade doctors from questioning Galen's texts. Monks copied Galen's manuscripts and the Church taught that Galen's ideas fit Christian theology. This prevented any new discoveries or experimentation.</p><p>On the other hand, the real problem was the complete lack of scientific technology and understanding of bacteria. Without microscopes, nobody could see microbes, so treatments like the Four Humours, purging, and bleeding were doomed to fail regardless of the Church. In conclusion, the Church was a major factor, but lack of science was also decisive.</p>",
      "verdict": "AO1/AO2 (8 marks). Covers both Church control and technological limits, but conclusion lacks sustained analytical criteria."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>To a significant extent, the Catholic Church was a major reason why medieval medical treatment was ineffective because it enforced rigid intellectual orthodoxy that prohibited scientific innovation. The Church completely controlled European universities, training physicians to memorize Galen's ancient texts rather than conduct empirical research. Because Galen argued the human body was created by a single divine Creator, the Church declared his writings infallible; questioning Galen was condemned as heresy, while human dissection was severely restricted. Therefore, ecclesiastical authority fossilized medical knowledge, ensuring that ineffective treatments like humoral bloodletting and religious pilgrimages persisted without challenge.</p><p>However, the fundamental cause of medical ineffectiveness was not solely Church dogma, but the complete <strong>absence of scientific technology and biological knowledge</strong>. Even if physicians had possessed total intellectual freedom, they lacked optical microscopes, chemical analysis, and bacteriological concepts to identify microscopic disease pathogens. Consequently, ancient humoralism and miasma theory remained the only rational, observation-based frameworks available to explain sickness. Therefore, treatments like herbal purges and diet regulation failed primarily because doctors were fighting invisible bacterial and viral infections with primitive tools.</p><p>In conclusion, while the Church created a rigid institutional barrier to progress, the deeper reason for ineffectiveness was technological and scientific limitation. The Church protected Galen because his teleological theories made rational sense in an era before microscopic optics. Therefore, even in societies beyond Catholic control, medical treatment remained largely ineffective due to the universal absence of germ knowledge.</p>",
      "verdict": "AO1/AO2 (16 marks). Level 4 top (~250 words). Sophisticated two-sided evaluation weighing institutional/theological barriers against fundamental technological limits."
    }
  },
  "lesson_1_5_q2": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1/2 (Simple / Unbalanced)",
      "text": "<p>There was very little progress between 1250 and 1700 because people still believed in miasma and the four humours during the Great Plague just like during the Black Death. However, scientists like Harvey made some anatomical breakthroughs.</p>",
      "verdict": "AO1/AO2 (4 marks). Simple description recognizing continuity in miasma and change in Harvey, but lacking developed historical evidence."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 3 (Developed Two-Sided Description)",
      "text": "<p>On the one hand, there was very little progress in understanding the cause of disease. In 1348 during the Black Death, people blamed God's wrath, the Four Humours, and miasma. In 1665 during the Great Plague, ordinary people and doctors still blamed miasma and astrological alignments, proving ideas had barely shifted.</p><p>On the other hand, the Renaissance brought major anatomical progress through Vesalius and Harvey, while Thomas Sydenham began classifying diseases based on external symptoms rather than individual humours. In conclusion, there was little progress in causes, even though anatomy advanced.</p>",
      "verdict": "AO1/AO2 (8 marks). Two-sided distinction between understanding causes (continuity) and anatomical knowledge (progress), but conclusion is descriptive."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>There is substantial evidence that there was very little progress in understanding the <strong>cause of disease</strong> between 1250 and 1700. When the Black Death struck England in 1348, people attributed the contagion to divine punishment, planetary alignment, and foul miasma arising from filth. Over three centuries later, during the Great Plague of 1665, public authorities and physicians still explained the epidemic using identical theories of miasma and bad air, smoking tobacco and carrying pomanders to ward off airborne poisons. Therefore, because optical microscopes were too weak to identify bacteria, etiology remained completely stagnant across both centuries.</p><p>However, it is inaccurate to claim there was no progress whatsoever, as the Renaissance established crucial methodological shifts that laid the foundation for future breakthroughs. Thomas Sydenham's <em>Observationes Medicae</em> (1676) rejected Galenic individualized humoral diagnoses, insisting that diseases had distinct, specific identities that could be systematically classified through clinical observation. Furthermore, Robert Hooke's <em>Micrographia</em> (1665) and Leeuwenhoek's early microscopes proved that microscopic organisms existed. Therefore, while the precise causes of disease remained unknown, medical philosophy transitioned from medieval scholasticism to empirical observation.</p><p>In conclusion, I agree with the statement regarding the specific cause of disease. While anatomy and physiology progressed rapidly through Vesalius and Harvey, understanding etiology saw almost zero practical change: miasma and humours continued to dominate bedside practice in 1700 just as in 1250. Fundamental change in understanding causes could only occur with Pasteur's 1861 Germ Theory.</p>",
      "verdict": "AO1/AO2 (16 marks). Level 4 top (~250 words). Rigorous, sharp focus on the specific question constraint ('cause of disease' vs anatomy/methodology) with clear historical criteria."
    }
  },
  "lesson_2_5_q2": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1/2 (Simple / Unbalanced)",
      "text": "<p>Approaches to the Great Plague were different because in 1665 the Lord Mayor appointed searchers and shut people in their houses with red crosses. But in 1348 people just prayed and ran away from towns.</p>",
      "verdict": "AO1/AO2 (4 marks). Identifies some differences in municipal response, but lacks explanation of similarities."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 3 (Developed Two-Sided Description)",
      "text": "<p>On the one hand, approaches were quite different in 1665 because local government was far more organized. The Mayor of London enforced Plague Orders: searchers checked corpses, houses were locked for 28 days with red crosses, and over 40,000 dogs were killed. In 1348, government action was almost non-existent.</p><p>On the other hand, approaches were fundamentally similar in terms of medical treatments and prevention. In both 1348 and 1665, people fled into the countryside, smoked tobacco or held sweet herbs to ward off miasma, and prayed to God. In conclusion, government methods differed, but medical responses were mostly the same.</p>",
      "verdict": "AO1/AO2 (8 marks). Good distinction between civic regulation and medical treatment, but conclusion needs deeper evaluation of 'completely different'."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>To a considerable degree, approaches to the Great Plague in 1665 differed from 1348 in terms of <strong>organized civic administration and state enforcement</strong>. During the 1348 Black Death, English government mechanisms broke down rapidly, offering little coordinated municipal regulation beyond local cemetery digging. In sharp contrast, London authorities in 1665 enacted systematic Plague Orders: appointed searchers to inspect corpses, locked infected households inside their homes for 28 days under guard, painted red crosses on doors, culled an estimated 240,000 dogs and cats, and banned large public gatherings. Therefore, governmental and municipal management evolved from helpless panic in 1348 to structured, bureaucratic containment in 1665.</p><p>However, the statement that approaches were 'completely different' is false, as <strong>medical understanding, personal prevention, and popular panic</strong> remained remarkably identical. In both 1348 and 1665, the fundamental explanation for the contagion was airborne miasma, prompting citizens in both eras to carry sweet-smelling herbs, light bonfires in streets, and hold pomanders to their noses. Furthermore, supernatural beliefs persisted: church services and days of national fasting were held in 1665 to appease divine wrath, while wealthy citizens (including the King and physicians) fled to rural areas. Therefore, individual medical treatments and psychological reactions showed profound continuity across the three centuries.</p><p>In conclusion, I disagree that approaches were 'completely different'. While government civic policing and quarantine bureaucracy were vastly more sophisticated in 1665, therapeutic medicine and preventative practices remained almost identical because neither generation understood that fleas on black rats transmitted Yersinia pestis.</p>",
      "verdict": "AO1/AO2 (16 marks). Level 4 top (~255 words). Directly tackles the extreme phrase 'completely different', establishing a sharp contrast between civic administration (change) and medical therapeutics (continuity)."
    }
  },
  "lesson_3_2_q2": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1/2 (Simple / Unbalanced)",
      "text": "<p>Jenner's smallpox vaccine was the most important breakthrough because smallpox was a deadly killer and Jenner discovered that cowpox stopped it. However, later Pasteur discovered the Germ Theory and made other vaccines.</p>",
      "verdict": "AO1/AO2 (4 marks). Brief description of Jenner and Pasteur without detailed comparison of their significance."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 3 (Developed Two-Sided Description)",
      "text": "<p>On the one hand, Jenner's smallpox vaccine was incredibly significant because smallpox killed thousands of people, especially children. In 1796, Jenner proved that injecting cowpox prevented smallpox. In 1853, the government made smallpox vaccination compulsory, which eventually wiped out the disease.</p><p>On the other hand, Jenner's work only applied to one single disease and he could not explain how it worked. In contrast, Louis Pasteur's 1861 Germ Theory explained the cause of all infectious diseases and allowed Pasteur and Koch to create vaccines for rabies, cholera, and anthrax. In conclusion, Jenner was a pioneer, but Germ Theory was more significant.</p>",
      "verdict": "AO1/AO2 (8 marks). Strong comparison between Jenner and Pasteur/Koch, but conclusion lacks nuanced evaluation criteria."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Edward Jenner’s development of the smallpox vaccine in 1796 was undoubtedly a momentous breakthrough in disease prevention. Smallpox was the deadliest epidemic killer of the eighteenth century, responsible for hundreds of thousands of deaths and permanent disfigurement. By testing the folklore that cowpox conferred immunity against smallpox, Jenner replaced dangerous inoculation (which frequently caused fatal outbreaks) with safe, reliable vaccination. The British government recognized its revolutionary value, awarding Jenner £30,000 and eventually making vaccination compulsory in 1853. Therefore, Jenner created the first scientific preventative measure against a lethal epidemic, drastically lowering mortality rates across Europe.</p><p>However, Jenner's breakthrough was fundamentally limited because it was an <strong>isolated, empirical discovery</strong>. Jenner had no understanding of viruses or the biological immune system; he could not explain why cowpox prevented smallpox, meaning his method could not be replicated to prevent other lethal diseases like cholera, typhoid, or tuberculosis. In contrast, <strong>Louis Pasteur's 1861 Germ Theory</strong> was far more significant because it provided the universal biological explanation for disease transmission. Germ Theory enabled Pasteur and Robert Koch to develop artificial, lab-cultivated vaccines for chicken cholera, anthrax, and rabies in the 1880s, creating modern immunology. Therefore, Germ Theory was a vastly broader preventative breakthrough.</p><p>In conclusion, while Jenner achieved the single most effective individual preventative treatment of the era, Germ Theory was far more significant overall. Jenner conquered one disease by chance observation, whereas Pasteur and Koch provided the universal scientific key that enabled humanity to prevent dozens of infectious diseases systematically.</p>",
      "verdict": "AO1/AO2 (16 marks). Level 4 top (~255 words). Evaluates specific disease impact (Jenner) against universal systemic foundation (Pasteur/Germ Theory) to reach a decisive, nuanced judgment."
    }
  },
  "lesson_3_5_q2": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1/2 (Simple / Unbalanced)",
      "text": "<p>John Snow was the main reason public health improved because in 1854 he took the handle off the Broad Street pump and stopped cholera. But the Great Stink and government laws also forced Parliament to build sewers.</p>",
      "verdict": "AO1/AO2 (4 marks). Identifies Snow, the pump, and the Great Stink, but lacks analytical detail and evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 3 (Developed Two-Sided Description)",
      "text": "<p>On the one hand, John Snow was crucial because in 1854 he mapped cholera deaths in Soho and proved it was a waterborne disease. Removing the pump handle ended the outbreak and showed clean drinking water was essential, disproving miasma theory.</p><p>On the other hand, the Great Stink of 1858 and the 1875 Public Health Act were more decisive for national improvement. In 1858, the terrible smell from the Thames forced Parliament to give Bazalgette £3 million to build 82 miles of sewers. In 1875, Disraeli made clean water compulsory across the entire country. In conclusion, Snow provided proof, but government action was what actually improved health nationwide.</p>",
      "verdict": "AO1/AO2 (8 marks). Covers Snow's Soho investigation alongside Bazalgette and legislation, but evaluative criteria could be sharper."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>John Snow’s 1854 epidemiological investigation into cholera in Soho was undeniably a major catalyst for public health reform. By meticulously mapping cholera fatalities around the Broad Street pump and removing its handle to halt the outbreak, Snow produced empirical proof that cholera was a waterborne infection rather than an airborne miasma. Snow demonstrated that sewer waste contaminating drinking supplies caused fatal disease. Therefore, Snow provided the vital scientific justification needed to persuade civil servants and municipal reformers that investing in clean water infrastructure was a matter of life and death.</p><p>However, Snow’s findings alone did not transform national public health, because government officials largely ignored his waterborne theory until compelled by political and environmental crises. The true turning point was <strong>the Great Stink of 1858 and parliamentary legislation</strong>. When the polluted Thames produced an intolerable stench outside Parliament in 1858, politicians rushed through funding for Joseph Bazalgette’s massive 82-mile underground intercepting sewer network, which saved millions of lives. Furthermore, following the 1867 Reform Act which enfranchised working-class voters, Disraeli’s government passed the compulsory <strong>1875 Public Health Act</strong>, legally forcing local councils to provide clean water and sewers. Therefore, engineering and state legislation were decisive in translating theory into practical reality.</p><p>In conclusion, I disagree that Snow was the main reason for improvements in public health. While Snow provided the indispensable scientific proof, public health improved primarily because political self-interest (the Great Stink), democratic pressure (the 1867 franchise), and compulsory legislation (1875) provided the legal and financial mechanisms to build national sanitation networks.</p>",
      "verdict": "AO1/AO2 (16 marks). Level 4 top (~260 words). Distinguishes between the intellectual catalyst (Snow) and the structural/financial engines of reform (Bazalgette, franchise expansion, 1875 Act)."
    }
  },
  "lesson_4_2_q2": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1/2 (Simple / Unbalanced)",
      "text": "<p>Technological innovations were more important because doctors got X-rays, CT scans, and MRI machines to look inside people without surgery. Genetics was also important because Watson and Crick discovered DNA in 1953.</p>",
      "verdict": "AO1/AO2 (4 marks). Simple descriptive account mentioning imaging and DNA, but lacks analytical comparison."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 3 (Developed Two-Sided Description)",
      "text": "<p>On the one hand, technological innovations in diagnosis transformed medical practice in the twentieth century. X-rays, invented in 1895, were followed by ultrasound, CT scans in the 1970s, and MRI scans. These allowed doctors to detect internal bleeding, tumours, and fractures safely and immediately.</p><p>On the other hand, genetic research through Watson and Crick's 1953 discovery of the DNA double helix and the Human Genome Project allowed scientists to understand hereditary diseases like cystic fibrosis and identify cancer genes like BRCA1. In conclusion, technology had an immediate clinical impact, whereas genetics took longer to affect patients.</p>",
      "verdict": "AO1/AO2 (8 marks). Balanced comparison of imaging technology vs genetic mapping, but conclusion needs explicit criteria."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>To a very large extent, technological innovations in medical diagnosis were more important than genetic research during the twentieth century because they delivered <strong>immediate, universal clinical benefits</strong> across everyday hospital care. The invention of diagnostic technologies—from Wilhelm Röntgen's X-rays (1895) to Godfrey Hounsfield's CT scanner (1972), endoscopes, and magnetic resonance imaging (MRI)—revolutionized medical practice by allowing physicians to visualize internal tumours, organ damage, and skeletal fractures without exploratory surgery. Therefore, imaging technologies directly transformed routine patient outcomes and emergency triage for millions of patients every day.</p><p>In contrast, while genetic research was an extraordinary scientific breakthrough, its practical diagnostic and curative applications were heavily delayed. James Watson, Francis Crick, and Rosalind Franklin discovered the double-helix structure of DNA in 1953, unlocking the molecular blueprint of human inheritance. However, despite identifying hereditary conditions like cystic fibrosis and Down's syndrome, genetic research could not cure these diseases in the twentieth century. Even the Human Genome Project was only completed in 2003, with gene therapies remaining experimental. Therefore, genetic science was primarily foundational and predictive rather than immediately therapeutic in the twentieth century.</p><p>In conclusion, I strongly agree with the statement. Throughout the twentieth century, technological diagnostics provided instant, life-saving clinical tools that doctors used daily to detect and treat acute illnesses. Genetic research, while intellectually revolutionary, was a long-term investment whose major clinical therapies only began bearing fruit in the twenty-first century.</p>",
      "verdict": "AO1/AO2 (16 marks). Level 4 top (~245 words). Clear, criteria-based evaluation (immediate universal clinical efficacy vs long-term foundational science) justifying the verdict."
    }
  },
  "lesson_4_3_q2": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1/2 (Simple / Unbalanced)",
      "text": "<p>The NHS was the most important improvement because Aneurin Bevan launched it in 1948 and made healthcare free for everyone. Before that, poor people could not afford doctors. But penicillin and modern surgery were also important.</p>",
      "verdict": "AO1/AO2 (4 marks). Brief description of Bevan and free care, but lacks detailed comparison with medical treatments."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 3 (Developed Two-Sided Description)",
      "text": "<p>On the one hand, the NHS was the most important improvement because it democratized healthcare. Before 1948, the 1911 National Insurance only covered male workers, leaving women and children without free care. Under the NHS, hospitals, GP visits, and medicines became free for all citizens.</p><p>On the other hand, the NHS was only an administrative system; patients still needed effective treatments. Medical breakthroughs like penicillin, streptomycin, polio vaccines, and open-heart surgery actually cured diseases that were previously lethal. In conclusion, both were vital, but the NHS ensured everyone could access these cures.</p>",
      "verdict": "AO1/AO2 (8 marks). Distinguishes healthcare access from pharmaceutical/surgical science, but evaluative criteria can be developed further."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>The establishment of the National Health Service (NHS) in 1948 was arguably the most important improvement in twentieth-century medical care because it fundamentally transformed <strong>social accessibility and health equity</strong>. Prior to 1948, healthcare was heavily unequal: the 1911 National Insurance scheme covered only insured wage-earning workers, leaving millions of women, children, and the elderly reliant on charity or suffering untreated due to unaffordable GP fees. By nationalizing voluntary and municipal hospitals and making treatment free at the point of delivery under Aneurin Bevan, the NHS guaranteed medical care as a universal human right. Therefore, the NHS eliminated poverty as a barrier to health, immediately improving national life expectancy.</p><p>However, an equally significant argument can be made that <strong>scientific and pharmaceutical breakthroughs</strong> were more fundamental, because an administrative healthcare service is worthless without effective treatments to administer. The development of mass-produced penicillin in 1943, streptomycin for tuberculosis, cortisone, and childhood vaccines (such as the 1955 Salk polio vaccine) eradicated diseases that had killed millions. Furthermore, advances in cardiac surgery and organ transplants gave doctors the physical ability to save lives that were previously untreatable. Therefore, scientific medicine provided the curative weapons, while the NHS was merely the delivery vehicle.</p><p>In conclusion, while pharmaceuticals and surgical technologies provided the cures, the NHS remains the most important overall improvement in medical care. Without the NHS, revolutionary antibiotics and complex surgeries would have remained expensive private privileges reserved for the wealthy, rather than universal lifesavers for the entire British population.</p>",
      "verdict": "AO1/AO2 (16 marks). Level 4 top (~260 words). Masterfully contrasts institutional delivery (NHS access) with curative science (antibiotics/surgery) and delivers a justified verdict."
    }
  },
  "lesson_4_5_q2": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1/2 (Simple / Unbalanced)",
      "text": "<p>Government action was the main reason because the government banned smoking in public places in 2007 and put warning labels on cigarette packets. But doctors like Richard Doll also proved smoking caused lung cancer.</p>",
      "verdict": "AO1/AO2 (4 marks). Simple description of anti-smoking laws and Richard Doll without detailed analytical evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 3 (Developed Two-Sided Description)",
      "text": "<p>On the one hand, government action was the main reason for progress. Following Doll and Hill's research, the government gradually introduced public health policies: banning tobacco advertising on television in 1965, raising taxes on cigarettes, and banning smoking in all enclosed workplaces in 2007. This caused smoking rates to decline steadily.</p><p>On the other hand, technological and clinical advances were also vital. CT scans and bronchoscopy allowed earlier diagnosis, while radiotherapy, chemotherapy, and lung-removal surgery allowed doctors to prolong patients' lives. In conclusion, government prevention was essential, but clinical treatments also helped combat the disease.</p>",
      "verdict": "AO1/AO2 (8 marks). Covers government prevention alongside medical technology/treatment, but conclusion lacks comparative depth."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Government action was unquestionably the primary reason for progress in combating lung cancer because legislation targeted the <strong>root preventative cause</strong> of the disease. Following Richard Doll and Austin Bradford Hill’s landmark 1950 epidemiological study proving that smoking caused 90% of lung cancer cases, the British state gradually abandoned laissez-faire to aggressively deter tobacco consumption. Government measures included banning cigarette advertising on television (1965), imposing heavy annual taxation on tobacco, enforcing graphic pictorial warnings on packaging (2008), raising the legal purchasing age to 18 (2007), and passing the landmark 2007 ban on smoking in enclosed public spaces. Therefore, government intervention drastically reduced adult smoking rates from over 50% in 1950 to under 15% today, preventing hundreds of thousands of potential cancers.</p><p>However, progress was also supported by <strong>technological innovations in clinical diagnosis and treatment</strong>. Early twentieth-century doctors could only detect lung cancer through post-mortems or crude X-rays when tumours were incurable. In the late twentieth century, high-resolution CT scans, broncho-endoscopy, and PET imaging enabled earlier tumour identification. Furthermore, surgical lobectomies, precision radiotherapy, and targeted chemotherapy drugs (like platinum-based therapies) dramatically extended the survival rates of diagnosed patients. Therefore, clinical technologies provided life-saving curative options for existing sufferers.</p><p>In conclusion, government action was decisively the main reason for progress. Because lung cancer remains exceptionally difficult to cure once developed (with 5-year survival rates remaining relatively low), preventative government legislation restricting smoking has saved far more lives than medical treatments ever could.</p>",
      "verdict": "AO1/AO2 (16 marks). Level 4 top (~260 words). Powerful evaluative comparison between legislative prevention (mass population impact) and clinical treatment (individual survival), delivering a clear criteria-driven verdict."
    }
  }
};

// 3. The Western Front questions (Lessons 21-26)
const westernFrontUpdates = {
  // L21: features_4m + utility_8m
  "lesson_5_1_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>One feature was trenches had duckboards. Another feature was soldiers had aid posts.</p>",
      "verdict": "AO1 (1 mark). Two simple statements, but lacks supporting historical detail for either feature."
    },
    "tier_2m": {
      "title": "2/4 Partial",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Feature Detailed)",
      "text": "<p>One feature of the trench system was the fire trench, which was dug in a zigzag pattern with sandbags and a fire step so soldiers could shoot at the enemy. Another feature was medical aid posts behind the line.</p>",
      "verdict": "AO1 (2 marks). Feature 1 is described with good specific detail, but Feature 2 lacks supporting factual explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One feature of the trench system was its <strong>zigzag construction</strong> with fire steps and duckboards. Trenches were deliberately dug with sharp right-angle bends to prevent blast shockwaves travelling down the trench and stop enemy attackers firing directly along the line.<br><br>Another feature was the <strong>Regimental Aid Post (RAP)</strong> located directly behind the front line. Situated in dugouts or ruined buildings within 200 yards of the front, the medical officer provided immediate first aid and bandaged wounds before stretcher-bearers evacuated casualties further back.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Two distinct features identified, each supported by precise, accurate historical detail."
    }
  },
  "lesson_5_1_q2": {
    "tier_2m": {
      "title": "2/8 Surface Paraphrase",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Description)",
      "text": "<p>Source A is useful because it shows British soldiers in a trench with sandbags and barbed wire. It tells us that trenches were wet and muddy and soldiers had to carry stretchers. However, it only shows one small part of the line.</p>",
      "verdict": "AO3 (2 marks). Paraphrases surface visual content only without contextual knowledge or provenance analysis."
    },
    "tier_5m": {
      "title": "5/8 Uneven Analysis",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Content & Context)",
      "text": "<p>Source A is useful because it shows how difficult it was to move wounded soldiers through communication trenches. The trenches were narrow and knee-deep in mud, which matches my own knowledge that stretcher-bearers struggled to evacuate casualties from the Ypres Salient.<br><br>However, the source is an official photograph taken by the British War Office in 1917, meaning it was subject to censorship. It does not show soldiers in agony to protect public morale at home.</p>",
      "verdict": "AO3 (5 marks). Uses own knowledge to contextualize content and mentions censorship, but lacks deep analysis of purpose and overall utility judgment."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source A is highly useful for an enquiry into the difficulties of medical evacuation on the Western Front because its content accurately depicts the physical constraints of the communication trenches. It shows stretcher-bearers carrying a wounded soldier along a severely narrowed, waterlogged trench lined with duckboards. This directly correlates with contextual knowledge of the Third Battle of Ypres (Passchendaele, 1917), where unceasing shellfire destroyed drainage systems, turning trenches into thick quagmires that required four to six men to carry a single stretcher.<br><br>Furthermore, the utility is enhanced by its provenance. As an official British War Office photograph taken for propaganda and archive records, its perspective is sanitized: the soldier appears calm and bandaged rather than exhibiting traumatic blood loss, avoiding demoralization on the home front. Nevertheless, it remains exceptionally useful as reliable visual evidence of the physical obstacle of mud, cramped trench geometry, and logistical delay that medical personnel faced daily.</p>",
      "verdict": "AO3 (8 marks). Level 3 top (~165 words). Comprehensive evaluation of content and provenance against own knowledge, assessing reliability to reach a justified judgment on utility."
    }
  },

  // L22: features_4m + follow_up_4m
  "lesson_5_2_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>One feature of ill health was trench foot. Another feature was trench fever caused by lice.</p>",
      "verdict": "AO1 (1 mark). Mentions two valid illnesses, but provides no supporting factual detail."
    },
    "tier_2m": {
      "title": "2/4 Partial",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Feature Detailed)",
      "text": "<p>One feature of ill health was trench foot, caused by standing in cold, waterlogged mud for hours without taking boots off, which made feet go numb and rot, sometimes requiring amputation. Another feature was trench fever.</p>",
      "verdict": "AO1 (2 marks). Detailed description of trench foot, but trench fever is left as an unsupported assertion."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One feature of ill health was <strong>trench foot</strong>, caused by prolonged immersion in cold mud and water. Feet became numb, swollen, and gangrenous, frequently requiring amputation; the army combated this by ordering soldiers to change socks twice daily and rub whale oil onto their feet.<br><br>Another feature was <strong>trench fever</strong> (pyrexia), transmitted by body lice living in uniforms. It caused severe flu-like fevers, joint agony, and blinding headaches, disabling men for up to a month and leading to the introduction of delousing stations and disinfection baths.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Two distinct illnesses identified, both supported by precise causes, symptoms, and military prevention methods."
    }
  },
  "lesson_5_2_q2": {
    "tier_1m": {
      "title": "1/4 Incomplete",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Single Detail)",
      "text": "<p>Detail in Source A: 'men suffered from swollen feet'.<br>Question: How bad was trench foot?</p>",
      "verdict": "AO3 (1 mark). Incomplete response; omits type of source and explanation of helpfulness."
    },
    "tier_2m": {
      "title": "2/4 Partial",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Two Elements)",
      "text": "<p>Detail in Source A: 'the men stood in waterlogged mud for days'.<br>Question I would ask: How many soldiers suffered from trench foot in 1915?<br>Type of source: Look on the internet.</p>",
      "verdict": "AO3 (2 marks). Valid detail and question, but historical source type is vague/inappropriate and lacks explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Detail in Source A that I would follow up:</strong><br>'The men stood in waterlogged trenches for 48 hours without dry socks, leading to severe swelling and numbness.'<br><br><strong>Question I would ask:</strong><br>How many soldiers were medically evacuated with severe trench foot in the Ypres Salient during the winter of 1914–1915?<br><br><strong>Type of source I would use:</strong><br>Army medical unit admission records and war diaries from the Royal Army Medical Corps (RAMC) casualty clearing stations.<br><br><strong>How this would help my enquiry:</strong><br>It would provide statistical evidence to determine whether trench foot was an isolated occurrence or an epidemic threat to overall military manpower before preventative whale oil measures were enforced.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Precise historical detail selected, sharp follow-up question, specific archival RAMC record identified, and clear analytical justification."
    }
  },

  // L23: features_4m + utility_8m
  "lesson_5_3_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>One feature was artillery shrapnel killed many men. Another feature was poison gas blinded soldiers.</p>",
      "verdict": "AO1 (1 mark). Two simple assertions without specific supporting detail."
    },
    "tier_2m": {
      "title": "2/4 Partial",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Feature Detailed)",
      "text": "<p>One feature was explosive artillery shells and shrapnel, which caused over half of all battlefield wounds by spraying lead balls and metal fragments that ripped open flesh and caused severe head injuries. Another feature was poison gas.</p>",
      "verdict": "AO1 (2 marks). Strong detail for artillery and shrapnel, but gas lacks supporting historical detail."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One feature of battlefield injuries was trauma from <strong>artillery shellfire and shrapnel</strong>. Exploding high-explosive shells caused catastrophic blast trauma and propelled jagged metal fragments that tore flesh and shattered bone, accounting for approximately 58% of all battlefield casualties and prompting the issue of Brodie steel helmets in 1915.<br><br>Another feature was the debilitating impact of <strong>poison gas attacks</strong> (chlorine, phosgene, and mustard gas). Chlorine suffocated soldiers by stripping the lungs, while mustard gas caused massive internal and external blisters and temporary blindness, forcing the army to issue increasingly sophisticated gas respirators.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Two distinct injury types identified with precise casualty statistics, physiological impacts, and military countermeasures."
    }
  },
  "lesson_5_3_q2": {
    "tier_2m": {
      "title": "2/8 Surface Paraphrase",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Description)",
      "text": "<p>Source B is useful because it is a painting of soldiers being led in a line with bandages over their eyes after a gas attack. It shows that gas caused blindness and that soldiers had to hold onto each other's shoulders to walk.</p>",
      "verdict": "AO3 (2 marks). Simple surface description of the painting without historical context or provenance analysis."
    },
    "tier_5m": {
      "title": "5/8 Uneven Analysis",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Content & Context)",
      "text": "<p>Source B is useful because it shows the terrible impact of mustard gas on British troops. Men are blinded and being led to an aid post, which fits my knowledge that mustard gas burned eyes and caused temporary blindness.<br><br>However, John Singer Sargent was an official war artist commissioned by the British government in 1918 to paint <em>Gassed</em>, so he wanted to create an emotionally powerful scene for the public.</p>",
      "verdict": "AO3 (5 marks). Integrates some contextual knowledge and artist provenance, but lacks rigorous assessment of artistic interpretation vs utility."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B (John Singer Sargent's painting <em>Gassed</em>, 1919) is highly useful for an enquiry into the effects of poison gas on soldiers because its content depicts the acute physical and psychological impact of mustard gas. It illustrates a line of blinded soldiers with bandaged eyes, each guiding themselves by holding the shoulder of the man in front as they walk to an Advanced Dressing Station. This corroborates contextual knowledge of late-war gas tactics (from 1917 onwards), where mustard gas blistered skin, burned corneas, and caused widespread sensory deprivation that overwhelmed medical stations.<br><br>Furthermore, the utility is informed by its provenance. Sargent was an official war artist commissioned by the British Ministry of Information, who based the work on sketches made near Arras in 1918. While the composition has deliberate classical symbolism and dramatic scale to commemorate collective sacrifice, it was grounded in direct observation. Therefore, it is exceptionally useful as visual testimony of the mass casualty burden and disorientation that gas warfare inflicted on frontline combatants.</p>",
      "verdict": "AO3 (8 marks). Level 3 top (~170 words). Evaluates content, contextual corroboration, and artist provenance/purpose to deliver a balanced, justified verdict on utility."
    }
  },

  // L24: features_4m + follow_up_4m
  "lesson_5_4_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>One feature of the evacuation chain was stretcher-bearers. Another feature was casualty clearing stations.</p>",
      "verdict": "AO1 (1 mark). Mentions two stages, but gives no supporting operational detail."
    },
    "tier_2m": {
      "title": "2/4 Partial",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Feature Detailed)",
      "text": "<p>One feature of the chain was Casualty Clearing Stations (CCS), located several miles behind the front near railways where doctors performed life-saving surgery like amputations and treated shock. Another feature was base hospitals by the French coast.</p>",
      "verdict": "AO1 (2 marks). Accurate detail on CCS functions, but Base Hospitals lacks supporting explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One feature of the casualty evacuation chain was the <strong>Casualty Clearing Station (CCS)</strong>. Located a few miles behind artillery range near railway lines, the CCS became the primary surgical hub where RAMC surgeons performed emergency operations (such as amputations and wound debridement) to stabilize critical cases before infection set in.<br><br>Another feature was the <strong>Base Hospitals</strong> located near channel ports like Boulogne and Le Havre. Equipped with comprehensive surgical wards, X-ray machines, and specialized units, they provided long-term convalescence or arranged transport via hospital ships back to Britain for soldiers requiring extensive recovery.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Two distinct evacuation stages described with precise geographical locations and medical functions."
    }
  },
  "lesson_5_4_q2": {
    "tier_1m": {
      "title": "1/4 Incomplete",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Single Detail)",
      "text": "<p>Detail: 'stretchers took hours to reach the dressing station'.<br>Question: How long did stretcher-bearers take?</p>",
      "verdict": "AO3 (1 mark). Incomplete; lacks source type and justification."
    },
    "tier_2m": {
      "title": "2/4 Partial",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Two Elements)",
      "text": "<p>Detail in Source A: 'Casualties were evacuated in motor ambulances from the dressing station.'<br>Question: Did motor ambulances speed up the evacuation chain?<br>Type of source: A history book.</p>",
      "verdict": "AO3 (2 marks). Valid detail and question, but 'history book' is secondary and lacks specific archival record focus."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Detail in Source A that I would follow up:</strong><br>'Motor ambulances replaced horse-drawn wagons, dramatically cutting transport times between dressing stations and the CCS.'<br><br><strong>Question I would ask:</strong><br>How significantly did the introduction of motor ambulance convoys in 1915 reduce mortality rates from surgical shock and wound gangrene?<br><br><strong>Type of source I would use:</strong><br>RAMC Field Ambulance transport logs and logbooks from the British Red Cross Society archives.<br><br><strong>How this would help my enquiry:</strong><br>It would provide empirical transit data and patient survival statistics to determine whether motorized transport was the decisive factor in reducing fatal infection delays along the evacuation chain.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Sharp historical detail, targeted question, authentic archival source type, and clear analytical link to the enquiry."
    }
  },

  // L25: features_4m + utility_8m
  "lesson_5_5_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>One feature of surgical breakthroughs was the Thomas Splint. Another feature was blood transfusions.</p>",
      "verdict": "AO1 (1 mark). Identifies two innovations, but provides no historical detail."
    },
    "tier_2m": {
      "title": "2/4 Partial",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Feature Detailed)",
      "text": "<p>One feature was the Thomas Splint, designed by Hugh Owen Thomas, which pulled broken leg bones straight to stop bone fragments piercing arteries, cutting mortality from femur fractures from 80% to 20%. Another feature was brain surgery.</p>",
      "verdict": "AO1 (2 marks). Outstanding detail and statistics for the Thomas Splint, but second feature is unsupported."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One feature of surgical breakthroughs was the <strong>Thomas Splint</strong>. Introduced to the front in late 1915 by Robert Jones, this rigid metal frame pulled broken femur fractures straight, preventing jagged bone ends tearing muscle and femoral arteries during evacuation, which reduced femur fracture mortality from 80% to below 20%.<br><br>Another feature was the development of <strong>wound debridement and the Carrel-Dakin method</strong>. Surgeons learned to cut away all dead, contaminated tissue around shrapnel wounds, then continuously flushed the cavity with a sterilized sodium hypochlorite solution to eliminate anaerobic gas gangrene bacteria before sewing wounds shut.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Two distinct innovations identified with named inventors/techniques, precise survival statistics, and physiological explanations."
    }
  },
  "lesson_5_5_q2": {
    "tier_2m": {
      "title": "2/8 Surface Paraphrase",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Description)",
      "text": "<p>Source A is useful because it is a diary entry from a British surgeon describing how he operated on wounded men all night at a casualty clearing station. He says there were too many men with compound fractures and he was exhausted.</p>",
      "verdict": "AO3 (2 marks). Simple surface extraction from the diary without contextual knowledge or critical provenance evaluation."
    },
    "tier_5m": {
      "title": "5/8 Uneven Analysis",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Content & Context)",
      "text": "<p>Source A is useful because it provides an honest first-hand account of surgical pressure during the 1916 Battle of the Somme. The surgeon describes amputating limbs and dealing with gas gangrene, which matches my knowledge that contaminated manure in Flemish soil caused lethal infections.<br><br>However, as a personal diary, it only represents one surgeon's experience at one specific station, so it may not reflect the entire front.</p>",
      "verdict": "AO3 (5 marks). Uses knowledge of Somme casualties and soil bacteria, but provenance assessment is somewhat generic ('only one surgeon')."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source A (a private diary by an RAMC surgeon during the Battle of the Somme in July 1916) is exceptionally useful for an enquiry into frontline surgical challenges. The content reveals the overwhelming volume of compound fractures and severe shrapnel wounds, describing how surgeons operated non-stop under candlelight amidst intense logistical bottlenecks. This corroborates contextual knowledge of the Somme's first day (57,000 British casualties), where Casualty Clearing Stations were swamped beyond capacity and surgeons had to prioritize life-saving amputations and debridement over complex reconstructions.<br><br>Furthermore, the utility is enhanced by its provenance. As an unedited, private diary written at the time with no intention of publication or official censorship, the surgeon expresses genuine professional distress regarding surgical exhaustion and contaminated wounds. This candid perspective gives historians authentic insight into surgical triage limitations that sanitized official reports often concealed, making it highly reliable qualitative evidence.</p>",
      "verdict": "AO3 (8 marks). Level 3 top (~165 words). Comprehensive evaluation of content and provenance against own knowledge, assessing reliability to reach a justified judgment on utility."
    }
  },

  // L26: features_4m + follow_up_4m
  "lesson_5_6_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>One feature was mobile X-ray units. Another feature was blood banks at Cambrai.</p>",
      "verdict": "AO1 (1 mark). Names two innovations, but provides no historical detail."
    },
    "tier_2m": {
      "title": "2/4 Partial",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Feature Detailed)",
      "text": "<p>One feature was mobile X-ray units, which were vans equipped with X-ray machines that drove right up to Casualty Clearing Stations so doctors could locate bullets and shrapnel inside soldiers before surgery. Another feature was stored blood.</p>",
      "verdict": "AO1 (2 marks). Good detail on mobile X-rays, but blood storage is left as an unsupported assertion."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One feature was the deployment of <strong>mobile X-ray units</strong>. Mounted in vans, these portable radiographic machines traveled directly to Casualty Clearing Stations, enabling surgeons to pinpoint the precise location of hidden shrapnel, bullets, and fractured bones before operating, avoiding exploratory damage and identifying contaminated soil fragments.<br><br>Another feature was the development of <strong>stored blood and blood banks</strong>. Following discoveries that sodium citrate prevented clotting and refrigerated dextrose preserved blood cells, Oswald Robertson established the first blood depot during the Battle of Cambrai in 1917, storing universal donor type-O blood in glass bottles to treat hypovolemic shock immediately.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Two distinct innovations described with precise technical mechanisms, key historical figures (Oswald Robertson), and specific battles (Cambrai 1917)."
    }
  },
  "lesson_5_6_q2": {
    "tier_1m": {
      "title": "1/4 Incomplete",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Single Detail)",
      "text": "<p>Detail: 'blood was stored in bottles for several days'.<br>Question: Did blood transfusions work?</p>",
      "verdict": "AO3 (1 mark). Incomplete; lacks source type and justification."
    },
    "tier_2m": {
      "title": "2/4 Partial",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Two Elements)",
      "text": "<p>Detail in Source A: 'Oswald Robertson kept blood in an ice chest to treat wounded men at Cambrai.'<br>Question: How many soldiers survived shock after getting stored blood transfusions?<br>Type of source: A medical book.</p>",
      "verdict": "AO3 (2 marks). Accurate detail and question, but source type is vague and explanation is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Detail in Source A that I would follow up:</strong><br>'Oswald Robertson established the first blood depot at Cambrai in 1917, using refrigerated blood to treat men dying of severe haemorrhage and shock.'<br><br><strong>Question I would ask:</strong><br>What percentage of soldiers suffering severe shock from blood loss survived after receiving transfusions of stored citrated blood compared to direct transfusions?<br><br><strong>Type of source I would use:</strong><br>Medical surgical case logs and clinical reports published by the British Medical Research Committee (1917–1918).<br><br><strong>How this would help my enquiry:</strong><br>It would provide verified clinical outcome data to prove whether stored blood transfusions genuinely reduced mortality from shock on an operational scale during major military offensives.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Sharp factual detail, focused statistical question, precise archival medical publication, and clear evaluative reasoning."
    }
  }
};

// Combine everything into a single master dictionary for Medicine
const allMedicineUpdates = {
  ...medicine4mUpdates,
  ...existing12m,
  ...extra12m,
  ...medicine16mUpdates,
  ...westernFrontUpdates
};

console.log('Total medicine questions prepared:', Object.keys(allMedicineUpdates).length);

// Let's verify every single question has tier keys
let missingTiers = [];
Object.entries(allMedicineUpdates).forEach(([k, v]) => {
  const keys = Object.keys(v);
  if (keys.length < 3) missingTiers.push(k + ' (only ' + keys.length + ' tiers)');
});

if (missingTiers.length > 0) {
  console.error('Missing tiers in:', missingTiers);
  process.exit(1);
} else {
  console.log('ALL questions have at least 3 tiers!');
}

module.exports = { allMedicineUpdates };
