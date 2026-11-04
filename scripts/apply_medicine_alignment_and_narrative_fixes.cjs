const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dataJsPath = path.join(rootDir, 'units', 'edexcel_medicine', 'data.js');

async function main() {
  console.log('======================================================================');
  console.log('APPLYING EDEXCEL MEDICINE NARRATIVE REPAIRS & WORKBOOK PARITY ALIGNMENT');
  console.log('======================================================================\n');

  // Import data.js
  const fileUrl = 'file:///' + dataJsPath.replace(/\\/g, '/');
  const module = await import(fileUrl);
  const data = module.default || module;
  const lessons = data.lessons || [];

  // -------------------------------------------------------------------------
  // 1. NARRATIVE BLOCK REPAIRS
  // -------------------------------------------------------------------------
  console.log('▶ Repairing Narrative Blocks in KT1...');

  // Lesson 2 (lesson_1_2), Block 4: Teleology & Church Monopoly
  const l2 = lessons.find(l => l.id === 'lesson_1_2');
  if (l2 && l2.narrative_blocks && l2.narrative_blocks[3]) {
    l2.narrative_blocks[3].title = "Galen, Teleology, and the Church's Monopoly";
    l2.narrative_blocks[3].theme_heading = "Galen, Teleology, and the Church's Monopoly";
    l2.narrative_blocks[3].text = `Galen’s medical ideas survived and dominated Western Europe for more than a thousand years largely because of the Roman Catholic Church. Unlike most ancient pagan philosophers, Galen argued that every organ in the human body was purposefully crafted by a single, divine Creator to perform a specific function—a philosophical view known as teleology. This aligned almost perfectly with Christian theology, which taught that God created human beings in his divine image. Consequently, the Church embraced Galen’s writings as absolute medical dogma. Monks working in monastic scriptoria carefully copied Galen’s texts in Latin, while university faculties in Oxford, Montpellier, and Paris made memorizing his books the sole requirement for a medical degree. Dissection was rarely performed, and when it did occur, the lecturer read aloud from Galen while a barber-surgeon pointed to organs; if the cadaver differed from Galen’s text, the body was declared abnormal or corrupted. Anyone who dared to challenge Galen’s authority was condemned for heresy; in 1277, the Franciscan scholar Roger Bacon was imprisoned by church authorities after insisting that doctors should perform their own empirical experiments rather than passively trusting ancient texts.`;
  }

  // Lesson 3 (lesson_1_3), Block 2: Phlebotomy
  const l3 = lessons.find(l => l.id === 'lesson_1_3');
  if (l3 && l3.narrative_blocks && l3.narrative_blocks[1]) {
    l3.narrative_blocks[1].title = "Phlebotomy: Restoring Balance through Bloodletting";
    l3.narrative_blocks[1].theme_heading = "Phlebotomy: Restoring Balance through Bloodletting";
    l3.narrative_blocks[1].text = `The most widespread and standard rational treatment in medieval medicine was phlebotomy, or bloodletting. Humoral theory dictated that disease frequently arose from an excess or corruption of blood, the primary warm and moist humour. By draining blood, medieval practitioners believed they could restore equilibrium to a feverish or congested patient. Bloodletting took three primary forms: venesection, cupping, and the application of leeches (hirudotherapy). In venesection, a barber-surgeon used a sharp iron lancet or spring-loaded fleam to open a superficial vein, catching the blood in a calibrated pewter bowl. The procedure was carefully calculated: medical books contained detailed "Vein Man" (*Homo Venarum*) illustrations showing which specific vein corresponded to a particular ailing organ (such as opening the ankle vein for liver complaints or the cephalic arm vein for headaches). Furthermore, phlebotomy was strictly synchronized with astrology; physicians consulted Zodiac charts to avoid bleeding a patient when the moon sat in a zodiac sign ruling the affected body part. Monks in monasteries were routinely bled four to six times a year as a preventative measure, followed by days of resting and nourishing broths.`;
  }

  // Lesson 3 (lesson_1_3), Block 5: Regimen Sanitatis & Prevention
  if (l3 && l3.narrative_blocks && l3.narrative_blocks[4]) {
    l3.narrative_blocks[4].title = "Surgical Interventions and Preventative Regimens";
    l3.narrative_blocks[4].theme_heading = "Surgical Interventions and Preventative Regimens";
    l3.narrative_blocks[4].text = `Alongside curative treatments, medieval medicine placed paramount importance on prevention through lifestyle moderation, codified in the *Regimen Sanitatis* (The Rule of Health). Written originally by the prestigious medical school of Salerno, this manual instructed individuals to balance the "six non-naturals": air, food and drink, motion and rest, sleep and waking, excretion and retention, and passions of the soul. Wealthy nobles adhered to strict dietary regimens, avoiding excessive red meat and drinking moderate ale or watered wine. Environmental air quality was deemed crucial; to protect against airborne miasma, households burned aromatic woods like juniper or scattered fresh lavender, sage, and mint across rush-covered floors. Public bathhouses, known as *stewes*, were initially popular in medieval towns for hygiene and opening skin pores to perspiration. However, as the Black Death struck and religious authorities connected public bathing with moral laxity, bathhouses were gradually shut down over fears that steaming water dilated skin pores, allowing plague-bearing miasma to penetrate deeper into the vital organs.`;
  }

  // Lesson 4 (lesson_1_4), Block 3: Barber-Surgeons
  const l4 = lessons.find(l => l.id === 'lesson_1_4');
  if (l4 && l4.narrative_blocks && l4.narrative_blocks[2]) {
    l4.narrative_blocks[2].title = "Barber-Surgeons and Craft Medicine";
    l4.narrative_blocks[2].theme_heading = "Barber-Surgeons and Craft Medicine";
    l4.narrative_blocks[2].text = `For physical injuries, wound treatment, and operative procedures, medieval townspeople relied on barber-surgeons. In sharp contrast to university-educated physicians who considered manual labor beneath their intellectual dignity, barber-surgeons were craftsmen organized into urban trade guilds, such as the London Guild of Barber-Surgeons established in 1308. Because the Catholic Church strictly forbade clergy and scholars from shedding human blood (*ecclesia abhorret a sanguine*), physicians refused to cut tissue, delegating all bloody manual operations to barber-surgeons. Barber-surgeons trained through practical seven-year apprenticeships, learning to handle razors, fleams, probes, and bone saws. They pulled decayed teeth, lanced agonising carbuncles and boils, set broken bones, dressed battle wounds with egg yolks and turpentine, and carried out emergency amputations on gangrenous limbs without anaesthetic or antiseptics. Their surgical trade was advertised by a distinctive striped pole outside their shop: the red spiral representing bloody bandages, the white representing clean linen dressings, and the wooden staff symbolizing the wooden pole grasped tightly by patients during painful bloodletting.`;
  }

  // Lesson 4 (lesson_1_4), Block 5: Domestic Healers & Wise Women
  if (l4 && l4.narrative_blocks && l4.narrative_blocks[4]) {
    l4.narrative_blocks[4].title = "Domestic Healers and Wise Women";
    l4.narrative_blocks[4].theme_heading = "Domestic Healers and Wise Women";
    l4.narrative_blocks[4].text = `The overwhelming majority of England’s medieval population—over 90% who lived as agricultural peasants in rural manors—never had access to university physicians, licensed barber-surgeons, or urban apothecaries. For these ordinary families, medical care was delivered almost entirely within the household by women: mothers, grandmothers, and local village "wise women" (*herb-wives*). Women held responsibility for family nutrition, nursing the bedridden, caring for the elderly, and brewing household remedies. They relied on rich oral traditions and handwritten manuscript recipe books (*leechbooks*) passed down through generations, preparing herbal infusions, syrups, and soothing poultices from kitchen gardens and surrounding hedgerows using sage, garlic, elderberry, mint, and chamomile. Wise women also served as traditional village midwives, attending labors, delivering newborns, and managing postpartum recovery. Although admired for their practical nursing skills and affordable community care, their status remained precarious; if a patient died or a remedy relied too heavily on protective charms and incantations, healers could occasionally face accusations of witchcraft or sorcery from suspicious parish clergy.`;
  }

  // Lesson 5 (lesson_1_5), Block 3: Black Death Explanations
  const l5 = lessons.find(l => l.id === 'lesson_1_5');
  if (l5 && l5.narrative_blocks && l5.narrative_blocks[2]) {
    l5.narrative_blocks[2].title = "Medieval Explanations: Wrath of God and Planetary Alignment";
    l5.narrative_blocks[2].theme_heading = "Medieval Explanations: Wrath of God and Planetary Alignment";
    l5.narrative_blocks[2].text = `Faced with the sudden and horrifying devastation of the Black Death in 1348, medieval society sought explanations through both supernatural and rational frameworks. At the supernatural level, the epidemic was universally understood as the wrath of God (*ira Dei*), sent to punish sinful mankind for greed, blasphemy, and worldliness. In response, King Edward III commanded church leaders to organize daily penitential processions, while bands of religious zealots known as Flagellants traveled through continental towns whipping their bare shoulders with iron-tipped thongs to atone for human sins. At the rational level, scholars looked to medical astrology. In October 1348, King Philip VI of France commissioned the Medical Faculty of Paris to explain the catastrophe; the learned doctors concluded that on 20 March 1345, an extraordinary conjunction of three planets—Saturn, Jupiter, and Mars—in the sign of Aquarius had drawn up poisonous vapours from the sea and earth, corrupting the atmosphere into pestilential miasma. Believing that breathing this foul air poisoned the bodily humours, people carried pomanders filled with ambergris, burned fragrant juniper in public streets, and fled enclosed valleys. In central Europe, terrifying rumours and hysteria also led to brutal anti-Semitic massacres, with mobs falsely accusing Jewish communities of poisoning public water wells.`;
  }

  console.log('✅ Narrative blocks repaired in Lessons 2, 3, 4, 5.');

  // -------------------------------------------------------------------------
  // 2. EXAM PRACTICE PARITY ALIGNMENT ACROSS KT1-KT4
  // -------------------------------------------------------------------------
  console.log('\n▶ Aligning Exam Practice Questions with Printed Workbooks...');

  // Helper to safely replace or inject question 1 and question 2
  function setLessonExamPractice(lessonId, config) {
    const l = lessons.find(les => les.id === lessonId);
    if (!l) {
      console.log(`⚠️ Lesson ${lessonId} not found!`);
      return;
    }

    if (!l.exam_practice) {
      l.exam_practice = {
        title: "Edexcel GCSE (9–1) Paper 1 Section B Practice",
        tariff: "Section B Examination Practice",
        questions: []
      };
    }

    l.exam_practice.questions = [
      {
        tariff: "4 marks",
        type: "similarity_difference_4m",
        question: config.fourMark.question,
        prompt: config.fourMark.hint || "Identify one valid similarity/difference, cite precise historical details from both eras, and conclude with an analytical comparison.",
        model: config.fourMark.model,
        scaffolding: {
          acronym: "P-E-E-C (Point • Evidence 1 • Evidence 2 • Comparison)",
          acronym_title: "4-Mark Comparison Formula",
          steps: [
            { letter: "P", name: "State Comparison", prompt: config.fourMark.stems?.split('&bull;')[0]?.trim() || "State the clear similarity or difference." },
            { letter: "E1", name: "First Period", prompt: config.fourMark.stems?.split('&bull;')[1]?.trim() || "Provide detailed factual evidence from the first named period." },
            { letter: "E2", name: "Second Period", prompt: config.fourMark.stems?.split('&bull;')[2]?.trim() || "Provide detailed factual evidence from the second named period." },
            { letter: "C", name: "Direct Comparison", prompt: "Conclude by explaining precisely why this demonstrates a valid similarity or difference." }
          ]
        }
      },
      {
        tariff: config.essay.tariff,
        type: config.essay.tariff.includes('16') ? "evaluative_essay_16m" : "causal_explanation_12m",
        marks: config.essay.tariff.includes('16') ? 16 : 12,
        question: config.essay.question,
        stimulus: config.essay.stimulus,
        prompt: "Use the stimulus points and your own historical knowledge to structure a balanced, sustained analytical response.",
        model: config.essay.model,
        scaffolding: {
          acronym: config.essay.tariff.includes('16') ? "PEEL + Balanced Evaluation" : "PEEL Causal Structure Strip",
          acronym_title: config.essay.tariff,
          steps: [
            { letter: "P1", name: "Stimulus Point 1", prompt: `Explain the causal significance of ${config.essay.stimulus[0]}.` },
            { letter: "P2", name: "Stimulus Point 2", prompt: `Explain the causal significance of ${config.essay.stimulus[1]}.` },
            { letter: "P3", name: "Own Knowledge Factor", prompt: "Explain an independent factor from your own historical knowledge to secure Level 4." }
          ]
        }
      }
    ];
  }

  // --- KT1 LESSONS ---

  // Lesson 1.2 (Lesson 2)
  setLessonExamPractice('lesson_1_2', {
    fourMark: {
      question: "Explain one way in which ideas about the cause of disease in the Medieval period (c1250–c1500) were different from ideas in the Modern period (c1900–present). [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way ideas differed was that... &bull; In the Medieval period... &bull; In contrast, in the Modern period...",
      model: "One way in which ideas about the cause of disease were different was the shift from **theological and humoural beliefs** to **microbiological and genetic science**. In the Medieval period (c1250–c1500), disease was explained as divine punishment from God or an internal imbalance of the Four Humours (blood, phlegm, yellow bile, black bile), diagnosed through uroscopy charts. In contrast, in the Modern period (c1900–present), medical science understands that diseases are caused by specific microscopic pathogens (bacteria and viruses) discovered through Germ Theory, or inherited DNA mutations identified by the Human Genome Project. Therefore, while medieval explanations were supernatural and bodily-holistic without scientific proof, modern understanding is grounded in verified laboratory microbiology and genetic pathology."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why the Theory of the Four Humours remained the dominant rational explanation of disease throughout the period c1250–c1500. [12 marks]",
      stimulus: ["Galen’s Theory of Opposites", "The diagnostic matula (uroscopy)"],
      model: "One major reason the Theory of the Four Humours remained dominant was because it provided a comprehensive, rational framework for practical diagnosis and treatment, particularly through Galen's Theory of Opposites. Galen developed Hippocrates' idea by arguing that illnesses could be treated with opposite qualities—for instance, treating a cold, phlegmatic chill with hot, dry pepper or wine. This gave physicians an intuitive, practical method to treat sick patients at the bedside, reassuring people that illnesses had logical, physical causes that could be actively managed.<br><br>Furthermore, humoural theory was sustained by diagnostic tools like the matula flask used in uroscopy. Physicians routinely examined the colour, sediment, and even smell of urine against circular urine charts to judge the patient's internal humoural balance. Because changes in urine were directly visible and coincided with physical symptoms, this visible physical evidence convinced both educated physicians and ordinary patients that humoural imbalance was indeed the true scientific reality inside the body.<br><br>Finally, the theory remained unchallenged because of the total intellectual monopoly of the Catholic Church. The Church promoted Galen because he believed in a single Creator who designed every organ for a purpose (teleology). Through monastic scriptoria, church copyists preserved Galenic texts while universities taught his books as unquestioned dogma. Anyone who questioned Galen faced heresy charges, ensuring humoural theory remained entrenched throughout the Middle Ages."
    }
  });

  // Lesson 1.3 (Lesson 3)
  setLessonExamPractice('lesson_1_3', {
    fourMark: {
      question: "Explain one way in which approaches to preventing disease in the Medieval period (c1250–c1500) were similar to approaches in the Renaissance period (c1500–c1700). [4 marks]",
      hint: "Identify 1 valid similarity, then explain with specific historical detail from both named eras.",
      stems: "One way prevention was similar was... &bull; In the Medieval period... &bull; Similarly, in the Renaissance period...",
      model: "One way approaches to prevention were similar was the continued reliance on **clearing corrupt air (miasma) and personal lifestyle regimens**. In the Medieval period, people carried sweet-smelling herbs, pomanders, and followed the *Regimen Sanitatis* to keep their humours balanced and avoid breathing stagnant air. Similarly, during the Renaissance, particularly in the Great Plague of 1665, citizens burned barrels of pitch and aromatic woods in the streets, smoked tobacco, and carried posies to repel toxic miasma. Therefore, both eras operated on the belief that bad smells carried disease, resulting in identical preventative habits centered on aromatic purification."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why bloodletting and purging remained the most common medical treatments throughout the period c1250–c1500. [12 marks]",
      stimulus: ["Phlebotomy (bloodletting by fleam or leeches)", "The Regimen Sanitatis"],
      model: "One main reason bloodletting (phlebotomy) remained widespread was that blood was regarded as the primary and most abundant humour in the body. When patients developed fever or inflammation, physicians diagnosed an excess of blood (*plethora*). Bloodletting using fleams, lancets, or medicinal leeches directly visibly removed blood, which practitioners and patients genuinely believed relieved arterial pressure and restored bodily balance, reinforced by anatomical 'Vein Man' charts.<br><br>Secondly, purging treatments (using emetics, laxatives, and clysters) were deeply entrenched because they directly evacuated perceived toxic humours from the digestive tract. Herbal concoctions like scammony or bitter aloe produced immediate, powerful physical results, giving medieval patients tangible proof that the corrupted bile or phlegm was being purged from their system.<br><br>Finally, these treatments were legitimized by medical tradition and the *Regimen Sanitatis*, which emphasized that maintaining internal balance was the sole defense against mortal illness. Because no alternative understanding of pathology or microbiology existed, and because religious doctrine forbade invasive surgical dissection or questioning ancient authorities, draining excess fluids remained the only logical rational therapy available."
    }
  });

  // Lesson 1.4 (Lesson 4)
  setLessonExamPractice('lesson_1_4', {
    fourMark: {
      question: "Explain one way in which the work of hospitals in the Medieval period (c1250–c1500) was different from hospitals in the nineteenth century. [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way hospital care differed was... &bull; In the Medieval period... &bull; In contrast, in the nineteenth century...",
      model: "One way the work of hospitals was different was the fundamental shift from **religious hospitality and spiritual care** to **clinical medical cure and surgical treatment**. In the Medieval period (c1250–c1500), hospitals like St Bartholomew’s were run by monastic monks and nuns providing 'care not cure'—offering clean bedding, warmth, food, and spiritual prayer while strictly barring contagious patients. In contrast, in the nineteenth century, particularly after Florence Nightingale’s pavilion design and antiseptic surgery, hospitals became specialized medical centers staffed by trained doctors and nurses aimed specifically at curing disease, performing sterile surgery, and rehabilitating the sick. Therefore, while medieval hospitals functioned as religious hospices for spiritual comfort, nineteenth-century hospitals were scientific institutions dedicated to physical cure."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why hospital care in medieval England was based on the concept of ‘care rather than cure’ in the period c1250–c1500. [12 marks]",
      stimulus: ["Monastic rules and religious charity", "The exclusion of infectious diseases (lepers and plague victims)"],
      model: "One major reason medieval hospital care was based on 'care not cure' was that hospitals were founded, funded, and managed by religious monastic orders whose primary mission was spiritual salvation. Monks and nuns viewed illness as an opportunity to perform Christian charity and save souls through prayer. Patients were given warm beds, nourishing food, and daily attendance at church services rather than active medical treatments, because curing disease was seen as resting entirely in God's divine hands.<br><br>Furthermore, hospitals strictly excluded infectious or terminal cases, reinforcing their role as places of peaceful refuge rather than medical intervention. People suffering from leprosy, the Black Death, or chronic incurable afflictions were turned away or relegated to isolated Lazar houses outside city walls. By sheltering only the elderly, weary pilgrims, and mildly sick, hospitals remained quiet hospices where spiritual comfort took precedence over clinical treatment.<br><br>Finally, hospitals lacked resident medical staff with curative knowledge. University-educated physicians were far too expensive and rare to be employed in charitable hospitals; instead, the physical nursing was handled by nuns who had no surgical or pharmacological training beyond basic herbal teas and soothing poultices. Without the scientific tools or medical personnel to cure disease, hospitality was the only service hospitals could realistically provide."
    }
  });

  // Lesson 1.5 (Lesson 5)
  setLessonExamPractice('lesson_1_5', {
    fourMark: {
      question: "Explain one way in which responses to the Black Death (1348–49) were similar to responses to the Great Plague of London (1665). [4 marks]",
      hint: "Identify 1 valid similarity, then explain with specific historical detail from both named eras.",
      stems: "One way responses were similar was... &bull; During the Black Death... &bull; Similarly, during the Great Plague of 1665...",
      model: "One way responses were similar was the widespread reliance on **quarantine, flight, and air purification to ward off miasma**. During the Black Death of 1348–49, wealthy landowners fled towns to country estates, town councils attempted quarantine, and people carried sweet-smelling herbs and lit fires in streets. Similarly, during the 1665 Great Plague, the wealthy fled London, infected houses were locked up with red crosses painted on doors, and barrels of pitch were burned constantly in city alleys to dispel foul air. Therefore, in both centuries, panic provoked identical reactions of communal isolation and olfactory defense against deadly airborne vapors."
    },
    essay: {
      tariff: "16+4 marks",
      question: "‘The main reason why so many people died during the Black Death (1348–49) was because governments had no effective way of preventing disease.’ How far do you agree? Explain your answer. [16 marks + 4 marks SPaG]",
      stimulus: ["King Edward III’s cleanliness order (1349)", "Belief in miasma and supernatural causes"],
      model: "There is strong justification to agree that governmental inability to enforce public health prevention caused catastrophic mortality. In 1349, King Edward III issued an order to the Mayor of London instructing that human filth and animal waste be cleared from streets because the stench was causing sickness. However, medieval town corporations lacked public health officers, police, or sanitation infrastructure to enforce these measures. With overflowing cesspits, narrow streets, and contaminated water supplies, the bacterium had ideal conditions to spread unhindered across overcrowded urban centers.<br><br>However, an equally decisive reason was the prevailing supernatural and miasmatic belief systems which misdirected all preventative efforts. Because authorities believed the epidemic was caused by divine punishment or corrupted astrological air, responses focused on religious processions, church bells, and burning aromatic woods rather than controlling rats or fleas. Religious gatherings in churches actually concentrated healthy and infected people together, dramatically accelerating contagion.<br><br>Furthermore, lack of medical knowledge was fatal. Medieval physicians had no concept of bacteria or flea vectors; treatments like bleeding buboes merely accelerated patient death from shock and blood loss.<br><br>In conclusion, while governmental weakness was critical, the ultimate cause of extreme mortality was total medical ignorance. Even if medieval governments had possessed full political authority, their preventative actions would still have failed because they were targeting bad smells and sinful behaviour rather than *Yersinia pestis*."
    }
  });

  // --- KT2 LESSONS ---

  // Lesson 2.1 (Lesson 6)
  setLessonExamPractice('lesson_2_1', {
    fourMark: {
      question: "Explain one way in which ideas about the cause of disease in the Renaissance (c1500–c1700) were similar to ideas in the Medieval period (c1250–c1500). [4 marks]",
      hint: "Identify 1 valid similarity, then explain with specific historical detail from both named eras.",
      stems: "One way ideas were similar was... &bull; In the Medieval period... &bull; Similarly, in the Renaissance...",
      model: "One way ideas about the cause of disease were similar was the continued belief in **miasma and humoural imbalance**. In the Medieval period, bad smells and corrupted air were seen as primary causes of pestilence, alongside an imbalance of the Four Humours. Similarly, in the Renaissance, despite anatomical discoveries, the vast majority of physicians and the public still believed that disease was caused by breathing foul, toxic air (*miasma*) generated by decaying matter and stagnant marshes. Therefore, both periods shared a fundamental continuity in believing that environmental stench directly upset bodily health."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why new ideas in medicine were able to spread more rapidly in the period c1500–c1700. [12 marks]",
      stimulus: ["The invention of the printing press (c1440)", "The Royal Society (1660)"],
      model: "One major reason new medical ideas spread rapidly was Johannes Gutenberg's invention of the movable-type printing press around 1440. Prior to printing, medical books had to be copied by hand in monastic scriptoria, making them extraordinarily rare, expensive, and subject to church censorship. The printing press allowed anatomical texts like Andreas Vesalius's *De Humani Corporis Fabrica* (1543) to be mass-produced with precise, identical anatomical woodcut illustrations and translated into vernacular languages, allowing students and physicians across Europe to study identical anatomical findings simultaneously.<br><br>Furthermore, the establishment of scientific institutions, notably the Royal Society in London in 1660, created an official network for rapid academic dissemination. Supported by King Charles II, the Royal Society published Europe’s first scientific journal, *Philosophical Transactions*, which published empirical experiments, letters, and microscopic observations from scientists across the continent, directly fostering a culture of peer review and debate.<br><br>Finally, the growing spirit of Renaissance humanism and decline in Church control over intellectual life encouraged scholars to circulate empirical findings without fear of immediate heresy imprisonment. Scientists like William Harvey could travel across European universities and demonstrate their discoveries on live animals, cementing international collaboration."
    }
  });

  // Lesson 2.2 (Lesson 7)
  setLessonExamPractice('lesson_2_2', {
    fourMark: {
      question: "Explain one way in which ideas about the treatment of disease in the Renaissance (c1500–c1700) were different from the Medieval period (c1250–c1500). [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way treatments differed was... &bull; In the Medieval period... &bull; In contrast, in the Renaissance...",
      model: "One way ideas about treatment were different was the introduction of **chemical remedies and specific disease-targeted treatments (iatrochemistry)** alongside traditional herbal concoctions. In the Medieval period (c1250–c1500), treatments focused exclusively on humoral balancing through herbal electuaries, bleeding, and purging based on Galen. In contrast, in the Renaissance (c1500–c1700), pioneers like Paracelsus introduced mineral and chemical compounds (such as antimony, mercury, and salts), while Thomas Sydenham popularized specific imported treatments like Peruvian cinchona bark for malaria. Therefore, Renaissance medicine began treating diseases as distinct, external entities requiring specific chemical medicines, moving away from purely humoural manipulation."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why Thomas Sydenham was an important figure in the development of medicine in the seventeenth century. [12 marks]",
      stimulus: ["Observationes Medicae (1676)", "Treatments for smallpox and malaria (cinchona bark)"],
      model: "One main reason Thomas Sydenham was significant was his revolutionary approach of bedside observation and clinical classification, published in his masterpiece *Observationes Medicae* (1676). Rather than matching patient symptoms to ancient Galenic texts, Sydenham closely observed patients at the bedside and recorded symptoms meticulously, arguing that diseases could be classified into distinct species just like plants and botanicals. This shifted medical diagnosis from theoretical speculation to practical clinical observation.<br><br>Secondly, Sydenham pioneered pragmatic, rational treatments that rejected aggressive traditional interventions. For smallpox, while other physicians bundled feverish patients under heavy woollen blankets in heated rooms, Sydenham advocated fresh air, light coverings, and cool drinks, dramatically reducing patient mortality. Furthermore, he popularized the use of cinchona bark (quinine) from South America to treat malaria, demonstrating that specific remedies could cure specific diseases regardless of humoural balance.<br><br>Finally, Sydenham earned the title 'the English Hippocrates' because he inspired subsequent generations of doctors to prioritize the empirical study of epidemics and clinical pathology. His emphasis on practical experience laid the foundation for modern evidence-based clinical medicine."
    }
  });

  // Lesson 2.3 (Lesson 8)
  setLessonExamPractice('lesson_2_3', {
    fourMark: {
      question: "Explain one way in which methods of anatomical training in the Renaissance (c1500–c1700) were similar to anatomical training in the nineteenth century. [4 marks]",
      hint: "Identify 1 valid similarity, then explain with specific historical detail from both named eras.",
      stems: "One way training was similar was... &bull; In the Renaissance... &bull; Similarly, in the nineteenth century...",
      model: "One way anatomical training was similar was the central practice of **hands-on human dissection by medical students and surgeons**. In the Renaissance, following the pioneering example of Andreas Vesalius at Padua, medical professors and students performed dissections with their own hands on cadavers to learn human structure. Similarly, in the nineteenth century, medical schools in Edinburgh and London mandated practical dissecting theatre training for all surgical candidates to master muscular and vascular anatomy. Therefore, in both eras, direct empirical knife work on real bodies was recognized as the indispensable foundation of medical competence."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why Andreas Vesalius made significant breakthroughs in the understanding of human anatomy in the sixteenth century. [12 marks]",
      stimulus: ["The fabric of the human body (De Humani Corporis Fabrica, 1543)", "Dissections carried out by Vesalius himself"],
      model: "One major reason Vesalius made groundbreaking discoveries was his insistence on carrying out dissections personally. In medieval universities, professors sat high in a chair (*cathedra*) reading Galen while barber-surgeons dissected. Vesalius broke with this tradition at Padua, descending to the dissecting table to dissect human corpses with his own hands, allowing him to discover over 300 anatomical errors in Galen’s work, such as proving the human jaw was one bone, not two, and that the septum had no invisible pores.<br><br>Furthermore, Vesalius realized that Galen had based his anatomy on animal dissections (apes, pigs, and dogs) because Roman law forbade human dissection. By dissecting executed criminals, Vesalius proved that animal anatomy differed significantly from human anatomy, shattering the myth that ancient texts were infallible.<br><br>Finally, Vesalius maximized his impact by publishing *De Humani Corporis Fabrica* in 1543, featuring extraordinarily detailed, accurate woodcut illustrations produced by artists from Titian's workshop in Venice. The printing press allowed this masterpiece to spread across Europe, providing medical schools with the first accurate atlas of human anatomy and permanently establishing dissection as the core of surgical education."
    }
  });

  // Lesson 2.4 (Lesson 9)
  setLessonExamPractice('lesson_2_4', {
    fourMark: {
      question: "Explain one way in which ideas about the human body in the Renaissance (c1500–c1700) were different from the Medieval period (c1250–c1500). [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way ideas differed was... &bull; In the Medieval period... &bull; In contrast, in the Renaissance...",
      model: "One way ideas about the human body were different was the shift from **viewing blood as consumable fuel produced by the liver** to **understanding blood as circulating continuously through a mechanical pump**. In the Medieval period, based on Galen, doctors believed the liver continuously manufactured new blood from digested food, which burned away in organs like fuel. In contrast, in the Renaissance, William Harvey proved in 1628 that the heart acts as a muscular pump pushing blood in a closed, one-way circulatory loop through arteries and back via veins with valves. Therefore, Renaissance thinkers replaced ancient biological metaphors with mechanical, hydraulic understanding of bodily physiology."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why William Harvey’s discovery of the circulation of the blood was a major breakthrough in medicine in the seventeenth century. [12 marks]",
      stimulus: ["An Anatomical Account of the Motion of the Heart and Blood (1628)", "Experiments on live cold-blooded animals and human veins"],
      model: "One main reason William Harvey's discovery was a major breakthrough was his use of rigorous empirical and mathematical experimentation. By calculating that the heart pumped three times the body's entire weight in blood every hour, Harvey proved mathematically that the liver could not possibly manufacture such vast quantities of blood from food, disproving Galen's 1400-year-old dogma that blood was consumed like fuel.<br><br>Furthermore, Harvey conducted groundbreaking mechanical experiments on live cold-blooded animals and human volunteers. Using tight ligatures on human arms, he proved that veins allowed blood to flow only back towards the heart, using his fingertip to show that internal vein valves prevented backwards flow. His 1628 book *De Motu Cordis* provided conclusive mechanical evidence that the heart functioned as a muscular pump driving continuous one-way circulation.<br><br>Finally, Harvey’s breakthrough established the modern scientific method in physiology, demonstrating that biological systems could be measured and verified experimentally. While his work did not yield immediate cures, it laid the essential physiological groundwork for modern cardiology, intravenous injections, and blood transfusions."
    }
  });

  // Lesson 2.5 (Lesson 10)
  setLessonExamPractice('lesson_2_5', {
    fourMark: {
      question: "Explain one way in which government responses to the Great Plague of London (1665) were different from government responses to the Black Death (1348). [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way government responses differed was... &bull; During the Black Death... &bull; In contrast, during the Great Plague of 1665...",
      model: "One way government responses were different was the enforcement of **systematic municipal quarantine orders and organized public burial regulations**. In 1348 during the Black Death, the royal government took virtually no organized municipal action beyond King Edward III asking the Mayor to clean streets after the epidemic was already rampant. In contrast, in 1665, the Mayor and Aldermen of London strictly enforced Plague Orders: infected houses were locked for 28 days with red crosses and 'Lord have mercy upon us' painted on doors, guarded by watchmen, while parish searchers and mass dead-carts operated under civic regulation. Therefore, 1665 witnessed a far more organized, bureaucratic, and authoritarian municipal intervention than the chaotic medieval response."
    },
    essay: {
      tariff: "16+4 marks",
      question: "‘Approaches to dealing with the Great Plague in 1665 were completely different from approaches to the Black Death in 1348.’ How far do you agree? Explain your answer. [16 marks + 4 marks SPaG]",
      stimulus: ["The shutting up of infected houses", "The continuation of bloodletting and herbal remedies"],
      model: "On the one hand, there is strong evidence to agree that civic approaches in 1665 were significantly more organized and legislative than in 1348. The Mayor and Aldermen of London enforced strict Plague Orders, mandating the locking up of infected families inside their homes for 28 days with watchmen posted outside. Furthermore, public gatherings were banned, theaters were closed, cats and dogs were systematically culled (over 40,000 dogs slaughtered), and parish searchers certified causes of death in weekly Bills of Mortality. These coordinated municipal quarantine measures were far more structured than the informal medieval responses.<br><br>However, on the other hand, there was profound and overwhelming continuity in medical treatment and underlying theoretical beliefs. In 1665, just as in 1348, doctors still had no scientific understanding of bacteria or flea transmission. Physicians still attributed the epidemic to miasma and divine anger. Preventative methods remained almost identical: people burned pitch and frankincense in streets, carried posies and pomanders, and chewed tobacco to ward off bad air. Treatments continued to rely on traditional humoral bleeding, purging, and drawing poultices onto buboes.<br><br>In conclusion, while municipal administrative quarantine showed meaningful progress and bureaucratic sophistication in 1665, therapeutic medicine and scientific understanding showed almost total continuity with 1348. Because doctors still could not cure or comprehend the disease, the core medical experience remained largely unchanged."
    }
  });

  // --- KT3 LESSONS ---

  // Lesson 3.1 (Lesson 11)
  setLessonExamPractice('lesson_3_1', {
    fourMark: {
      question: "Explain one way in which ideas about the cause of disease in the late nineteenth century (c1860–c1890) were different from ideas in the Renaissance (c1500–c1700). [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way ideas differed was... &bull; In the Renaissance... &bull; In contrast, in the late nineteenth century...",
      model: "One way ideas were different was the transition from **believing in airborne miasma and humoural imbalance** to **identifying specific microscopic bacterial pathogens**. In the Renaissance (c1500–c1700), doctors explained epidemics through miasma and corrupt air generated by rotting organic waste. In contrast, in the late nineteenth century (c1860–c1890), Louis Pasteur’s Germ Theory (1861) and Robert Koch’s bacteriological methods proved that distinct microbes caused specific diseases, such as Koch identifying the bacteria for anthrax (1876), tuberculosis (1882), and cholera (1883). Therefore, Renaissance vague environmental theories were replaced by precise, laboratory-proven bacteriology."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why there was rapid progress in understanding the causes of disease in the period c1860–c1890. [12 marks]",
      stimulus: ["Louis Pasteur's Germ Theory (1861)", "Robert Koch's work on bacteria"],
      model: "One major reason for rapid progress was Louis Pasteur's development of Germ Theory in 1861. By investigating why French beer and wine turned sour, Pasteur proved that microorganisms in the air caused fermentation and decay, disproving the long-held doctrine of spontaneous generation. Using his famous swan-neck flask experiments, Pasteur proved that germs did not appear spontaneously from rotting matter but were living organisms carried in the air, creating the foundational theoretical breakthrough for all modern infectious disease pathology.<br><br>Furthermore, Robert Koch transformed Pasteur's theory into practical clinical science by developing innovative laboratory techniques to isolate specific microbes. Koch introduced solid agar jelly in Petri dishes to culture pure bacterial colonies, utilized chemical methyl violet dyes to stain bacteria so they became visible under microscopes, and pioneered microphotography. Using Koch's Postulates, he isolated the specific bacterial causes of anthrax (1876), tuberculosis (1882), and cholera (1883), proving definitively that each disease had a unique bacterial culprit.<br><br>Finally, intense national rivalry between France and Germany during the Franco-Prussian War accelerated progress, as both governments invested heavily in research teams led by Pasteur and Koch. Combined with improvements in industrial achromatic microscopes, this scientific race dramatically expedited bacteriological breakthroughs in the late nineteenth century."
    }
  });

  // Lesson 3.2 (Lesson 12)
  setLessonExamPractice('lesson_3_2', {
    fourMark: {
      question: "Explain one way in which methods of preventing smallpox in the late eighteenth century were different from methods used in the seventeenth century. [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way methods differed was... &bull; In the seventeenth century... &bull; In contrast, in the late eighteenth century...",
      model: "One way methods of preventing smallpox were different was the shift from **purely preventative isolation and herbal amulets** to **active biological immunization through inoculation and vaccination**. In the seventeenth century, people had no proactive medical prevention; they fled infected towns, locked up sufferers, and took herbal remedies. In contrast, in the late eighteenth century, Lady Mary Wortley Montagu popularized inoculation (introducing mild smallpox matter), followed by Edward Jenner's revolutionary discovery in 1796 of vaccination using safer cowpox matter. Therefore, late eighteenth-century prevention became active, clinical, and immunologically protective rather than passive and fearful."
    },
    essay: {
      tariff: "16+4 marks",
      question: "‘Edward Jenner’s development of the smallpox vaccine was the most significant breakthrough in the prevention of disease in the period c1700–c1900.’ How far do you agree? [16+4 marks]",
      stimulus: ["Inoculation (Lady Mary Wortley Montagu)", "The 1853 Compulsory Vaccination Act"],
      model: "There is strong justification to agree that Edward Jenner’s development of vaccination in 1796 was the most significant preventative breakthrough because it was the first scientific method to safely eradicate a deadly epidemic disease. Prior to Jenner, smallpox killed hundreds of thousands across Europe. Inoculation carried severe risks of triggering full-scale smallpox and starting new epidemics. Jenner proved empirically that inoculating young James Phipps with benign cowpox matter conferred complete immunity against smallpox without risk of death or contagion. Its significance was confirmed when Parliament funded Jenner with £30,000 and later passed the 1853 Compulsory Vaccination Act, leading to a dramatic collapse in British smallpox fatalities.<br><br>However, it can also be argued that Louis Pasteur's development of artificial vaccines in the 1880s was more significant. Jenner had no scientific understanding of *why* cowpox worked, and his discovery could not be replicated for other illnesses. In contrast, Pasteur used Germ Theory to deliberately create weakened (attenuated) bacterial vaccines for chicken cholera (1879), anthrax (1881), and rabies (1885), establishing a universal method to immunize against multiple diseases.<br><br>Furthermore, Edwin Chadwick and John Snow's public health interventions, culminating in the 1875 Public Health Act, prevented waterborne diseases like cholera and typhoid on an immense national scale through clean piped water and sewerage systems.<br><br>In conclusion, while Jenner was the pioneer who proved immunization was possible and saved millions from smallpox, Pasteur's work was ultimately more significant because it provided the universal microbiological mechanism that allowed vaccines to be engineered against dozens of lethal infectious diseases."
    }
  });

  // Lesson 3.3 (Lesson 13)
  setLessonExamPractice('lesson_3_3', {
    fourMark: {
      question: "Explain one way in which hospital care in the late nineteenth century was different from hospital care in the Medieval period. [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way hospital care differed was... &bull; In the Medieval period... &bull; In contrast, in the late nineteenth century...",
      model: "One way hospital care was different was the transformation from **monastic religious refuge providing 'care not cure'** into **hygienic, specialized clinical institutions staffed by professional nurses**. In the Medieval period, hospitals were run by monks and nuns offering basic hospitality, warmth, and prayer while turning away contagious patients. In contrast, in the late nineteenth century, transformed by Florence Nightingale's pavilion architecture and the Nightingale Training School at St Thomas's Hospital, hospitals featured cross-ventilation, separate wards, sanitized bedding, and professional antiseptic operating theaters dedicated to curing patients. Therefore, medieval spiritual care was replaced by scientific clinical recovery."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why the standard of hospital care and nursing improved so significantly in the second half of the nineteenth century. [12 marks]",
      stimulus: ["Florence Nightingale’s Notes on Nursing (1859)", "The pavilion plan hospital design"],
      model: "One major reason hospital standards improved dramatically was the work of Florence Nightingale during and after the Crimean War (1854–56). At Scutari, Nightingale implemented rigorous sanitation, clean dressings, nutritious food, and unblocked drains, reducing death rates from over 40% to 2%. Upon returning to Britain, she published *Notes on Hospitals* and *Notes on Nursing* (1859), turning nursing from a low-status, drunken occupation into a respected, disciplined profession. The establishment of the Nightingale Training School at St Thomas’ Hospital in 1860 produced cohorts of highly trained matrons who enforced strict hygiene standards in hospitals nationwide.<br><br>Furthermore, architectural reform transformed hospital environments through the pavilion plan. Traditional hospitals were cramped, unventilated buildings where infections spread rapidly from ward to ward. The pavilion plan, advocated by Nightingale, introduced separate ward blocks with high ceilings, spacious layouts, polished wipeable walls, and large opposing windows to maximize cross-ventilation and sunlight, dramatically reducing the spread of hospital infections.<br><br>Finally, the acceptance of Pasteur's Germ Theory and Joseph Lister's antiseptic techniques in the 1870s revolutionized surgical wards. Hospital doctors replaced dirty frock coats with clean white gowns, sterilized instruments, and disinfected bedding with carbolic acid, transforming hospitals from terrifying places of fatal infection into safe environments for medical recovery."
    }
  });

  // Lesson 3.4 (Lesson 14 - USER SCREENSHOT FIX!)
  setLessonExamPractice('lesson_3_4', {
    fourMark: {
      question: "Explain one way in which surgical operations in the early nineteenth century (before 1846) were similar to surgery in the Medieval period. [4 marks]",
      hint: "Identify 1 valid similarity, then explain with specific historical detail from both named eras.",
      stems: "One way surgical operations were similar was... &bull; In the Medieval period... &bull; Similarly, in the early nineteenth century before 1846...",
      model: "One way in which surgical operations were similar was that both periods **relied on extreme physical speed and restraint** because neither had effective chemical anaesthetics to prevent surgical shock and pain. In the Medieval period, barber-surgeons had to perform rapid amputations and wound cauterisation while assistants physically pinned screaming patients down with leather straps, often resulting in death from traumatic shock. Similarly, in the early nineteenth century before 1846, renowned surgeons like Robert Liston had to amputate limbs in under thirty seconds while burly orderlies held the conscious patient down on the wooden operating table. Therefore, in both the Medieval era and the early nineteenth century, surgery was an agonizing ordeal where surgical skill was measured almost entirely by knife speed to prevent the patient dying of pain and shock."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why surgery became significantly safer in the period c1840–c1900. [12 marks]",
      stimulus: ["James Simpson's discovery of chloroform (1847)", "Joseph Lister's use of carbolic acid (1865)"],
      model: "One decisive reason surgery became safer was the conquest of pain through effective chemical anaesthetics, pioneered by James Simpson in 1847. Prior to anaesthesia, operations were rushed butcheries where patients frequently died from traumatic shock. Simpson discovered that inhaling chloroform vapor rendered patients completely unconscious and muscle-relaxed. Although early dosage issues caused fatal overdoses (such as Hannah Greener in 1848), John Snow’s chloroform inhaler in 1853 regulated dosage safely, and Queen Victoria’s use of chloroform during childbirth in 1853 popularized it. Anaesthesia allowed surgeons to take their time, operating with anatomical precision rather than rushing.<br><br>Furthermore, Joseph Lister solved the deadly problem of surgical sepsis in 1865 by introducing carbolic acid. Reading Pasteur's Germ Theory, Lister realized that gangrene and sepsis were caused by airborne microbes entering open wounds. By spraying carbolic acid over operating tables, soaking bandages, and washing instruments in antiseptic solution, Lister reduced his surgical ward mortality from 46% to 15% within three years.<br><br>Finally, surgery advanced from antiseptic to modern aseptic surgery by the 1890s. Rather than just killing germs with harsh chemicals, surgeons created completely sterile environments using steam autoclaves to sterilize instruments, wearing sterilized rubber gloves, wearing surgical gowns and masks, and scrubbing hands, virtually eliminating postoperative infection."
    }
  });

  // Lesson 3.5 (Lesson 15)
  setLessonExamPractice('lesson_3_5', {
    fourMark: {
      question: "Explain one way in which government action on public health in the late nineteenth century was different from government action in the Renaissance. [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way government action differed was... &bull; In the Renaissance period... &bull; In contrast, under the 1875 Public Health Act...",
      model: "One way government action was different was the transition from **temporary, emergency crisis management** to **permanent, compulsory national sanitation legislation**. In the Renaissance period (c1500–c1700), government intervention occurred only during deadly epidemics like the 1665 Great Plague, where temporary plague orders locked up infected households without addressing underlying sanitation. In contrast, in the late nineteenth century, Parliament abandoned *laissez-faire* and passed the compulsory 1875 Public Health Act, forcing local town councils to appoint medical officers of health, construct sewers, supply clean piped water, collect rubbish, and regulate building quality. Therefore, late nineteenth-century action was proactive, structural, and permanently preventative rather than reactive and fleeting."
    },
    essay: {
      tariff: "16+4 marks",
      question: "‘The work of John Snow was the main reason for improvements in public health in the nineteenth century.’ How far do you agree? [16+4 marks]",
      stimulus: ["Edwin Chadwick’s 1842 Report", "The Public Health Act (1875)"],
      model: "There is strong evidence to agree that Dr John Snow made a groundbreaking contribution to public health during the 1854 Soho cholera outbreak. By meticulously mapping cholera deaths around Broad Street and removing the handle from the infected water pump, Snow proved that cholera was not an airborne miasma but a waterborne infection spread through sewage-contaminated drinking water. His scientific epidemiological mapping provided the conclusive empirical evidence needed to convince authorities that providing clean drinking water was essential to saving lives.<br><br>However, Edwin Chadwick played an equally decisive role in initiating public health reform. His 1842 *Report on the Sanitary Conditions of the Labouring Population* shocked Britain by proving statistically that poor living conditions, foul cesspits, and damp housing caused premature death among the working class. Chadwick argued that improving public health would reduce poverty and poor rates, directly inspiring the 1848 Public Health Act and the construction of Joseph Bazalgette’s massive London sewer network.<br><br>Furthermore, political developments were critical in turning theory into reality. The 1867 Reform Act gave working-class urban men the vote, compelling politicians to campaign on public health promises. This culminated in Benjamin Disraeli’s government passing the landmark 1875 Public Health Act, which made sanitation, clean water, and building inspections legally compulsory nationwide.<br><br>In conclusion, while John Snow provided the critical scientific proof that cholera was waterborne, he was not the sole or main reason for progress. Improvements required Chadwick’s social research, Bazalgette’s civil engineering, and above all the 1875 Public Health Act to force reluctant councils to finance nationwide sanitary reform."
    }
  });

  // --- KT4 LESSONS ---

  // Lesson 4.1 (Lesson 16)
  setLessonExamPractice('lesson_4_1', {
    fourMark: {
      question: "Explain one way in which scientific methods for investigating disease causes in the late twentieth century (c1950–c2000) were different from methods used in the late nineteenth century (c1870–c1900). [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way methods differed was... &bull; In the late nineteenth century... &bull; In contrast, by the late twentieth century...",
      model: "One way methods were different was the transition from **culturing cellular bacteria on laboratory agar jelly** to **mapping sub-cellular molecular genetics and DNA**. In the late nineteenth century, Robert Koch and Louis Pasteur investigated diseases by culturing bacteria in Petri dishes, applying chemical stains, and examining microbes through optical light microscopes. In contrast, in the late twentieth century, scientists utilized advanced technologies like electron microscopes, X-ray crystallography (such as Rosalind Franklin’s Photograph 51 in 1952), and supercomputers during the Human Genome Project (1990–2003) to sequence genetic code. Therefore, twentieth-century pathology moved beyond physical microbiology into molecular genetics and hereditary biochemistry."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why there was rapid progress in understanding the causes of disease in the period c1950 to the present. [12 marks]",
      stimulus: ["Rosalind Franklin's Photograph 51 (1952)", "The Human Genome Project (1990–2003)"],
      model: "One major reason for rapid progress was the groundbreaking discovery of the structure of DNA in 1953. Working at King's College London, Rosalind Franklin used X-ray crystallography to produce 'Photograph 51', which revealed the double-helix structure of DNA. Using this data, James Watson and Francis Crick at Cambridge constructed the first accurate molecular model of DNA. Understanding how genetic information was stored and replicated allowed medical researchers to identify how faulty inherited genes directly caused hereditary conditions like cystic fibrosis and Down's syndrome.<br><br>Furthermore, the Human Genome Project (1990–2003) revolutionized disease understanding by mapping every single gene in the human body. Supported by international government funding and supercomputing technology, this collaborative effort decoded three billion DNA base pairs. This enabled doctors to identify specific genetic predispositions to diseases such as breast cancer (BRCA1/BRCA2 genes), shifting medicine towards predictive genetic screening.<br><br>Finally, technological innovations in diagnostic imaging and lifestyle epidemiology accelerated understanding of chronic non-infectious diseases. In 1950, Richard Doll and Austin Bradford Hill published definitive statistical research proving the causal link between cigarette smoking and lung cancer, while modern electron microscopes enabled scientists to photograph viruses that had previously been invisible."
    }
  });

  // Lesson 4.2 (Lesson 17)
  setLessonExamPractice('lesson_4_2', {
    fourMark: {
      question: "Explain one way in which methods of diagnosing illness in the late twentieth century (c1970–present) were different from methods used in the nineteenth century (c1800–c1900). [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way diagnosis differed was... &bull; In the nineteenth century... &bull; In contrast, by the late twentieth century...",
      model: "One way diagnosis was different was the reliance on **high-tech internal scanning and automated biochemical analysis** rather than simple physical examination. In the nineteenth century, doctors diagnosed illnesses using basic physical tools like René Laennec's wooden stethoscope, pulse watches, and clinical thermometers, relying on superficial observations. In contrast, in the late twentieth century, physicians utilized advanced non-invasive digital imaging like CT scans (invented by Godfrey Hounsfield in 1972), MRI scanners, ultrasound, and automated blood analyzers to inspect deep internal organs and cellular chemistry without exploratory surgery. Therefore, modern diagnosis became precise, visual, and molecular."
    },
    essay: {
      tariff: "16+4 marks",
      question: "‘Technological innovations in medical diagnosis were more important than public health lifestyle campaigns in improving health in Britain c1900–present.’ How far do you agree? [16+4 marks]",
      stimulus: ["Wilhelm Röntgen’s X-rays (1895)", "The 2007 smoking ban in public places"],
      model: "There is strong justification to agree that technological innovations in medical diagnosis revolutionized healthcare by enabling early, non-invasive detection of fatal illnesses. Wilhelm Röntgen’s discovery of X-rays in 1895 allowed doctors to view bone fractures and lung damage without cutting into the patient. In the late twentieth century, diagnostic technology advanced rapidly with the introduction of CT scans (1972) and MRI scans (1970s), allowing three-dimensional imaging of soft brain tissue and internal tumours. Combined with endoscopes, blood glucose monitors, and genetic testing, these technologies enabled doctors to catch cancer and heart disease early, saving millions of lives.<br><br>However, public health lifestyle campaigns have arguably had a broader, preventative impact across the entire population. As infectious diseases receded, chronic lifestyle conditions like heart disease, lung cancer, and obesity became Britain's primary killers. Government campaigns—such as banning cigarette advertising on television (1965), pictorial cigarette packet warnings, the 2007 smoking ban in enclosed public places, drink-driving laws, and the 'Change4Life' anti-obesity campaign—have prevented millions of citizens from falling ill in the first place.<br><br>Furthermore, the establishment of the National Health Service in 1948 ensured that both diagnostic technologies and preventative treatments were accessible to all citizens regardless of wealth.<br><br>In conclusion, while diagnostic imaging has saved countless individuals through early clinical detection, public health lifestyle campaigns have been more important for overall population health because prevention reduces the burden of disease across society before hospital intervention is ever required."
    }
  });

  // Lesson 4.3 (Lesson 18)
  setLessonExamPractice('lesson_4_3', {
    fourMark: {
      question: "Explain one way in which healthcare access in Britain after 1948 was different from healthcare access in the 1930s. [4 marks]",
      hint: "Identify 1 valid difference, then explain with specific historical detail from both named eras.",
      stems: "One way healthcare access differed was... &bull; In the 1930s... &bull; In contrast, after 1948...",
      model: "One way healthcare access was different was the introduction of **universal, free healthcare funded through taxation** rather than reliance on private insurance, charity, or personal wealth. In the 1930s, although working men had basic insurance under the 1911 National Insurance Act, women, children, and the elderly were uninsured; seeing a GP or entering a voluntary hospital required payment or humiliating means-tested charity. In contrast, after the launch of the National Health Service on 5 July 1948 by Aneurin Bevan, healthcare became completely free at the point of delivery for all 48 million British citizens, providing universal access to doctors, surgeons, prescriptions, glasses, and hospital care. Therefore, post-1948 healthcare became a fundamental civil right rather than a privilege determined by income."
    },
    essay: {
      tariff: "16+4 marks",
      question: "‘The establishment of the National Health Service in 1948 was the most significant turning point in medical care in the period c1900–present.’ How far do you agree? [16+4 marks]",
      stimulus: ["The National Health Service (1948)", "The discovery of Salvarsan 606 (1909)"],
      model: "There is strong justification to agree that the establishment of the National Health Service in 1948 was the most significant turning point in medical care because it transformed access to treatment from a financial privilege into a universal human right. Before 1948, millions of working-class women and children had no health insurance and avoided visiting a GP out of fear of medical debt. Minister of Health Aneurin Bevan nationalised hospitals and made consultations, operations, prescriptions, and dental care free at the point of clinical need. Within its first year, the NHS issued millions of free spectacles and prescriptions, radically reducing infant mortality and transforming national well-being.<br><br>However, others argue that the pharmaceutical revolution of 'magic bullets' and antibiotics was more significant because having free access to hospitals is useless without effective cures. In 1909, Paul Ehrlich's team discovered Salvarsan 606, the first synthetic chemical drug to target a specific disease (syphilis) without killing the patient. In 1932, Gerhard Domagk discovered Prontosil, the first sulphonamide drug to cure blood poisoning. Above all, Alexander Fleming’s 1928 discovery of penicillin and its mass production by Howard Florey and Ernst Chain in the 1940s provided the world's first true antibiotic, saving tens of millions from fatal bacterial infections.<br><br>Furthermore, modern high-tech surgical procedures—like Christiaan Barnard’s 1967 heart transplant, keyhole surgery, and robotic operations—revolutionized survival rates for complex conditions.<br><br>In conclusion, while the development of magic bullets and antibiotics provided the revolutionary tools to cure fatal diseases, the NHS was the most significant turning point because it democratized these miraculous cures, ensuring every citizen, regardless of wealth, could benefit from modern medical science."
    }
  });

  // Lesson 4.4 (Lesson 19)
  setLessonExamPractice('lesson_4_4', {
    fourMark: {
      question: "Explain one way in which Alexander Fleming’s discovery of penicillin in 1928 was similar to Edward Jenner’s discovery of the smallpox vaccine in 1796. [4 marks]",
      hint: "Identify 1 valid similarity, then explain with specific historical detail from both named eras.",
      stems: "One way both discoveries were similar was... &bull; In 1796, Jenner... &bull; Similarly, in 1928, Fleming...",
      model: "One way both discoveries were similar was that both were initiated by **chance observation followed by empirical experimentation, yet neither pioneer understood the underlying biochemical mechanism at the time**. In 1796, Edward Jenner observed that milkmaids who caught cowpox never developed smallpox, conducting a trial on James Phipps without understanding viruses or antibodies. Similarly, in 1928, Alexander Fleming noticed by chance that *Penicillium notatum* mould drifting through an open window had killed staphylococci bacteria in a forgotten Petri dish, but he was unable to purify or mass-produce the active chemical. Therefore, both men made revolutionary breakthroughs through alert empirical observation of natural biological defenses."
    },
    essay: {
      tariff: "12 marks",
      question: "Explain why penicillin was successfully developed and mass-produced in the period 1928–1945. [12 marks]",
      stimulus: ["Alexander Fleming’s discovery (1928)", "The impact of the Second World War"],
      model: "One major reason penicillin was developed was the initial discovery by Alexander Fleming in 1928. When mould contaminated his staphylococci culture, Fleming astutely noticed a bacteria-free ring around the fungus. Although he published his findings in 1929, he could not extract pure penicillin and abandoned the project. However, his published paper provided the essential starting point for subsequent research teams.<br><br>Secondly, Howard Florey and Ernst Chain at Oxford University successfully developed the chemical purification techniques in 1938–40. Overcoming severe equipment shortages by using bedpans and milk churns, they purified small amounts of penicillin and proved its life-saving efficacy on mice and then on police constable Albert Alexander in 1941, proving conclusively that penicillin was an unprecedented antibiotic cure.<br><br>Finally, the urgent demands of the Second World War and US industrial backing were decisive. British factories were under bombardment and focused on munitions, so Florey traveled to the United States in 1941. Convinced of penicillin’s vital military value for treating wounded soldiers, the US War Production Board offered massive tax incentives and funding to pharmaceutical companies (like Pfizer). By D-Day in June 1944, American factories were mass-producing billions of units, ensuring every Allied soldier wounded in Europe had access to lifesaving penicillin."
    }
  });

  // Lesson 4.5 (Lesson 20)
  setLessonExamPractice('lesson_4_5', {
    fourMark: {
      question: "Explain one way in which government intervention against lung cancer after 1965 was similar to government action in the 1875 Public Health Act. [4 marks]",
      hint: "Identify 1 valid similarity, then explain with specific historical detail from both named eras.",
      stems: "One way government action was similar was... &bull; In 1875, Parliament... &bull; Similarly, after 1965...",
      model: "One way government intervention was similar was the use of **compulsory legislation restricting commercial practices and public behavior to protect population health**. In 1875, Parliament abandoned *laissez-faire* and passed the Public Health Act, compelling town councils to build sewers, supply clean water, and regulate food sales. Similarly, after 1965, following epidemiological proof linking smoking to lung cancer, Parliament passed coercive laws banning cigarette television advertising (1965), imposing heavy tobacco taxes, and banning smoking in all enclosed public places in 2007. Therefore, in both centuries, the British state recognized that safeguarding citizens' health required overriding individual commercial interests with compulsory nationwide regulations."
    },
    essay: {
      tariff: "16+4 marks",
      question: "‘Government public health legislation was the main reason for progress in combating lung cancer in the period c1950 to the present.’ How far do you agree? [16+4 marks]",
      stimulus: ["Doll and Hill’s research (1950)", "Technological treatments (radiotherapy, surgery, immunotherapy)"],
      model: "There is strong justification to agree that government public health legislation was the most decisive reason for progress against lung cancer because prevention through regulation is vastly more effective than treating advanced malignancies. Once epidemiological links were established, the government enacted strict legislation: banning cigarette television advertising in 1965, raising tobacco taxes, raising the legal age to buy cigarettes to 18, banning smoking in enclosed public spaces (2007), and enforcing plain packaging in 2016. These measures drove smoking rates down from over 80% among men in 1950 to under 15% today, preventing hundreds of thousands of premature cancer deaths.<br><br>However, scientific research was the essential catalyst that forced the government to act. In 1950, Richard Doll and Austin Bradford Hill published definitive statistical research demonstrating that heavy smokers were fifty times more likely to contract lung cancer than non-smokers. Without this rigorous medical epidemiology, the government would never have possessed the political justification to challenge the powerful tobacco lobby.<br><br>Furthermore, technological advances in cancer treatment have significantly improved patient survival rates. Modern innovations like chest CT scans and PET scans catch tumours earlier, while robotic keyhole surgery, stereotactic radiotherapy, and targeted immunotherapy drugs have dramatically extended life expectancy for diagnosed patients.<br><br>In conclusion, while Doll and Hill’s research provided the crucial scientific proof and radiotherapy improved survival, government legislation was the main reason for true long-term progress. Because lung cancer has poor surgical survival rates once symptomatic, state-led legislative deterrence of smoking was the only intervention capable of reducing national mortality on a mass scale."
    }
  });

  console.log('✅ Exam practice questions updated across all 20 lessons in KT1-KT4.');

  // -------------------------------------------------------------------------
  // 3. WRITE TO FILE & PUBLIC
  // -------------------------------------------------------------------------
  console.log('\n▶ Serializing updated data.js...');

  // Convert data back to file format
  // To preserve original formatting and imports/exports, we can write `export default data;`
  const outputCode = `// Edexcel GCSE (9–1) History: Medicine in Britain, c1250–present and The British Sector of the Western Front, 1914–1918
const data = ${JSON.stringify(data, null, 2)};

export default data;
`;

  fs.writeFileSync(dataJsPath, outputCode, 'utf8');
  console.log(`✅ Saved ${dataJsPath}`);

  // Copy to public/units/edexcel_medicine/data.js
  const publicDataJsPath = path.join(rootDir, 'public', 'units', 'edexcel_medicine', 'data.js');
  fs.writeFileSync(publicDataJsPath, outputCode, 'utf8');
  console.log(`✅ Copied to ${publicDataJsPath}`);
}

main().catch(err => {
  console.error('Fatal error in script:', err);
  process.exit(1);
});

