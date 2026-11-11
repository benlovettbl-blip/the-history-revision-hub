// scripts/medicine_4m_calibrated.cjs
// Calibrated 4-mark similarity and difference models for edexcel_medicine (Lessons 1-20 Q1)
// Tier 4m strictly ~60-75 words with 3-4 sentence structure and mandatory 'Therefore...' link.

const medicine4mUpdates = {
  "lesson_1_1_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Ideas about the cause of disease were similar because people in both the Medieval period and the Renaissance believed bad smells caused illness.</p>",
      "verdict": "AO1 (1 mark). Simple valid similarity identified, but completely lacks specific historical evidence or detail from either period."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One way ideas were similar was the belief in miasma. In the Medieval period, people believed corrupt air from rotting filth caused the Black Death in 1348. People also believed this in the Renaissance.</p>",
      "verdict": "AO1 (2 marks). Identifies similarity with specific detail for the Medieval period, but provides no historical evidence for the Renaissance."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which ideas about the cause of disease were similar was the continuing belief in <strong>miasma (poisonous air)</strong>. In the Medieval period, people believed corrupt air from decaying filth caused epidemics like the Black Death (1348). Similarly, during the Renaissance, physicians and the public continued to blame miasma for the Great Plague of 1665, carrying pomanders to ward off bad smells. Therefore, because neither period understood microscopic germs, foul air remained the dominant rational explanation for epidemic disease in both eras.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Valid similarity identified with precise historical detail from both periods and a clear explanatory link."
    }
  },
  "lesson_1_2_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Ideas were different because medieval people believed in God while nineteenth-century people believed in science.</p>",
      "verdict": "AO1 (1 mark). Generalised assertion without specific supporting facts or named concepts."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One way ideas were different was that medieval people thought disease was sent by God to punish sins, so they fasted and prayed. By the nineteenth century, people knew diseases were caused by bacteria.</p>",
      "verdict": "AO1 (2 marks). Accurate medieval detail provided, but nineteenth-century development lacks specific named evidence (e.g. Pasteur / Germ Theory)."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which ideas were different was the shift from supernatural explanations to <strong>scientific bacteriology</strong>. In the Medieval period, illness was widely attributed to divine punishment from God, prompting prayers, fasting, and flagellation to appease divine wrath. In contrast, by the late nineteenth century, Louis Pasteur's 1861 Germ Theory proved that specific microscopic pathogens caused infectious disease. Therefore, understanding transitioned from an invisible religious judgment to observable biological bacteria.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Direct difference established with precise contextual evidence from both periods and clear comparative synthesis."
    }
  },
  "lesson_1_3_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Prevention was similar because in both times people tried to stay healthy by living properly and eating good food.</p>",
      "verdict": "AO1 (1 mark). Simple statement without specific historical medical vocabulary or details."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One way prevention was similar was using personal lifestyle guides. In the Medieval period, people followed the Regimen Sanitatis to balance their four humours through diet and exercise. People also used lifestyle regimens in the Renaissance.</p>",
      "verdict": "AO1 (2 marks). Clear detail for the Medieval era, but Renaissance practice lacks developed comparative detail."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which prevention was similar was the continued reliance on the <strong>Regimen Sanitatis</strong> to preserve individual health. In the Medieval period, physicians instructed patients to maintain humoral balance by regulating diet, exercise, and sleep according to Galenic rules. Similarly, in the Renaissance, individuals continued to follow personal regimens and use herbal purges to maintain internal equilibrium. Therefore, both eras prioritized preventative lifestyle habits to prevent the body's internal humours becoming corrupted.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Precise comparative analysis with specific historical practices from both periods."
    }
  },
  "lesson_1_4_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Hospitals were different because medieval hospitals cared for people but modern hospitals cured them.</p>",
      "verdict": "AO1 (1 mark). Basic distinction identified, but lacks supporting historical detail or examples."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was that medieval hospitals were run by monks and nuns who offered 'care rather than cure', giving shelter and food rather than medicine. Later hospitals had doctors who cured illnesses.</p>",
      "verdict": "AO1 (2 marks). Accurate medieval knowledge, but 18th/19th century contrast lacks specific institutional detail."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which hospital work was different was the shift from religious hospitality to <strong>active clinical treatment</strong>. In the Medieval period, monastic hospitals like St Bartholomew's focused on spiritual 'care rather than cure', offering rest, prayer, and warmth rather than medical cures, and routinely barring infectious patients. In contrast, by the nineteenth century, voluntary hospitals employed trained doctors, performed antiseptic surgeries, and admitted the sick to cure physical disease. Therefore, hospitals evolved from charitable shelters into scientific curative institutions.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Clear, accurate contrast supported by named institutions and specific functions."
    }
  },
  "lesson_1_5_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Responses were similar because people ran away and isolated themselves from both plagues.</p>",
      "verdict": "AO1 (1 mark). Basic assertion with no precise factual detail from either epidemic."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One similarity was quarantine. During the 1348 Black Death, towns shut their gates to stop strangers entering. In the 1665 Great Plague, authorities also used quarantine to try to stop the sickness spreading.</p>",
      "verdict": "AO1 (2 marks). Valid similarity, but 1665 response lacks specific details like painted red crosses or Plague Orders."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which responses were similar was the widespread reliance on <strong>quarantine and social isolation</strong>. During the 1348 Black Death, local authorities shut incoming travelers outside town walls, and families isolated inside their homes. Similarly, during the 1665 Great Plague, the Lord Mayor of London enforced household quarantine, locking infected families inside their houses and painting red crosses on doors. Therefore, in both epidemics, isolating the sick from the healthy remained the primary public strategy to halt contagion.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Precise comparative details provided for both epidemics with a clear synthesis."
    }
  },
  "lesson_2_1_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Ideas were similar because in both times doctors still believed in Galen and the four humours.</p>",
      "verdict": "AO1 (1 mark). Simple valid similarity without supporting historical explanation."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One similarity was the Four Humours. In the Middle Ages, doctors balanced blood, phlegm, black bile, and yellow bile. Renaissance doctors also still used humoral theory for most patients.</p>",
      "verdict": "AO1 (2 marks). Accurately names medieval humours, but lacks developed detail for the Renaissance."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which ideas were similar was the enduring influence of the <strong>Theory of the Four Humours</strong>. In the Medieval period, physicians diagnosed illnesses by assessing imbalances between blood, phlegm, yellow bile, and black bile. Similarly, during the Renaissance, most practicing physicians and domestic healers continued using humoral purging and bleeding to treat everyday sickness. Therefore, despite anatomical discoveries, ordinary medical practice remained grounded in ancient humoral theory across both centuries.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Specific evidence from both eras demonstrating persistent continuity."
    }
  },
  "lesson_2_2_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Treatment was different because Renaissance doctors bled people whereas nineteenth-century doctors had modern drugs.</p>",
      "verdict": "AO1 (1 mark). Basic statement without specific names, dates, or mechanisms."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was chemical and targeted treatment. In the Renaissance, treatments were based on bloodletting and herbal opposites to balance humours. By the late nineteenth century, doctors had developed vaccines and knew about bacteria.</p>",
      "verdict": "AO1 (2 marks). Good Renaissance detail, but nineteenth-century contrast lacks specific examples or scientists."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which treatment was different was the development of <strong>targeted laboratory therapeutics</strong> over traditional bloodletting. In the Renaissance, treatments relied heavily on herbal remedies, opposites, and phlebotomy (bleeding) to balance humours. In contrast, by the late nineteenth century, medical science developed laboratory vaccines like Pasteur's rabies vaccine (1885) and Robert Koch's bacteriological discoveries to target specific microbes. Therefore, treatment advanced from balancing vague bodily humours to destroying scientifically verified external pathogens.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Excellent contrast supported by precise historical individuals and treatments."
    }
  },
  "lesson_2_3_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Training was similar because students in both eras had to dissect bodies to learn anatomy.</p>",
      "verdict": "AO1 (1 mark). Simple valid similarity without supporting contextual detail."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One similarity was direct dissection. In the Renaissance, Andreas Vesalius insisted that medical students had to dissect human bodies themselves rather than just reading books. This continued into the 18th and 19th centuries.</p>",
      "verdict": "AO1 (2 marks). Accurate on Vesalius, but provides no specific evidence for 18th/19th-century anatomical training."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which anatomical training was similar was the central importance of <strong>first-hand human dissection</strong>. In the Renaissance, Andreas Vesalius established that medical students must dissect human cadavers personally rather than relying on ancient texts. Similarly, in eighteenth- and nineteenth-century surgical schools like William Hunter's Great Windmill Street school, students were required to dissect human bodies individually. Therefore, direct observation of the human body remained the universal foundation of anatomical education in both eras.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Supported by named historical figures and institutions across both periods."
    }
  },
  "lesson_2_4_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Ideas were different because medieval people thought blood was made in the liver but Harvey proved it circulated.</p>",
      "verdict": "AO1 (1 mark). Brief assertion, but lacks detailed explanation of how or why the ideas differed."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was how blood moved. In the Medieval period, doctors followed Galen who believed the liver made new blood constantly and the body burned it up. In the Renaissance, William Harvey proved blood circulated round the body.</p>",
      "verdict": "AO1 (2 marks). Accurate detail on Galen, but Harvey's breakthrough lacks mechanical detail (e.g. heart pump / valves)."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which ideas were different was the understanding of <strong>blood movement and circulation</strong>. In the Medieval period, physicians accepted Galen's belief that venous blood was continuously produced by the liver and consumed by tissues as fuel. In contrast, in the Renaissance, William Harvey proved in 1628 that blood circulated continuously in a closed, one-way system pumped by the heart. Therefore, understanding changed from viewing the body as a consumption furnace to a mechanical circulatory system.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Precise contrast between Galenic and Harveyian physiology with dates."
    }
  },
  "lesson_2_5_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Government responses were different because in 1665 the government took more action than in 1348.</p>",
      "verdict": "AO1 (1 mark). Simple statement without specific government measures or policies mentioned."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was government regulation. In 1348, authorities did very little organized work. In 1665, the Mayor of London made strict rules: killing cats and dogs and shutting up infected houses.</p>",
      "verdict": "AO1 (2 marks). Good detail on 1665 Plague Orders, but 1348 lacks comparative depth."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which government responses were different was the level of <strong>organized municipal enforcement</strong>. During the 1348 Black Death, local government collapsed and offered almost no coordinated national policy. In contrast, in 1665, the Lord Mayor of London implemented comprehensive Plague Orders: appointing searchers and wardens, killing 40,000 dogs and 200,000 cats, banning public assemblies, and burning fires in streets. Therefore, response changed from helpless municipal inaction to systematic civic regulation.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Explicit contrast with precise statistics and policy details from 1665."
    }
  },
  "lesson_3_1_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Ideas were different because in the eighteenth century people believed in miasma but by the late nineteenth century they knew about germs.</p>",
      "verdict": "AO1 (1 mark). Basic assertion without specific dates or scientific discoveries."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was understanding germs. In the eighteenth century, people believed bad air (miasma) or spontaneous generation caused disease. In the late nineteenth century, Louis Pasteur proved germs caused decay and Robert Koch identified specific bacteria.</p>",
      "verdict": "AO1 (2 marks). Good scientific contrast, but lacks synthesis of why the paradigm shifted."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which ideas were different was the transition from spontaneous generation and miasma to <strong>microbial specificity</strong>. In the eighteenth century, scientists believed rotting matter spontaneously generated disease through poisonous miasma. In contrast, by the late nineteenth century, Louis Pasteur's 1861 Germ Theory and Robert Koch's work proved that specific bacteria caused distinct diseases like anthrax and cholera. Therefore, belief shifted from atmospheric contamination to identifiable microscopic pathogens.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Outstanding comparative precision with named scientists and dates."
    }
  },
  "lesson_3_2_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Prevention of smallpox was different because Jenner invented vaccination in the late eighteenth century.</p>",
      "verdict": "AO1 (1 mark). Mentions Jenner, but gives no detail for the sixteenth century."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was vaccination. In the sixteenth century, people had no prevention against smallpox and could only isolate or pray. In 1796, Edward Jenner discovered that injecting cowpox prevented smallpox.</p>",
      "verdict": "AO1 (2 marks). Identifies the difference with Jenner, but lacks depth on safety and immunity mechanisms."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which methods were different was the development of <strong>safe vaccination</strong>. In the sixteenth century, people had no effective preventative methods against smallpox, relying on prayers, herbal charms, or isolation. In contrast, in 1796, Edward Jenner developed vaccination using cowpox matter, providing safe, reliable immunity without risking a fatal smallpox outbreak. Therefore, prevention advanced from helpless passivity to deliberate, scientifically proven biological immunization.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Clear comparison demonstrating understanding of preventative change."
    }
  },
  "lesson_3_3_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Hospitals were different because nineteenth-century hospitals were much cleaner and had trained nurses like Florence Nightingale.</p>",
      "verdict": "AO1 (1 mark). Basic point, but lacks eighteenth-century detail."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was hygiene and nursing. In the eighteenth century, hospitals were dirty places where people often died of infections. By the late nineteenth century, Florence Nightingale had introduced trained nurses and clean wards.</p>",
      "verdict": "AO1 (2 marks). Good reference to Nightingale, but lacks architectural and institutional details."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which hospital care was different was the <strong>professionalization of nursing and sanitation</strong>. In the eighteenth century, hospital wards were cramped, unventilated death-traps staffed by untrained, uneducated nurses. In contrast, following Florence Nightingale's work from 1859, late nineteenth-century hospitals established clean pavilion wards, strict ventilation, antiseptic hygiene, and professional training schools for nurses. Therefore, hospitals were transformed from unsanitary infection hubs into clean, highly organized medical environments.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Precise historical details for both centuries with clear contrast."
    }
  },
  "lesson_3_4_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Surgery was similar because patients still suffered terrible pain and bleeding in both times.</p>",
      "verdict": "AO1 (1 mark). Simple assertion without specific surgical context or dates."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One similarity was the lack of anaesthetics. In both the Renaissance and the early nineteenth century, surgeons had to operate very fast because patients could die from pain and shock. Surgeons like Robert Liston amputated legs in under a minute.</p>",
      "verdict": "AO1 (2 marks). Good detail on speed and shock, but lacks balanced Renaissance evidence."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which surgical operations were similar was the critical constraint of <strong>pain and surgical shock</strong>. In both the Renaissance and the early nineteenth century (prior to Simpson's 1847 use of chloroform), surgeons had no effective anaesthetics. Patients had to be physically held down while surgeons amputated limbs within seconds to prevent fatal cardiac shock. Therefore, speed and endurance remained the defining requirements of surgery in both periods because pain could not be controlled.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Clear thematic similarity supported by specific medical constraints."
    }
  },
  "lesson_3_5_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Government action was different because early on the government did nothing but later it passed laws.</p>",
      "verdict": "AO1 (1 mark). Basic assertion without specific acts, dates, or policy terms."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was laissez-faire. In the early nineteenth century, the government had a hands-off policy and did not build sewers. By the late nineteenth century, the 1875 Public Health Act made councils provide clean water.</p>",
      "verdict": "AO1 (2 marks). Accurate difference, but lacks full development of the compulsory powers introduced in 1875."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which government action was different was the transition from <strong>laissez-faire to compulsory intervention</strong>. In the early nineteenth century, the government adhered to laissez-faire ('leave alone'), refusing to fund sewers or inspect housing. In contrast, by the late nineteenth century, the compulsory 1875 Public Health Act forced local councils to supply clean water, pave streets, and appoint Medical Officers of Health. Therefore, the state moved from total detachment to legal responsibility for national health.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Outstanding comparative precision citing specific policies and legislation."
    }
  },
  "lesson_4_1_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Scientific methods were different because twentieth-century scientists used much better microscopes and genetics.</p>",
      "verdict": "AO1 (1 mark). Generalised point without named technologies or historical dates."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was microscope technology. In the nineteenth century, light microscopes could only see bacteria. In the twentieth century, the electron microscope was invented in 1931 so scientists could see viruses.</p>",
      "verdict": "AO1 (2 marks). Good technological contrast, but lacks synthesis of how this altered medical investigation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which scientific methods were different was the ability to observe sub-microscopic structures using <strong>advanced technology</strong>. In the nineteenth century, scientists relied on optical light microscopes, which could only view bacteria and could not resolve viruses. In contrast, the invention of the electron microscope in 1931 and DNA sequencing in 1953 allowed twentieth-century researchers to view viruses and map genetic causes of disease. Therefore, investigation advanced from cellular microbiology to molecular and genetic pathology.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Precise comparative details with dates and technological breakthroughs."
    }
  },
  "lesson_4_2_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Diagnosis was different because late twentieth-century doctors used scans instead of basic examinations.</p>",
      "verdict": "AO1 (1 mark). Simple assertion without specific diagnostic machinery or dates."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was digital imaging. In the early twentieth century, doctors relied on basic physical exams and 2D X-rays. By the late twentieth century, hospitals used CT scans and MRI machines to look inside the body without surgery.</p>",
      "verdict": "AO1 (2 marks). Accurate difference, but lacks developed detail on diagnostic precision."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which diagnosis was different was the use of <strong>computer-assisted non-invasive imaging</strong>. In the early twentieth century, doctors relied primarily on external physical examination and simple, flat 2D X-rays to detect broken bones. In contrast, by the late twentieth century, hospitals used advanced CT scans (1972) and MRI imaging to create high-resolution 3D cross-sections of soft internal organs and tumours. Therefore, diagnosis evolved from external guesswork to precise, non-invasive internal visualization.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Precise contrast between early and late twentieth-century diagnostic technologies."
    }
  },
  "lesson_4_3_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Healthcare access was different because after 1948 everyone got free treatment under the NHS.</p>",
      "verdict": "AO1 (1 mark). Basic fact provided, but gives no detail for the early twentieth century."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was free access. Before 1948, many people had to pay doctors or rely on the 1911 National Insurance which only covered workers. In 1948, Aneurin Bevan launched the NHS which was free for everybody.</p>",
      "verdict": "AO1 (2 marks). Good contrast, but lacks specific comparative depth on wives and children being excluded prior to 1948."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which healthcare access was different was the principle of <strong>universal free care</strong>. In the early twentieth century, poorer workers relied on limited 1911 National Insurance (which excluded wives and children), while others paid private doctor fees or depended on charitable dispensaries. In contrast, the creation of the NHS in 1948 made medical care, hospitalization, and prescriptions free at the point of delivery for all citizens. Therefore, healthcare changed from a privileged commodity into an equal universal right.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Full comparative depth identifying specific legislation and beneficiaries."
    }
  },
  "lesson_4_4_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>The discoveries were similar because both scientists discovered their cures by accident.</p>",
      "verdict": "AO1 (1 mark). Simple point without specific scientific details or historical dates."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One similarity was chance observation. In 1796, Jenner noticed that milkmaids who had cowpox never caught smallpox. In 1928, Fleming discovered penicillin when mould blew through his window and killed bacteria on a petri dish.</p>",
      "verdict": "AO1 (2 marks). Identifies the chance factor with accurate details, but lacks synthesis of scientific inquiry."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which the discoveries were similar was the crucial role of <strong>chance observation followed by scientific curiosity</strong>. In 1796, Jenner observed that milkmaids who contracted cowpox never caught smallpox, investigating this popular folklore. Similarly, in 1928, Fleming noticed that a stray Penicillium notatum mould spore had accidentally contaminated his staphylococci petri dish and killed the surrounding bacteria. Therefore, both breakthroughs began with an accidental observation that alert scientists recognized and investigated.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Precise comparative details across both discoveries with clear synthesis."
    }
  },
  "lesson_4_5_q1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Assertion)",
      "text": "<p>Diagnosis was different because late twentieth-century doctors had CT scans to find lung cancer early.</p>",
      "verdict": "AO1 (1 mark). Identifies CT scans, but provides no historical detail for the early twentieth century."
    },
    "tier_2m": {
      "title": "2/4 Partial Comparison",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (One Period Detailed)",
      "text": "<p>One difference was early detection. In the early twentieth century, doctors could only find lung cancer when it was too late using basic X-rays. By the late twentieth century, CT scans and bronchoscopy allowed doctors to detect tumours much earlier.</p>",
      "verdict": "AO1 (2 marks). Accurate difference, but lacks clinical depth on post-mortem discovery and biopsy procedures."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Benchmark)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One way in which diagnosis was different was the <strong>accuracy and speed of detecting tumours</strong>. In the early twentieth century, lung cancer was typically identified only after post-mortem autopsies or primitive X-rays when the tumour was untreatably advanced. In contrast, in the late twentieth century, doctors diagnosed lung cancer early using high-resolution CT scans, broncho-endoscopy, and biopsy tissue analysis. Therefore, diagnosis shifted from retrospective post-mortem discovery to proactive, life-saving clinical detection.</p>",
      "verdict": "AO1 (4 marks). Full marks awarded. Outstanding comparative precision with specific clinical diagnostic procedures."
    }
  }
};

module.exports = { medicine4mUpdates };

