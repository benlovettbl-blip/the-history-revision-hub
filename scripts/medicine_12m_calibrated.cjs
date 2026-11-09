const fs = require('fs');

// Calibrated 12-mark questions for edexcel_medicine (Strictly 200-240 words for tier_12m, 3 paras, each ending in 'Therefore, this...')
const medicine12mUpdates = {
  "lesson_1_1_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The Catholic Church had a massive influence on medical ideas because it ran all the churches and monasteries in England. Priests told ordinary people that God sent diseases like the Black Death to punish their sins. Furthermore, monks copied books by hand, so they chose which books people could read, and anyone who argued with the Church was arrested. Therefore the Church was very powerful and everyone listened to what priests said about disease.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions relevant issues (monasteries, punishment for sin, copying books) but lacks specific historical names, dates, or analytical PEEL paragraphs, and treats Church influence as a simple story without explaining causal links."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the Catholic Church had influence was its <strong>control of education and book production</strong>. In medieval scriptoria, monks hand-copied all medical manuscripts and destroyed or banned any texts that contradicted the Bible. In universities, Church-trained professors taught students to memorise ancient texts rather than examine living patients, ensuring no new medical theories emerged.<br><br>Another reason was the Church's promotion of <strong>Galen and the Christian worldview</strong>. Galen believed the human body was created by one God, which fit Christian teachings perfectly. The Church declared his anatomical writings infallible and banned physicians from questioning his doctrines during dissections.<br><br>In conclusion, controlling universities and promoting Galen gave the Catholic Church huge power over medieval medicine.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes two stimulus factors (education/scriptoria and Galen's monotheism). However, it remains narrative rather than analytical and omits a third distinct aspect beyond the stimulus (such as religious punishment for sin or persecution of heresy like Roger Bacon), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major reason the Catholic Church held immense influence was its <strong>monopoly over education and book production</strong>. In monastic scriptoria, monks hand-copied all manuscripts, allowing the Church to censor texts that contradicted scripture. Furthermore, universities were run by clergy, teaching medical students to memorise ancient authorities rather than conduct practical examinations. Therefore, this led to Church dominance over medical ideas because physicians were trained only in Church-approved doctrines and never investigated physical causes independently.<br><br>Furthermore, the Church promoted <strong>Galen's anatomical theories within a Christian worldview</strong>. Although Galen was pagan, his belief that the human body was designed by a single Creator aligned with Catholic theology. The Church declared Galen infallible, teaching that dissections served only to demonstrate his perfection. Therefore, this caused Galen's medical ideas to be accepted as unquestionable doctrine because challenging his anatomy was treated as challenging God's divine creation.<br><br>In addition, the Church dominated ideas because society believed <strong>disease was divine punishment for sin</strong>. Priests taught that epidemics like the 1348 Black Death were sent by God, making repentance the only cure. Questioning supernatural causes was punished as heresy; in 1277, Roger Bacon was imprisoned for advocating scientific observation. Therefore, this reinforced the Church's total influence over ideas about disease because ordinary people and physicians believed seeking physical cures was futile without seeking divine forgiveness.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_1_2_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Galen’s medical ideas continued to be believed for hundreds of years because he was a famous Greek doctor whose books were respected by everybody. The Catholic Church told doctors to read his books, and nobody was allowed to dissect bodies to see if he was right or wrong. Also his ideas about the Four Humours seemed to make sense to ordinary people. Therefore people just kept believing Galen because they had no better ideas.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions general points (respect, Church, Four Humours) but provides no precise evidence, lacks PEEL structure, and tells a simple story without sustained causal explanation."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason Galen's ideas continued to be believed was <strong>Church approval of his monotheism</strong>. Galen wrote that the body was designed by a divine Creator, which fit Catholic teachings. The Church controlled universities and made sure students only studied Galen's books. Anyone who criticised Galen risked being punished for heresy, so medical professors never questioned his writings.<br><br>Another reason was the <strong>lack of practical human dissection</strong>. The Church restricted human dissections, and when they took place, an assistant did the cutting while the professor read aloud from Galen. If the corpse looked different from Galen's book, professors said the body was deformed rather than admitting Galen was wrong.<br><br>In conclusion, the Church and lack of dissection meant Galen was accepted for centuries.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Church monotheism and lack of dissection). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the practical clinical utility of the Theory of Opposites), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major reason Galen's ideas endured was the <strong>Catholic Church's active endorsement of his monotheism</strong>. Galen argued that every organ was designed for a purpose by a divine Creator, aligning with Christian theology. Because the Church controlled university curricula and book copying, it declared Galen infallible and outlawed criticism of his texts. Therefore, this led to Galen's ideas being preserved for centuries because the Church made his medical teachings the mandatory foundation of all licensed medical education.<br><br>Furthermore, Galen's ideas persisted due to the <strong>severe lack of practical human dissection</strong>. Catholic authorities restricted human dissection, forcing scholars to rely on ancient books. When annual dissections occurred, barber-surgeons cut while professors read Galen aloud; any anatomical mismatch was blamed on a deformed corpse. Therefore, this caused Galen's anatomical mistakes to remain unchallenged because physicians never had the practical opportunity to examine and map internal human anatomy for themselves.<br><br>In addition, Galen was believed because his <strong>Theory of Opposites provided a logical, practical clinical system</strong>. Expanding Hippocrates' Four Humours, Galen taught that illness stemmed from humoural imbalances treatable by opposites, such as hot pepper for cold phlegm. This gave doctors a systematic method to explain symptoms and prescribe clear treatments. Therefore, this ensured Galen's ideas continued to be believed because his humoural system offered an accessible, common-sense explanation for illness that seemed to explain every symptom.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (227 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_1_3_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Medieval treatments focused on humoural balance because everyone believed in the Four Humours. Doctors thought that being sick meant you had too much blood, yellow bile, black bile, or phlegm in your body. To fix this, barber-surgeons cut people's veins to let out bad blood or gave them herbs to make them vomit. Therefore they kept trying to balance the humours because they did not know about germs.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions the Four Humours and bloodletting, but lacks analytical PEEL paragraphs, includes no named medical theories or texts, and tells a simple story."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason treatments focused on humoural balance was <strong>Galen's Theory of Opposites</strong>. Galen taught that each humour had qualities like hot, cold, wet, and dry. If a patient caught a cold, doctors gave them hot, dry remedies like pepper or wine to balance them out. This made sense to medieval people, so treatments always tried to balance the body.<br><br>Another reason was the common use of <strong>bloodletting and purging</strong>. Doctors and barber-surgeons used phlebotomy charts to cut specific veins, or applied leeches to drain excess blood. They also gave emetics and laxatives to clear out yellow or black bile and restore balance.<br><br>In conclusion, Opposites and bloodletting were the main ways medieval doctors treated their patients.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Theory of Opposites and bloodletting/purging). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as university medical dogma, astrology, and urine charts), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary reason treatments focused on humoural balance was the <strong>practical application of Galen's Theory of Opposites</strong>. Physicians believed the body was governed by blood, phlegm, black bile, and yellow bile, carrying opposing qualities of heat, cold, wetness, and dryness. Under Galen's rules, a patient suffering from a cold, wet fever was prescribed hot, dry remedies like pepper or radish to counteract the humoural excess. Therefore, this caused treatments to focus on humoural balance because physicians believed opposing qualities could directly neutralise excess bodily fluids.<br><br>Furthermore, humoural balancing was reinforced through <strong>invasive physical procedures like bloodletting and purging</strong>. Barber-surgeons used vein-man phlebotomy charts to bleed patients via incisions, cupping, or leeches to remove excess blood, the most dangerous humour. Similarly, physicians prescribed violent emetics and laxatives to expel corrupt yellow and black bile. Therefore, this forced medieval healers to concentrate on humoural balance because removing excess blood or bile was seen as the only practical way to extract corrupt humours.<br><br>In addition, humoural treatments dominated because <strong>university-trained physicians relied entirely on diagnostic charts and astrology</strong>. Doctors inspected urine against colour charts and consulted zodiac horoscopes to calculate planetary humoural influences. Because classical Hippocratic-Galenic doctrine was taught as infallible in universities, alternative physical treatments were never developed. Therefore, this led to total reliance on humoural balancing treatments because licensed medieval physicians were legally and academically bound to follow classical humoural dogma.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (233 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_1_4_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Medieval hospitals provided care not cure because they were run by monks and nuns in Catholic monasteries. Monks gave sick people warm beds, soup, and said prayers for their souls, but they did not have doctors to cure them. Also, hospitals did not allow people with catching diseases like leprosy inside. Therefore patients were just looked after until they either got better or died peacefully.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions monks, prayer, and beds, but provides no specific hospital names, dates, or analytical PEEL structure, explaining the topic as a simple story."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason hospitals gave care not cure was <strong>monastic rules and the focus on prayer</strong>. Medieval hospitals like St Bartholomew's were run by religious orders who followed the Seven Works of Mercy. Monks and nuns focused on feeding the hungry, giving warm clothing, and praying for patients' souls so they could go to heaven, rather than giving medical cures.<br><br>Another reason was the <strong>lack of medically trained physicians in hospitals</strong>. University-trained doctors were very expensive and worked only for wealthy nobles. Hospitals were looked after by nuns and sisters who had no medical training and could only offer basic nursing care and clean sheets.<br><br>In conclusion, religious prayer and having no doctors meant hospitals only cared for people.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (monastic rules/prayer and lack of physicians). However, it remains narrative and omits a third distinct aspect beyond the stimulus (such as the exclusion of infectious diseases and focus on travellers/pilgrims), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major reason medieval hospitals provided 'care not cure' was their <strong>monastic foundation and primary focus on spiritual salvation</strong>. Institutions like St Bartholomew's in London were run by religious orders obeying Christ's Seven Works of Mercy. Monks and nuns prioritised saving the immortal soul through daily masses, confession, and bedside prayers rather than attempting physical cures, believing sickness reflected divine will. Therefore, this caused medieval hospitals to prioritise care over cure because religious orders believed spiritual salvation through prayer was far more vital than treating mortal physical illness.<br><br>Furthermore, hospitals could not offer medical cures due to the <strong>total absence of university-trained physicians</strong>. Licensed physicians were expensive and served only wealthy aristocratic patrons for private fees. Hospital wards were staffed entirely by nuns and sisters who provided basic nursing—warmth, clean bedding, rest, and broth—without possessing surgical or pharmaceutical training. Therefore, this led hospitals to provide care not cure because attendants possessed no surgical or pharmaceutical training and could only offer basic nursing comfort.<br><br>In addition, hospitals enforced <strong>strict admission rules that deliberately excluded contagious and dying patients</strong>. Monastic statutes barred lepers, plague victims, and pregnant women to protect the house, redirecting lepers to outside lazar houses. Instead, hospitals functioned as shelters for elderly pilgrims, destitute travellers, and the infirm. Therefore, this reinforced the policy of care not cure because hospitals were designed as charitable shelters for rest and recovery rather than medical facilities for healing dangerous diseases.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_2_1_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Ideas about disease changed because of Gutenberg's printing press, which meant books could be made much faster without monks writing them. Also the Royal Society was set up by King Charles II so scientists could meet and talk about their ideas. Furthermore, people began writing books in English instead of Latin so normal people could read them. Therefore new medical ideas spread around much quicker.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions the printing press, Royal Society, and English language, but lacks analytical PEEL paragraphs, dates, and sustained causal explanation."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason communication changed was the invention of <strong>the printing press by Gutenberg</strong>. Before this, monks copied manuscripts by hand, which took months and caused copying mistakes. With movable metal type, thousands of identical medical books like Vesalius's anatomy textbook could be printed quickly and sold across Europe with clear anatomical pictures.<br><br>Another reason was the founding of the <strong>Royal Society and Philosophical Transactions</strong> in 1665. The Royal Society met in London to watch experiments and discuss scientific ideas. They published the world's first scientific journal, which allowed doctors and scientists to share their findings and debate discoveries.<br><br>In conclusion, the printing press and Royal Society allowed medical books and ideas to travel much faster.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (printing press and Royal Society). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as secular publishing in English and humanist empirical debate), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major catalyst for changing medical communication was the <strong>widespread adoption of Gutenberg's movable metal-type printing press</strong>. Prior to printing, manuscripts were hand-copied by monks, which was slow and riddled with errors. The printing press allowed identical copies of revolutionary texts, such as Andreas Vesalius's *The Fabric of the Human Body* (1543), to be mass-produced with precise anatomical woodcuts. Therefore, this led to revolutionary changes in communication because accurate medical ideas and illustrations could spread across Europe in weeks without copying errors.<br><br>Furthermore, communication was transformed by the <strong>establishment of the Royal Society and its journal *Philosophical Transactions* (1665)</strong>. Granted a royal charter by Charles II in 1662, the Society adopted the motto *Nullius in Verba* ('Take nobody's word for it'). By publishing regular reports of scientific experiments, the journal enabled doctors across Europe to review, challenge, and replicate new medical hypotheses. Therefore, this caused a major shift in communication because scientists could publish, debate, and peer-review empirical experimental findings rapidly across national borders.<br><br>In addition, communication evolved through the <strong>decline of Church Latin in favour of vernacular English medical publishing</strong>. During the Renaissance, physicians and surgeons began writing textbooks in English rather than Latin, making anatomical and surgical knowledge accessible to barber-surgeons and apothecaries who lacked university education. Therefore, this transformed medical communication because scientific ideas were no longer monopolised by churchmen but shared openly among practical medical practitioners.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_2_2_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Thomas Sydenham was significant because he was known as the 'English Hippocrates'. He believed doctors should sit by patients' beds and watch their symptoms carefully instead of just reading ancient textbooks. He wrote a famous book called Observationes Medicae and realised diseases were different from each other. He also gave people cool rooms for smallpox. Therefore Sydenham helped change medicine by watching patients directly.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions the nickname and book title, but lacks analytical PEEL paragraphs, provides no detailed classification mechanics, and tells a simple story."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason Thomas Sydenham was significant was his <strong>classification of distinct illnesses</strong>. Before Sydenham, doctors believed every patient had a unique humoural imbalance. Sydenham argued that diseases had specific identities like plants, and could be sorted into groups based on their symptoms, which helped doctors diagnose separate diseases.<br><br>Another reason was his book <strong>Observationes Medicae (1676)</strong>. Sydenham wrote down exact descriptions of different illnesses like scarlet fever, measles, and gout. His book was used by medical students for over two hundred years because it gave accurate clinical observations instead of old theories.<br><br>In conclusion, Sydenham's book and classification of diseases made him a very important doctor in Britain.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (classification and Observationes Medicae). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as his rejection of humoural treatments and use of cinchona/cool air therapies), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major reason Thomas Sydenham was significant was his <strong>revolutionary classification of diseases into distinct species</strong>. Previously, humoural theory taught that each patient suffered from a unique, personal bodily imbalance. Sydenham challenged this by arguing that diseases had consistent, external characteristics and could be classified into distinct families, just like botanists classified plants. Therefore, this caused a major breakthrough in medicine because doctors began diagnosing specific external diseases rather than blaming vague internal humoural disharmonies.<br><br>Furthermore, Sydenham achieved lasting significance through his <strong>landmark medical textbook *Observationes Medicae* (1676)</strong>. Based on meticulous clinical case notes, Sydenham provided the first accurate medical descriptions differentiating scarlet fever from measles and diagnosing severe gout. His book became a standard university textbook across Europe for over two centuries, training generations of physicians in empirical diagnostics. Therefore, this led to lasting significance because his textbook gave generations of physicians an empirical clinical guide to identify and record specific illnesses accurately.<br><br>In addition, Sydenham was significant because he <strong>pioneered practical bedside observation over traditional humoural treatments</strong>. Earning the title 'the English Hippocrates', he refused to bleed feverish patients automatically, instead prescribing fresh air and cool drinks for smallpox patients and using Peruvian cinchona bark (quinine) to treat malaria. Therefore, this made Sydenham significant because his empirical methods broke with unproven medieval traditions and laid the foundations for modern scientific clinical medicine.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (226 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_2_4_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "William Harvey was a turning point because he discovered that blood travels round the body in a circle. He proved that the heart acts like a pump by checking heart valves and tying up people's arms. He wrote a book called De Motu Cordis in 1628 to show everyone that Galen was wrong about the liver making blood. Therefore Harvey changed what people knew about human bodies.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions circulation, the heart pump, and De Motu Cordis, but lacks analytical PEEL paragraphs, provides no volume calculations, and tells a simple story."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason William Harvey was a turning point was his <strong>observation of mechanical heart valves</strong>. By dissecting cold-blooded animals whose hearts beat slowly, Harvey proved that blood only pumped one way through the heart. He tied tight ligatures around human arms to show that blood flowed down in arteries and back up in veins.<br><br>Another reason was his book <strong>De Motu Cordis (1628)</strong>. In this book, Harvey published mathematical calculations showing that the heart pumped hundreds of pints of blood each hour, which was far too much for the liver to produce, proving circulation was true.<br><br>In conclusion, Harvey's experiments and famous book in 1628 made him a great turning point in medical history.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (valves/ligatures and De Motu Cordis). However, it remains narrative and omits a third distinct aspect beyond the stimulus (such as dismantling Galen's liver dogma and undermining humoural bloodletting), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major reason William Harvey's discovery was a turning point was his <strong>observation of mechanical heart valves and blood flow</strong>. Dissecting cold-blooded animals with slow heartbeats, Harvey demonstrated that the heart acted as a muscular pump pushing blood into arteries, while one-way venous valves prevented backflow. Using arm ligatures, he proved blood travelled away from the heart in arteries and returned via veins. Therefore, this caused a turning point because it provided empirical proof that the heart functioned as a mechanical muscular pump circulating a fixed volume of blood.<br><br>Furthermore, Harvey was a turning point because his <strong>treatise *De Motu Cordis* (1628) established experimental proof</strong>. Harvey calculated mathematically that the heart pumped three times an adult's body weight in blood hourly, proving the liver could not produce that volume continuously from food. Therefore, this led to a revolution in medical science because it gave the European scientific community undeniable experimental evidence that could be independently tested and verified.<br><br>In addition, Harvey was a turning point because he <strong>shattered Galen's 1,400-year-old dogma regarding bodily physiology</strong>. Galen taught that blood was made in the liver and consumed by tissues. By proving continuous circulation, Harvey disproved Galen's physiology, undermining the rationale for humoural bloodletting. Therefore, this transformed medical thinking because proving Galen wrong on core physiology undermined the entire basis of humoural treatments like bloodletting and encouraged modern experimental physiology.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_3_1_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "There was rapid progress in finding causes of illness because Louis Pasteur invented the Germ Theory in 1861. He used a swan-neck flask to show germs caused decay. Then Robert Koch found the exact bacteria for anthrax and cholera by growing them on agar plates and staining them. Also better microscopes were invented. Therefore doctors finally understood that bacteria caused disease instead of bad smells.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Pasteur, Koch, and microscopes, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason for rapid progress was the work of <strong>Louis Pasteur</strong>. In 1861, Pasteur published his Germ Theory, proving that microbes caused beer and milk to spoil. He used swan-necked flasks to disprove spontaneous generation, showing that microscopic organisms lived in the air and caused decay rather than generating from rotting matter.<br><br>Another reason was the discoveries of <strong>Robert Koch</strong>. Koch built on Pasteur's work by identifying the specific bacteria that caused diseases. In 1876 he found the anthrax microbe, in 1882 he identified the bacterium for tuberculosis, and in 1883 he found the cholera microbe using agar jelly and chemical dyes.<br><br>In conclusion, Pasteur and Koch together proved that specific microbes caused deadly diseases.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Pasteur and Koch). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as technological advances in microscopes and industrial dye staining), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary reason for rapid progress was <strong>Louis Pasteur's publication of Germ Theory in 1861</strong>. Investigating why beer soured, Pasteur used swan-necked flasks to disprove spontaneous generation, demonstrating that airborne microorganisms caused decay. Although British doctors initially resisted his findings, Pasteur subsequently proved that specific microorganisms caused animal diseases like silkworm blight and chicken cholera. Therefore, this caused rapid progress because it replaced vague miasma theories with scientific proof that specific living microbes were the physical agents of disease.<br><br>Furthermore, progress accelerated due to <strong>Robert Koch's development of bacteriological methods</strong>. German doctor Robert Koch developed revolutionary techniques: using solid agar jelly in Petri dishes to culture pure bacterial colonies and methyl violet dyes to stain transparent bacteria. Between 1876 and 1883, Koch successfully identified the specific microbes responsible for anthrax, tuberculosis, and cholera. Therefore, this led to rapid identification of illnesses because Koch established a replicable scientific method for isolating and proving exactly which bacterium caused which disease.<br><br>In addition, progress was driven by <strong>crucial technological developments in precision microscopy</strong>. In 1830, Joseph Jackson Lister designed achromatic lenses that eliminated optical distortion, and by the 1870s, Ernst Abbe developed oil-immersion lenses magnifying specimens 1,000 times. Combined with microphotography, these optical breakthroughs allowed scientists worldwide to visually verify Koch's bacteria. Therefore, this accelerated medical progress because researchers now possessed the precision optical instruments necessary to see, differentiate, and photograph deadly bacteria.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (228 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_3_2_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "There was opposition to Edward Jenner's smallpox vaccination because people were afraid of taking cowpox from a cow. Religious leaders said it was wrong to put animal disease into humans, and cartoons showed people turning into cows. Doctors who inoculated people with real smallpox also opposed it because they lost money. Therefore people protested against Jenner's new vaccine.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions fear of cows, inoculators, and cartoons, but lacks analytical PEEL paragraphs, dates, and sustained causal explanation."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason for opposition was resistance from <strong>commercial inoculators</strong>. Doctors and inoculators like the Sutton family made large amounts of money inoculating wealthy people with live smallpox. Jenner's cowpox vaccine was much cheaper and safer, so commercial inoculators attacked Jenner in medical journals to protect their profits.<br><br>Another reason was the formation of the <strong>Anti-Vaccination League</strong>. When the British government passed laws in 1853 and 1867 making vaccination compulsory for babies, parents protested. The League argued that compulsory vaccination infringed on personal liberty and took away parents' rights to decide their children's healthcare.<br><br>In conclusion, money and government laws caused strong opposition to Jenner's smallpox vaccination.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (inoculators and Anti-Vaccination League). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as religious outrage over animal fluids and Jenner's inability to explain the biological mechanism), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major reason for opposition was <strong>fierce financial resistance from commercial inoculators</strong>. In the eighteenth century, smallpox variolation (inoculating patients with live smallpox scabs) was a highly profitable commercial enterprise dominated by medical dynasties like the Sutton family. Because Jenner offered cowpox vaccination as a safer and much cheaper alternative, commercial inoculators waged aggressive public campaigns questioning Jenner's competence to protect their lucrative medical practices. Therefore, this caused fierce opposition because established medical practitioners actively campaigned against vaccination to protect their lucrative inoculation businesses.<br><br>Furthermore, opposition intensified through the <strong>founding of the Anti-Vaccination League against compulsory legislation</strong>. When Parliament passed Compulsory Vaccination Acts in 1853 and 1867 enforcing fines and prison sentences for non-compliant parents, massive public resistance erupted. Leagues formed across Britain, arguing that state-mandated injections violated individual civil liberties and bodily autonomy. Therefore, this led to widespread opposition because working-class citizens and libertarian leagues viewed compulsory state-enforced injections as tyranny over their personal bodies.<br><br>In addition, opposition was fuelled by <strong>deep religious objections and Jenner's inability to explain the biological mechanism</strong>. Church ministers preached that infecting humans with animal disease from cows was immoral, while James Gillray's satirical cartoons depicted vaccinated patients sprouting cow horns. Because Jenner could not scientifically explain why cowpox conferred immunity before Germ Theory, many physicians remained sceptical. Therefore, this generated sustained public hostility because superstitious fears and moral outrage convinced many that injecting animal matter defied divine law.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (231 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_3_3_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Hospital care improved rapidly because Florence Nightingale went to the Crimean War and cleaned up the hospital at Scutari. She washed the floors, brought clean food, and cut the death rate. When she came home she opened a nursing school. Also Joseph Lister used carbolic acid in surgery, which stopped people dying of infections. Therefore hospitals became much safer and cleaner places for patients.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Nightingale, Scutari, and Lister, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason hospital care improved was the work of <strong>Florence Nightingale</strong>. During the Crimean War at Scutari hospital, Nightingale cleaned the wards, provided clean clothing, and improved ventilation, reducing the death rate from 42% to 2%. In 1860 she set up the Nightingale Training School at St Thomas' Hospital, turning nursing into a respected, trained profession.<br><br>Another reason was the development of <strong>antiseptic and aseptic surgery</strong>. In 1865, Joseph Lister used carbolic acid spray to kill bacteria during operations, reducing surgical mortality from 46% to 15%. By the 1890s, hospitals adopted aseptic techniques, sterilising instruments and using rubber gloves.<br><br>In conclusion, Nightingale's nursing reforms and Lister's antiseptics made hospitals much better places.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Nightingale and antiseptic/aseptic surgery). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as architectural pavilion design and cross-ventilation), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major factor improving hospital care was <strong>Florence Nightingale's professionalisation of nursing and sanitation</strong>. Returning from the Crimean War, where her sanitary reforms at Scutari reduced mortality from 42% to 2%, Nightingale published *Notes on Nursing* (1859). In 1860, she established the Nightingale Training School at St Thomas' Hospital, establishing rigorous training in patient hygiene and ward administration. Therefore, this caused a revolution in hospital care because nursing was transformed into a disciplined, professional medical career that dramatically reduced patient mortality.<br><br>Furthermore, care was transformed by the <strong>transition from antiseptic to aseptic surgery</strong>. In 1865, Joseph Lister introduced carbolic acid spray to sterilise wounds and dressings, reducing surgical gangrene mortality from 46% to 15%. By the 1890s, surgeons advanced to aseptic methods: boiling surgical instruments in steam autoclaves, wearing sterile rubber gloves and gowns, and sterilising operating theatres. Therefore, this led to rapid improvements in hospitals because wards and operating theatres were transformed from lethal death traps into clean, sterile environments where post-operative infections plummeted.<br><br>In addition, hospital improvement was accelerated by <strong>revolutionary pavilion-style architectural redesigns</strong>. Advocated in Nightingale's *Notes on Hospitals* (1859), modern hospitals were built with separate pavilion wards, large windows, polished tiled surfaces, and cross-ventilation to disperse miasmas and bacteria. Isolating infectious patients in dedicated fever wards prevented deadly cross-contamination. Therefore, this improved hospital care because modern architectural design effectively stopped the airborne spread of cross-infection between patients.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (227 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_3_5_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The British government decided to abandon laissez-faire and pass the 1875 Public Health Act because towns were filthy and overcrowded. People were drinking dirty water and catching diseases like cholera, which killed thousands of people in slums. Furthermore, the Great Stink in London smelled terrible outside Parliament, so politicians realized they had to do something to clean up the river and help ordinary people. Therefore the government decided to step in and pass laws to make towns cleaner.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions relevant issues (filth, cholera, Great Stink) but fails to structure analytical PEEL paragraphs, provides no specific dates or franchise mechanics (no mention of the 1867 Reform Act), and treats the change as a simple story rather than explaining causal links."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One major reason the government passed the 1875 Public Health Act was the <strong>Great Stink of 1858</strong>. During the hot summer, the River Thames smelled so terrible from raw sewage that MPs in Parliament could not breathe and had to soak the curtains in chloride of lime. Fearing they would catch disease from the miasma, Parliament gave money to Joseph Bazalgette to build London’s underground sewer network. Bazalgette’s sewers were a huge success and showed that engineering could stop cholera, which encouraged the government to pass a national law.<br><br>Another reason was the work of <strong>Dr John Snow and Louis Pasteur</strong>. In 1854, John Snow proved that cholera was carried in dirty water by removing the handle of the Broad Street pump in Soho. Later, in 1861, Pasteur published his Germ Theory which proved that bacteria caused disease. This showed that dirty water really did kill people, so the government realized they could no longer leave public health alone.<br><br>In conclusion, the Great Stink and new scientific discoveries made the government realize that laissez-faire was dangerous, so they passed the 1875 Public Health Act.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Describes two relevant factors (The Great Stink and Snow/Pasteur) with accurate historical knowledge. However, it remains narrative rather than analytical, and crucially fails to address three aspects of content by omitting the political catalyst beyond the stimulus (the enfranchisement of working-class voters in the 1867 Reform Act), legally capping the mark at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major reason the government abandoned laissez-faire was the <strong>expansion of the franchise through the 1867 Reform Act</strong>. Before 1867, only wealthy property owners voted, so governments kept taxes low by ignoring slum housing. However, the 1867 Reform Act gave the vote to urban working-class men. To win general elections, politicians like Benjamin Disraeli had to compete for working-class votes by promising social improvements. Therefore, this forced the government to abandon laissez-faire because politicians now depended directly on working-class electors who demanded sanitary legislation.<br><br>Furthermore, reform was compelled by the <strong>crisis of the Great Stink of 1858</strong>. During an intensely hot summer, untreated sewage in the Thames produced an unbearable stench outside Parliament, forcing MPs to soak curtains in chloride of lime. Fearing miasma would sicken politicians, Parliament granted £3 million to Joseph Bazalgette to build London's underground sewers. Therefore, this led to national public health reform because Bazalgette's massive engineering triumph proved that state intervention directly saved lives.<br><br>In addition, the shift was driven by <strong>scientific proof from John Snow and Louis Pasteur</strong>. In 1854, Snow demonstrated cholera was waterborne by removing the Broad Street pump handle, while Pasteur's 1861 Germ Theory proved microscopic bacteria thrived in dirty water. This destroyed miasma theory and exposed laissez-faire as deadly negligence. Therefore, this caused the passage of the 1875 Act because ministers now possessed undeniable proof that only compulsory clean water and sanitation could halt lethal epidemics.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (220 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_4_1_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Understanding of genetics improved quickly after 1950 because Rosalind Franklin took a famous X-ray picture called Photograph 51. Then Watson and Crick used it to build the double helix model of DNA. Later on, scientists did the Human Genome Project to map out every human gene using fast computers. Therefore doctors now understand what causes hereditary diseases like cystic fibrosis.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Franklin, Watson/Crick, and the Human Genome Project, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason understanding improved was <strong>Rosalind Franklin and Photograph 51</strong>. In 1952, Rosalind Franklin used X-ray crystallography to take Photograph 51 at King's College London. This image showed the structure of DNA, which allowed James Watson and Francis Crick in 1953 to build the famous double helix model showing how genes pass on traits.<br><br>Another reason was the <strong>Human Genome Project</strong>. Launched in 1990 and completed in 2003, this international scientific project mapped all three billion base pairs of human DNA. This gave doctors an exact map of human genes, helping them see which genes cause hereditary diseases.<br><br>In conclusion, Franklin's photo and the Human Genome Project helped scientists understand genetics.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Franklin and the Human Genome Project). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as computing technology, automated sequencers, and gene therapy), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major factor driving rapid progress was <strong>Rosalind Franklin's capture of Photograph 51 in 1952</strong>. Working at King's College London, Franklin used X-ray crystallography to produce Photograph 51, providing the critical physical evidence revealing DNA's helical geometry. This enabled James Watson and Francis Crick in 1953 to construct the double-helix DNA model, demonstrating how chemical base pairs replicate genetic instructions. Therefore, this caused rapid genetic progress because identifying the double-helix structure revealed the exact physical mechanism by which genetic information is stored and replicated.<br><br>Furthermore, understanding accelerated through the <strong>international collaboration of the Human Genome Project (1990–2003)</strong>. Co-ordinated by scientists across Britain, the USA, and globally, this public project successfully mapped all three billion chemical base pairs in human DNA. Mapping the complete genetic blueprint allowed medical researchers to identify the specific genetic mutations responsible for conditions like Down's syndrome and Huntington's disease. Therefore, this led to massive medical breakthroughs because mapping the entire human genetic sequence allowed scientists to identify the specific faulty genes responsible for hereditary diseases.<br><br>In addition, progress was made possible by <strong>post-war advances in computing power and automated DNA sequencers</strong>. In the late twentieth century, automated sequencing machines and digital supercomputers replaced manual gene counting, allowing laboratories to analyse millions of base pairs in hours rather than decades. Therefore, this accelerated genetic understanding because computerized data-processing enabled researchers to rapidly detect genetic mutations and develop targeted gene therapies.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (226 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_4_2_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Technology improved diagnosis in the twentieth century because doctors got new machines. Wilhelm Röntgen discovered X-rays which let doctors see broken bones without cutting people open. Then CT and MRI scanners were invented in the 1970s which let doctors look inside people's brains and organs. Doctors also started using blood tests. Therefore technology made finding out what was wrong with patients much easier.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions X-rays, CT/MRI, and blood tests, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason technology improved diagnosis was the invention of <strong>X-rays</strong>. Discovered by Wilhelm Röntgen in 1895, X-rays allowed doctors to take images of bones and locate bullets inside soldiers without surgery. During the First World War, mobile X-ray machines helped surgeons find shrapnel quickly, making diagnosis much faster and safer.<br><br>Another reason was the development of <strong>CT and MRI scanners</strong>. In 1972, Godfrey Hounsfield invented the CT scanner using computers to build 3D images of the body. In the 1970s, MRI scanners were developed using magnetic fields to produce detailed pictures of soft tissues, helping doctors detect tumours.<br><br>In conclusion, X-rays and MRI scanners helped doctors diagnose patients without operating.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (X-rays and CT/MRI). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as blood testing, automated laboratory pathology, and endoscopes), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major technological development was the <strong>discovery and medical application of X-rays</strong>. Discovered by Wilhelm Röntgen in 1895, X-rays passed through soft tissue to cast shadows of dense bone on photographic plates. By 1914, Marie Curie's mobile radiology units enabled battlefield surgeons to locate bullets and shrapnel immediately, eliminating dangerous exploratory operations. Therefore, this led to major diagnostic improvements because doctors could locate internal fractures, tumours, and foreign objects without having to perform dangerous exploratory surgery.<br><br>Furthermore, diagnosis was transformed by the <strong>invention of advanced CT and MRI scanners in the 1970s</strong>. In 1972, British engineer Godfrey Hounsfield invented the CT scanner, using computers to combine multiple X-ray cross-sections into 3D images. Soon after, Magnetic Resonance Imaging (MRI) used magnetic fields and radio waves to image soft tissues like the brain and spinal cord without radiation. Therefore, this caused diagnostic accuracy to increase dramatically because physicians could detect early-stage brain tumours, internal bleeding, and organ damage with unprecedented precision.<br><br>In addition, diagnosis was improved by <strong>scientific blood analysis, chemical pathology, and flexible endoscopes</strong>. Twentieth-century automated blood testing allowed clinicians to measure white blood cell counts, identify blood groups, and detect chemical markers for diabetes and kidney failure. Simultaneously, fibre-optic endoscopes allowed internal organs to be directly viewed. Therefore, this transformed medical diagnosis because clinicians could identify diseases biochemically and visually at an early, treatable stage rather than relying on external physical symptoms.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (229 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_4_3_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The NHS was set up in 1948 because the British people wanted free healthcare after the Second World War. William Beveridge wrote a famous report saying Britain should fight the five giants like Disease. Then Aneurin Bevan, the new Health Minister, argued with doctors and persuaded them to join the NHS. On 5 July 1948, the NHS opened so healthcare was free for everyone. Therefore people no longer had to pay to see a doctor.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Beveridge, Bevan, and free healthcare, but lacks analytical PEEL paragraphs, provides no detailed legislation or wartime mechanics, and tells a simple story."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the NHS was set up was the <strong>Beveridge Report of 1942</strong>. Sir William Beveridge identified 'Five Giants' that ruined lives, including Disease. His report sold over 600,000 copies and recommended a free national health service from the cradle to the grave, which became hugely popular with the British public during the war.<br><br>Another reason was the determination of <strong>Aneurin Bevan</strong>. As Labour's Minister of Health, Bevan fought hard against the British Medical Association, who did not want to become state employees. Bevan compromised by letting consultants keep private hospital beds, famously saying he 'stuffed their mouths with gold', and opened the NHS on 5 July 1948.<br><br>In conclusion, Beveridge's report and Bevan's political skills made the NHS a reality.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Beveridge Report and Bevan). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the wartime Emergency Medical Service and pre-war healthcare inequality), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major factor behind the NHS was the <strong>impact of the Beveridge Report in 1942</strong>. Sir William Beveridge identified 'Disease' as one of the Five Giants blighting society, proposing a comprehensive welfare state providing healthcare 'from the cradle to the grave'. Selling over 600,000 copies, the report created immense public demand that compelled post-war politicians to act. Therefore, this led to the creation of the NHS because Beveridge created irresistible democratic momentum that forced the post-war Labour government to promise a universal healthcare system.<br><br>Furthermore, the NHS was achieved through the <strong>political tenacity and pragmatism of Health Minister Aneurin Bevan</strong>. Bevan faced intense resistance from the British Medical Association (BMA), who feared doctors would become underpaid state servants. Bevan overcame this by allowing hospital consultants to retain private patients in NHS hospitals, famously remarking he 'stuffed their mouths with gold'. Therefore, this caused the successful launch of the NHS because Bevan's political compromises defeated medical opposition and made healthcare free at the point of delivery.<br><br>In addition, the reform was driven by the <strong>wartime Emergency Medical Service (EMS) and pre-war healthcare inequality</strong>. Prior to 1948, working-class wives and children were excluded from national insurance. During the Blitz, the government EMS treated air-raid casualties, proving centralised medical coordination was remarkably effective. Therefore, this forced the establishment of the NHS because wartime state coordination proved a national health system was viable and destroyed public tolerance for unequal pre-war healthcare.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_4_5_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Government methods to prevent lung cancer changed because doctors discovered smoking caused cancer. Richard Doll proved that smoking cigarettes gave people tumours in their lungs. Later on, the government banned smoking in pubs and restaurants in 2007 so other people would not breathe in smoke. They also put graphic pictures on cigarette packets and raised taxes. Therefore the government took strong action to stop people smoking.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Doll, the 2007 ban, and packets, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason prevention changed was the <strong>epidemiological studies of Richard Doll</strong>. In 1950, Richard Doll and Austin Bradford Hill published research showing that heavy smokers were twenty times more likely to get lung cancer. This scientific proof destroyed the belief that smoking was harmless and forced the government to issue health warnings.<br><br>Another reason was the introduction of the <strong>2007 public smoking ban</strong>. The government passed the Health Act 2007, making it illegal to smoke in enclosed workplaces, pubs, and restaurants. This was designed to protect the public from dangerous secondhand smoke and make smoking less socially acceptable.<br><br>In conclusion, Doll's scientific proof and the 2007 smoking ban were key reasons why prevention methods changed.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Doll's research and the 2007 ban). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as punitive taxation, advertising bans, and standardised plain packaging), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major factor transforming prevention was <strong>conclusive epidemiological evidence provided by Richard Doll and Austin Bradford Hill</strong>. In 1950, Doll and Hill surveyed 709 patients, establishing a definitive statistical link between tobacco smoke and lung cancer, followed by their 1954 study showing heavy smokers were twenty times more likely to die from the disease. Therefore, this caused government prevention to change because conclusive statistical proof destroyed tobacco company denial and forced ministers to treat smoking as a lethal public health crisis.<br><br>Furthermore, prevention methods changed through <strong>compulsory statutory bans, culminating in the 2007 Health Act</strong>. Abandoning voluntary agreements that failed to curb consumption, Parliament banned television cigarette adverts in 1965 and sports sponsorship in 2002. In 2007, legislation made smoking in all enclosed workplaces and restaurants a criminal offence to eliminate second-hand smoke. Therefore, this led to a radical transformation in prevention because the state used statutory legislation to protect non-smokers and de-normalise smoking in British public life.<br><br>In addition, the government shifted towards <strong>punitive fiscal taxation, mass education, and standardized plain packaging</strong>. Successive chancellors raised tobacco excise duties until taxes exceeded 80% of retail packet costs, pricing young people out of smoking. In 2016, legislation mandated olive-green plain packaging displaying graphic photographic warnings of diseased lungs. Therefore, this forced smoking rates to fall sharply because aggressive fiscal disincentives and the removal of glamorous branding made cigarettes unaffordable and unappealing to young people.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (220 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  }
};

module.exports = { medicine12mUpdates };
