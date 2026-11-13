const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { renderStandardFrontCover, renderStandardBackCover, renderVersoLessonQr } = require('./components/render_standard_cover.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');

function getBase64Image(relPath) {
  if (!relPath) return null;
  const clean = relPath.replace(/^\//, '');
  const candidates = [
    path.join(ROOT_DIR, 'public', clean),
    path.join(ROOT_DIR, clean),
    path.join(ROOT_DIR, 'public', 'images', path.basename(clean)),
    path.join(ROOT_DIR, 'images', path.basename(clean)),
    path.join(ROOT_DIR, 'units', 'edexcel_medicine', 'assets', path.basename(clean)),
    path.join(ROOT_DIR, 'public', 'units', 'edexcel_medicine', 'assets', path.basename(clean)),
  ];

  for (const cand of candidates) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
      const ext = path.extname(cand).toLowerCase();
      let mime = 'image/jpeg';
      if (ext === '.png') mime = 'image/png';
      else if (ext === '.webp') mime = 'image/webp';
      else if (ext === '.svg') mime = 'image/svg+xml';
      const buf = fs.readFileSync(cand);
      return `data:${mime};base64,${buf.toString('base64')}`;
    }
  }
  return null;
}

function generateQrSvg(url) {
  const qr = QRCode.create(url, { margin: 1 });
  const size = qr.modules.size;
  const data = qr.modules.data;
  let pathD = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (data[r * size + c]) {
        pathD += `M${c},${r}h1v1h-1z `;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" style="width: 100%; height: 100%;"><path fill="#ffffff" d="M0,0h${size}v${size}H0z"/><path fill="#000000" d="${pathD.trim()}"/></svg>`;
}

function renderFooterStrip(pageNum, quip, totalPages = 20) {
  const isEven = pageNum % 2 === 0;
  if (isEven) {
    return `
      <div class="page-footer-strip">
        <span class="footer-page-num" style="margin-right: 8px;">${pageNum}/${totalPages}</span>
        <span class="footer-quip" style="text-align: right; flex: 1;">${quip}</span>
      </div>`;
  } else {
    return `
      <div class="page-footer-strip">
        <span class="footer-quip" style="text-align: left; flex: 1; margin-right: 8px;">${quip}</span>
        <span class="footer-page-num">${pageNum}/${totalPages}</span>
      </div>`;
  }
}

function renderNotesPage(pageNum, quip, totalPages = 20) {
  const isEven = pageNum % 2 === 0;
  const pageClass = isEven ? 'verso-page' : 'recto-page';
  const numLines = 32;
  let linesHtml = '';
  for (let i = 0; i < numLines; i++) {
    linesHtml += `          <div class="note-line" style="flex: 1; min-height: 0; border-bottom: 1.2px solid #000000; box-sizing: border-box; margin: 0;"></div>\n`;
  }

  return `
  <!-- PAGE ${pageNum}: DEDICATED BRITISH EXERCISE NOTES PAGE -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 5px;">
        <h2 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12pt; color: #000000; text-transform: uppercase; font-weight: 900; letter-spacing: 0.5px;">
          Key Topic 2 Notes &amp; Examination Strategy
        </h2>
      </div>

      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; position: relative; border-top: 1.2px solid #000000; margin-bottom: 4px;">
        <!-- Vertical Margin Line (26mm from left edge of lines) - British Exercise Book Standard Margin -->
        <div style="position: absolute; top: 0; bottom: 0; left: 26mm; width: 1.5px; background: #000000; z-index: 2;"></div>
        
        <!-- Ruled Horizontal Lines (Standard ~8mm school pitch, flex-filled) -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0;">
${linesHtml}        </div>
      </div>

      ${renderFooterStrip(pageNum, quip, totalPages)}
    </div>
  </div>`;
}

// ============================================================================
// 5 Dedicated Renaissance Enquiry Lesson Configurations (100% Black & White)
// ============================================================================
const renaissanceConfigs = [
  {
    lessonIndex: 5,
    lessonNum: 1,
    id: 'lesson_2_1',
    keyTopicBadge: 'KEY TOPIC 2.1',
    title: 'KT2.1: The New Spirit of Enquiry: Humanism, The Printing Press & The Royal Society',
    enquiryQuestion:
      'How did new technologies and scientific societies challenge traditional medical authority?',
    specAnchor:
      'Medical Renaissance: Humanism; the printing press (c1440); the Royal Society (1660); microscopes and scientific observation.',
    tariff: 'Question 4: Explain Why [12 marks &bull; 15 mins]',
    examStem:
      'Explain why new ideas in medicine were able to spread more rapidly in the period c1500–c1700. [12 marks]',
    stimulus: ['The invention of the printing press (c1440)', 'The Royal Society (1660)'],
    connectives:
      'One main reason was that... &bull; For example, ... &bull; This was important because... &bull; Another key factor was... &bull; In particular, ... &bull; Overall, the most decisive reason was... because...',
    wordBank:
      'Gutenberg press (c1440) &bull; William Caxton (1476) &bull; clerical monopoly &bull; vernacular translations &bull; Royal Society (1660) &bull; Royal Charter (1662) &bull; Nullius in Verba &bull; Philosophical Transactions (1665) &bull; peer review &bull; animalcules &bull; Robert Hooke (1665)',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT2.1 on Pages 2–3: map Gutenberg’s press and humanism (left) against the Royal Society’s peer review and Hooke’s Micrographia (right).',
    fourMark: {
      type: 'Similarity',
      question:
        'Explain one way in which ideas about the cause of disease in the Renaissance (c1500–c1700) were similar to ideas in the Medieval period (c1250–c1500). [4 marks]',
      hint: 'Focus on persistent beliefs in miasma, supernatural forces, and humoral imbalance despite new anatomical knowledge.',
      stems:
        'One way ideas were similar was... &bull; In the Medieval period... &bull; Similarly, in the Renaissance...',
    },
    leftPageQuip:
      'Gutenberg gave the world movable type; the Royal Society gave the world peer review. Neither cured a cold, but both destroyed ignorance.',
    rightPageQuip:
      'Nullius in Verba: "Take nobody’s word for it." A brilliant motto for science, and a great rule for evaluating historical sources.',
    linedLeftQuip:
      'The printing press ended the Church’s monopoly on text copying: for the first time, radical medical treatises could not simply be suppressed.',
    linedRightQuip:
      'Explain the mechanism: the Royal Society’s journal (Philosophical Transactions) allowed European scientists to confirm and repeat experiments.',
    stages: [
      {
        step: 1,
        dates: 'c1440–1476',
        title: 'The Movable Metal Printing Press',
        questionHeading: 'Why did printing break the clerical monopoly on medical learning?',
        paraBadge: '[1.1]',
        bullets: [
          'Gutenberg printing press',
          'Movable metal type',
          'Rapid book mass-production',
        ],
      },
      {
        step: 2,
        dates: 'c1500',
        title: 'Renaissance Humanism & Ancient Texts',
        questionHeading: 'How did humanism inspire physicians to challenge Galen?',
        paraBadge: '[1.2]',
        bullets: [
          'Humanism scholarly inquiry',
          'Original Greek translations',
          'Challenging Galenic dogma',
        ],
      },
      {
        step: 3,
        dates: '1660',
        title: 'Foundation of the Royal Society',
        questionHeading: 'Why was experimental observation central to the Royal Society?',
        paraBadge: '[1.3]',
        bullets: [
          'Royal Society founded (1660)',
          'Royal charter Charles II',
          '\'Nullius in Verba\' motto',
        ],
      },
      {
        step: 4,
        dates: '1665',
        title: 'Philosophical Transactions & Peer Review',
        questionHeading: 'How did scientific journals speed up the exchange of medical knowledge?',
        paraBadge: '[1.4]',
        bullets: [
          'Philosophical Transactions (1665)',
          'Scientific paper peer-sharing',
          'Empirical laboratory debates',
        ],
      },
      {
        step: 5,
        dates: '1665–1670s',
        title: 'Early Microscopes & Animalcules',
        questionHeading: 'Why did 17th-century microscopes fail to transform medical treatment?',
        paraBadge: '[1.5]',
        bullets: [
          'Compound light microscopes',
          'Robert Hooke Micrographia',
          'Leeuwenhoek \'animalcules\'',
        ],
      },
    ],
  },
  {
    lessonIndex: 6,
    lessonNum: 2,
    id: 'lesson_2_2',
    keyTopicBadge: 'KEY TOPIC 2.2',
    title: 'KT2.2: Thomas Sydenham & The Art of Bedside Observation',
    enquiryQuestion: 'Why was Thomas Sydenham known as the ‘English Hippocrates’?',
    specAnchor:
      'Thomas Sydenham (‘The English Hippocrates’); bedside observation; classification of diseases (Observationes Medicae, 1676); treatments.',
    tariff: 'Question 4: Explain Why [12 marks &bull; 15 mins]',
    examStem:
      'Explain why Thomas Sydenham was an important figure in the development of medicine in the seventeenth century. [12 marks]',
    stimulus: [
      'Observationes Medicae (1676)',
      'Treatments for smallpox and malaria (cinchona bark)',
    ],
    connectives:
      'One main reason was that... &bull; For example, ... &bull; This was important because... &bull; Another key factor was... &bull; In particular, ... &bull; Overall, the most decisive reason was... because...',
    wordBank:
      'Thomas Sydenham &bull; English Hippocrates &bull; bedside clinical observation &bull; Observationes Medicae (1676) &bull; species of disease &bull; scarlet fever vs. measles &bull; Cinchona bark (quinine) &bull; cool therapy for smallpox &bull; laudanum',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT2.2 on Pages 2–3: map Sydenham’s bedside symptom notes (left) against Observationes Medicae and Peruvian bark for malaria (right).',
    fourMark: {
      type: 'Difference',
      question:
        'Explain one way in which ideas about the treatment of disease in the Renaissance (c1500–c1700) were different from the Medieval period (c1250–c1500). [4 marks]',
      hint: 'Focus on Sydenham’s specific treatments (e.g. Peruvian bark for malaria) versus universal humoral purging.',
      stems:
        'One way treatments differed was... &bull; In the Medieval period... &bull; In contrast, in the Renaissance...',
    },
    leftPageQuip:
      'Sydenham told medical students: "Go to the bedside, there alone can you learn disease." Textbooks are great, but patients actually have the symptoms.',
    rightPageQuip:
      'Cool therapy for smallpox: opening windows and throwing off blankets. Radical in 1670, entirely sensible today.',
    linedLeftQuip:
      'Sydenham broke with tradition by treating diseases as specific external illnesses with unique characteristics, rather than unique personal humoral imbalances.',
    linedRightQuip:
      'Explain the impact: by proving cinchona bark cured only ague (malaria), Sydenham proved specific remedies could target specific diseases.',
    stages: [
      {
        step: 1,
        dates: '1660s',
        title: 'Rejecting Book Learning at the Bedside',
        questionHeading:
          'Why did Sydenham believe bedside observation surpassed textbook learning?',
        paraBadge: '[2.1]',
        bullets: [
          'Thomas Sydenham bedside',
          'Close clinical observation',
          'Detailed symptom logging',
        ],
      },
      {
        step: 2,
        dates: '1676',
        title: 'Observationes Medicae & Disease Classification',
        questionHeading:
          'How did classifying diseases challenge traditional individual humoral theory?',
        paraBadge: '[2.2]',
        bullets: [
          'Medical botany taxonomy',
          'Differential disease diagnosis',
          'Observationes Medicae (1676)',
        ],
      },
      {
        step: 3,
        dates: 'c1670s',
        title: 'Quinine & Cinchona Bark for Malaria',
        questionHeading: 'Why was the success of Peruvian bark a mortal blow to humoral balance?',
        paraBadge: '[2.3]',
        bullets: [
          'Cinchona bark (quinine)',
          'Specific cures ague',
          'Challenging humour balance',
        ],
      },
      {
        step: 4,
        dates: 'c1670s',
        title: 'Cool Therapy for Smallpox Fevers',
        questionHeading: 'Why did Sydenham’s cool treatment drastically cut smallpox deaths?',
        paraBadge: '[2.4]',
        bullets: [
          'Cool therapy treatment',
          'Fresh bedroom ventilation',
          'Discarding heavy blankets',
        ],
      },
      {
        step: 5,
        dates: '1680s',
        title: 'The Limits of Sydenham’s Legacy',
        questionHeading: 'Why did medical treatments remain mostly medieval despite Sydenham?',
        paraBadge: '[2.5]',
        bullets: [
          'Persistent miasma belief',
          'Pre-bacteriology limits',
          'Bleeding methods retained',
        ],
      },
    ],
  },
  {
    lessonIndex: 7,
    lessonNum: 3,
    id: 'lesson_2_3',
    keyTopicBadge: 'KEY TOPIC 2.3',
    title: 'KT2.3: Andreas Vesalius & The Anatomical Revolution',
    enquiryQuestion: 'How did Andreas Vesalius revolutionize the study of human anatomy?',
    specAnchor:
      'Andreas Vesalius; The Fabric of the Human Body (De Humani Corporis Fabrica, 1543); human dissection; correcting Galen’s errors.',
    tariff: 'Question 4: Explain Why [12 marks &bull; 15 mins]',
    examStem:
      'Explain why Andreas Vesalius made significant breakthroughs in the understanding of human anatomy in the sixteenth century. [12 marks]',
    stimulus: [
      'De Humani Corporis Fabrica (1543)',
      'Dissection of human corpses rather than animals',
    ],
    connectives:
      'One main reason was that... &bull; For example, ... &bull; This was important because... &bull; Another key factor was... &bull; In particular, ... &bull; Overall, the most decisive reason was... because...',
    wordBank:
      'Andreas Vesalius &bull; Padua University &bull; human dissection &bull; De Humani Corporis Fabrica (1543) &bull; anatomical woodcuts &bull; jawbone (mandible) &bull; breastbone segments &bull; Barbary apes vs. humans &bull; Thomas Geminus',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT2.3 on Pages 2–3: map Vesalius’s human dissections at Padua (left) against Galen’s corrected errors and practical treatment limits (right).',
    fourMark: {
      type: 'Similarity',
      question:
        'Explain one way in which methods of anatomical training in the Renaissance (c1500–c1700) were similar to anatomical training in the nineteenth century. [4 marks]',
      hint: 'Focus on direct physical dissection of human bodies as the foundation of surgical education.',
      stems:
        'One way anatomical training was similar was... &bull; In the Renaissance period... &bull; Similarly, in the nineteenth century...',
    },
    leftPageQuip:
      'Vesalius proved Galen had been dissecting pigs, dogs, and apes for 1,300 years. The human jawbone is one piece, not two. Awkward for Galenists!',
    rightPageQuip:
      'De Humani Corporis Fabrica was published in 1543—the exact same year Copernicus published that the earth revolved around the sun. A good year for science.',
    linedLeftQuip:
      'Vesalius insisted that medical professors perform dissections themselves, rather than sitting in high chairs while barbers hacked away below.',
    linedRightQuip:
      'Explain the limitation: while Vesalius proved Galen wrong on over 200 anatomical points, his discoveries did not immediately cure a single disease.',
    stages: [
      {
        step: 1,
        dates: '1537',
        title: 'Professor of Surgery at Padua University',
        questionHeading: 'Why was a professor dissecting human bodies revolutionary in 1537?',
        paraBadge: '[3.1]',
        bullets: [
          'Andreas Vesalius Padua',
          'Direct human dissection',
          'Scalpel in hand',
        ],
      },
      {
        step: 2,
        dates: '1540',
        title: 'Proving Galen Wrong on Human Anatomy',
        questionHeading: 'How did Vesalius prove Galen had made anatomical mistakes?',
        paraBadge: '[3.2]',
        bullets: [
          'Galenic errors corrected',
          'Single-bone human jaw',
          'Three-segment breastbone',
        ],
      },
      {
        step: 3,
        dates: '1543',
        title: 'Publication of De Humani Corporis Fabrica',
        questionHeading: 'Why was The Fabrica considered a masterpiece of Renaissance science?',
        paraBadge: '[3.3]',
        bullets: [
          'De Fabrica (1543)',
          'Master woodcut plates',
          'Johannes Oporinus printing',
        ],
      },
      {
        step: 4,
        dates: '1545–1553',
        title: 'Thomas Geminus & Dissemination in Britain',
        questionHeading: 'How did English translations spread Vesalius’s ideas to barber-surgeons?',
        paraBadge: '[3.4]',
        bullets: [
          'Thomas Geminus engravings',
          'English anatomy manual',
          'Barber-surgeon education',
        ],
      },
      {
        step: 5,
        dates: 'c1560',
        title: 'Fierce Opposition & Practical Limitations',
        questionHeading:
          'Why did Vesalius’s anatomical discoveries fail to save sick patients immediately?',
        paraBadge: '[3.5]',
        bullets: [
          'Conservative professor backlash',
          'Vesalius court resignation',
          'Empirical anatomy legacy',
        ],
      },
    ],
  },
  {
    lessonIndex: 8,
    lessonNum: 4,
    id: 'lesson_2_4',
    keyTopicBadge: 'KEY TOPIC 2.4',
    title: 'KT2.4: William Harvey & The Circulation of the Blood',
    enquiryQuestion:
      'How did William Harvey prove the circulation of the blood, and why was it resisted?',
    specAnchor:
      'William Harvey; circulation of the blood; De Motu Cordis (1628); the heart as a mechanical pump; veins and one-way valves; limitations.',
    tariff: 'Question 4: Explain Why [12 marks &bull; 15 mins]',
    examStem:
      'Explain why William Harvey’s discovery of the circulation of the blood was a major breakthrough in medicine in the seventeenth century. [12 marks]',
    stimulus: ['De Motu Cordis (1628)', 'Mechanical pump calculations and vein experiments'],
    connectives:
      'One main reason was that... &bull; For example, ... &bull; This was important because... &bull; Another key factor was... &bull; In particular, ... &bull; Overall, the most decisive reason was... because...',
    wordBank:
      'William Harvey &bull; De Motu Cordis (1628) &bull; circulation of the blood &bull; mechanical pump &bull; one-way pocket valves &bull; tied-arm ligature experiment &bull; quantitative calculation &bull; Marcello Malpighi (1661) &bull; capillaries',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT2.4 on Pages 2–3: map Harvey’s refutation of Galen’s liver theory (left) against his mechanical pump proof and Malpighi’s capillaries (right).',
    fourMark: {
      type: 'Difference',
      question:
        'Explain one way in which ideas about the human body in the Renaissance (c1500–c1700) were different from the Medieval period (c1250–c1500). [4 marks]',
      hint: 'Contrast Harvey’s dynamic mechanical circulation model with Galen’s belief that the liver manufactured fresh blood consumed by organs.',
      stems:
        'One way ideas differed was... &bull; In the Medieval period... &bull; In contrast, in the Renaissance...',
    },
    leftPageQuip:
      'Galen thought the liver made fresh blood like a factory; Harvey calculated you would need to produce 250 litres a day. Mathematics: the ultimate Galen-slayer.',
    rightPageQuip:
      'Harvey tied a bandage around an arm and watched the veins swell. Simple experiment, monumental consequence for human physiology.',
    linedLeftQuip:
      'Harvey treated the heart as a mechanical pump, reflecting the Scientific Revolution’s obsession with clockwork mechanisms and engineering.',
    linedRightQuip:
      'Explain the resistance: contemporary physicians mocked Harvey as "circulator" (charlatan) because admitting he was right meant Galen was fundamentally wrong.',
    stages: [
      {
        step: 1,
        dates: 'c1615',
        title: 'Dissecting Cold-Blooded Animals & Human Cadavers',
        questionHeading: 'Why did Harvey study cold-blooded animals to understand the human heart?',
        paraBadge: '[4.1]',
        bullets: [
          'Girolamo Fabricius valves',
          'One-way blood flow',
          'Cold frog dissections',
        ],
      },
      {
        step: 2,
        dates: '1620s',
        title: 'The Mechanical Pump & Quantitative Proof',
        questionHeading: 'How did mathematical calculations prove Galen’s theory impossible?',
        paraBadge: '[4.2]',
        bullets: [
          'Circulation mathematical proof',
          'Heart mechanical pump',
          'Galenic liver theory refuted',
        ],
      },
      {
        step: 3,
        dates: '1628',
        title: 'Publication of De Motu Cordis',
        questionHeading: 'Why did Harvey publish his research abroad rather than in England?',
        paraBadge: '[4.3]',
        bullets: [
          'De Motu Cordis (1628)',
          'Forearm tight-ligature test',
          'Venous valve demonstration',
        ],
      },
      {
        step: 4,
        dates: '1630s–1650s',
        title: 'Ridicule by ‘Galenists’ & Lost Patients',
        questionHeading: 'Why was Harvey’s discovery fiercely rejected by established doctors?',
        paraBadge: '[4.4]',
        bullets: [
          'Conservative medical opposition',
          'Losing private clients',
          'Slow university adoption',
        ],
      },
      {
        step: 5,
        dates: '1661',
        title: 'Marcello Malpighi Confirms Capillaries',
        questionHeading: 'Why was the discovery of capillaries the final proof Harvey was right?',
        paraBadge: '[4.5]',
        bullets: [
          'Marcello Malpighi (1661)',
          'Microscopic capillary vessels',
          'Circulatory proof complete',
        ],
      },
    ],
  },
  {
    lessonIndex: 9,
    lessonNum: 5,
    id: 'lesson_2_5',
    keyTopicBadge: 'KEY TOPIC 2.5',
    title: 'KT2.5: Continuity in Treatment & The Great Plague of London (1665)',
    enquiryQuestion:
      'Why did treatments during the Great Plague of 1665 show so much continuity with 1348?',
    specAnchor:
      'Continuity in treatment and prevention; the Great Plague of London (1665); comparison with the Black Death; plague orders; quarantine.',
    tariff: 'Question 5/6: Thematic Essay [16 marks + 4 marks SPaG &bull; 25 mins]',
    examStem:
      '‘Approaches to dealing with the Great Plague in 1665 were completely different from approaches to the Black Death in 1348.’ How far do you agree? Explain your answer. [16 marks + 4 marks SPaG]',
    stimulus: [
      'Mayor’s plague orders and quarantine (red crosses)',
      'Beliefs in miasma, astrology, and supernatural causes',
    ],
    connectives:
      'One main reason was that... &bull; For example, ... &bull; This was important because... &bull; Another key factor was... &bull; In particular, ... &bull; Overall, the most decisive reason was... because...',
    wordBank:
      'Great Plague of London (1665) &bull; Lord Mayor’s orders &bull; searchers of the dead &bull; red crosses &bull; "Lord have mercy upon us" &bull; quarantine &bull; pest houses &bull; slaughter of 40,000 dogs and cats &bull; smoking tar barrels &bull; dead carts',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT2.5 on Pages 2–3: map 1665 continuities with 1348 (left) against the Lord Mayor’s quarantine orders, pest houses, and watchmen (right).',
    fourMark: {
      type: 'Difference',
      question:
        'Explain one way in which government responses to the Great Plague of London (1665) were different from government responses to the Black Death (1348). [4 marks]',
      hint: 'Contrast systematic quarantine, red crosses, and pest houses in 1665 with rudimentary 1349 street cleaning.',
      stems:
        'One way government responses differed was... &bull; During the Black Death (1348)... &bull; In contrast, during the Great Plague (1665)...',
    },
    leftPageQuip:
      '1665: They killed 40,000 dogs and cats to stop the plague. The real culprits—the rat fleas—enjoyed a predator-free paradise.',
    rightPageQuip:
      'Red crosses on doors, armed watchmen, and smoking tar barrels. London in 1665 was a nightmare of disease, quarantine, and municipal panic.',
    linedLeftQuip:
      'Despite 150 years of Renaissance anatomy, when epidemic plague returned in 1665, treatments were virtually identical to 1348.',
    linedRightQuip:
      'Weigh continuity versus change: while government organization improved (quarantine, pest houses), medical understanding of the cause remained 100% medieval.',
    stages: [
      {
        step: 1,
        dates: 'Spring 1665',
        title: 'The Outbreak in St Giles-in-the-Fields',
        questionHeading:
          'Why did the rich flee London while the poor suffered catastrophic mortality?',
        paraBadge: '[5.1]',
        bullets: [
          'Great Plague (1665)',
          'Charles II court flight',
          'St Giles parish outbreak',
        ],
      },
      {
        step: 2,
        dates: 'Summer 1665',
        title: 'Continuity of Humoral & Supernatural Beliefs',
        questionHeading: 'Why did people still use 14th-century remedies in 1665?',
        paraBadge: '[5.2]',
        bullets: [
          'Wrath of God & miasma',
          'Plague water & pomanders',
          'Pigeon bubo remedies',
        ],
      },
      {
        step: 3,
        dates: '1665',
        title: 'Mayor’s Orders & Pest Houses',
        questionHeading:
          'How did local government action in 1665 show greater organization than 1348?',
        paraBadge: '[5.3]',
        bullets: [
          'Mayor quarantine orders',
          'Red cross marked doors',
          'Parish pest houses',
        ],
      },
      {
        step: 4,
        dates: '1665',
        title: 'Slaughter of Dogs & Smoking Tar Barrels',
        questionHeading: 'Why was slaughtering cats and dogs a tragic medical mistake?',
        paraBadge: '[5.4]',
        bullets: [
          'Culling dogs & cats',
          'Street barrel fires',
          'Tobacco smoke warding',
        ],
      },
      {
        step: 5,
        dates: 'Winter 1665',
        title: 'The Dead Carts & East Smithfield Pits',
        questionHeading: 'How devastating was the demographic impact of the 1665 epidemic?',
        paraBadge: '[5.5]',
        bullets: [
          'London dead carts',
          '100,000 plague deaths',
          'Bills of Mortality records',
        ],
      },
    ],
  },
];

function renderSpinePage(cfg) {
  const { pageNum, lessonNum, keyTopicBadge, enquiryQuestion, specAnchor, stages, leftPageQuip } =
    cfg;

  const stagesHtml = stages
    .map((st, sIdx) => {
      const bullets = st.bullets || (st.keywords ? st.keywords.slice(0, 3) : []);
      const bulletsHtml = bullets
        .map(
          (b, idx) => `
            <div class="trigger-fact-cell" style="flex: 1; display: flex; align-items: center; padding: 0 3px; ${idx < 2 ? 'border-bottom: 0.8px solid #cbd5e1;' : ''}">
              <div style="display: flex; align-items: flex-start; gap: 2.5px; line-height: 1.12;">
                <span style="font-weight: 900; color: #000000; font-size: 5pt; line-height: 1.3;">&bull;</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 6.3pt; font-weight: 700; color: #000000; word-break: break-word;">${b}</span>
              </div>
            </div>`,
        )
        .join('');

      const questionText = st.questionHeading || st.focusClue || st.title;

      return `
        <div class="spine-stage-block" style="display: flex; flex-direction: column; flex: 1; min-height: 0; margin-bottom: 2.5px; border: 1.2px solid #000000; border-radius: 2px; overflow: hidden; background: #ffffff;">
          
          <!-- Full-Width Banner with Key Question Across Page (Strict Single-Line Fit & Photocopier-Proof High Contrast) -->
          <div class="stage-banner" style="background: #ffffff; color: #000000; padding: 1.8px 6px; display: flex; align-items: center; border-bottom: 1.4px solid #000000;">
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1; overflow: hidden;">
              <span style="background: #ffffff; color: #000000; border: 1.4px solid #000000; font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; padding: 0.5px 5.5px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;">
                ${st.step || sIdx + 1}
              </span>
              ${(st.dates || st.date) ? `<span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; color: #000000; white-space: nowrap; flex-shrink: 0;">${st.dates || st.date}</span><span style="color: #000000; font-size: 8.5pt; font-weight: 900; flex-shrink: 0;">&bull;</span>` : ''}
              <span class="stage-question-text" style="font-family: 'Playfair Display', serif; font-size: 8.8pt; font-weight: 900; color: #000000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${questionText}
              </span>
            </div>
          </div>

          <!-- Content Row: Left 3-Zone Trigger Spine (26mm) & Right Ruled Writing Lines (~172mm) -->
          <div style="display: flex; flex: 1; min-height: 0; align-items: stretch;">
            
            <!-- Left Column: High-Visibility 26mm Trigger Spine -->
            <div class="stage-trigger-col" style="width: 26mm; flex-shrink: 0; background: #f8fafc; display: flex; flex-direction: column; border-right: 1.2px solid #000000; box-sizing: border-box;">
              ${bulletsHtml}
            </div>

            <!-- Right Column: 5 Ruled Note-Taking Lines (Expanded Writing Space) -->
            <div class="stage-writing-col">
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
              <div class="ruled-line"></div>
            </div>

          </div>
        </div>`;
    })
    .join('');

  return `
  <!-- ------------------------------------------------------------------ -->
  <!-- LESSON ENQUIRY NOTEBOOK WITH CHRONOLOGICAL SPINE (PAGE ${pageNum})         -->
  <!-- ------------------------------------------------------------------ -->
  <div class="page page-container verso-page" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      
      <!-- Lesson Header with Inquiry Question Title -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; border: 1.2px solid #000000; padding: 1.5px 7px; border-radius: 2px;">
              ${keyTopicBadge} &bull; LESSON NOTEBOOK
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 800; text-transform: uppercase; color: #000000;">
              EDEXCEL GCSE (9–1) HISTORY &bull; PAPER 1 (1HI0/11)
            </span>
          </div>
          <h2 style="font-family: 'Playfair Display', serif; font-size: 12.2pt; color: #000000; margin: 1px 0 1px 0; font-weight: 900; line-height: 1.2;">
            ${enquiryQuestion}
          </h2>
        </div>
        ${renderVersoLessonQr({ unitId: 'edexcel_medicine', lessonId: cfg.id })}
      </div>

      <!-- Chronological Inquiry Spine & Note-Taking Canvas -->
      <div style="flex: 1; display: flex; flex-direction: column; min-height: 0; margin-top: 2px;">
        <!-- 5 Chronological Stages with Spine on Left and Ruled Lines on Right -->
        <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 0;">
          ${stagesHtml}
        </div>
      </div>

      ${renderFooterStrip(pageNum, leftPageQuip, 20)}
    </div>
  </div>`;
}

function buildRenaissanceTwoPageWorkbook(unitData, period) {
  const coverImgBase64 =
    getBase64Image('units/edexcel_medicine/assets/authentic_renaissance.jpg') ||
    getBase64Image('/images/authentic_renaissance.jpg') ||
    '';

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Key Topic 2: The Medical Renaissance in Britain, c1500–c1700 Workbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *:before, *:after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page {
      size: A4 portrait;
      margin: 10mm 10mm 12mm 10mm;
    }
    body {
      font-family: 'Georgia', 'Garamond', serif;
      font-size: 8.5pt;
      line-height: 1.32;
      color: #000000;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    h1, h2, h3, h4, h5, h6, strong, th, .sans {
      font-family: 'Inter', -apple-system, sans-serif;
    }
    .page, .page-container {
      width: 100%;
      height: 272mm;
      max-height: 272mm;
      overflow: hidden;
      box-sizing: border-box;
      position: relative;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 3mm 4mm;
      background: #ffffff;
    }
    .page:last-child, .page-container:last-child {
      page-break-after: auto;
    }
    .page-body-full {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .task-section {
      margin-bottom: 5px;
      padding-bottom: 0;
    }
    .task-section-divider {
      border-bottom: 1.2px solid #000000;
      padding-bottom: 4px;
      margin-bottom: 5px;
    }
    .task-line {
      border-bottom: 1.2px solid #000000;
      height: 7.8mm;
      min-height: 7.8mm;
      max-height: 7.8mm;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      flex-shrink: 0;
    }
    .task-line-flex {
      border-bottom: 1.2px solid #000000;
      flex: 1;
      min-height: 0;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }
    .task-line-dotted {
      border-bottom: 1.2px dotted #000000;
      height: 7.4mm;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }
    .page-footer-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 0.5px solid #d0d0d0;
      padding-top: 1.5px;
      margin-top: 2px;
      font-family: 'Inter', sans-serif;
      font-size: 6.4pt;
      line-height: 1.15;
      color: #666666;
    }
    .footer-quip {
      font-style: italic;
      color: #666666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .footer-page-num {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      white-space: nowrap;
      color: #000000;
      font-size: 6.8pt;
    }
      .stage-writing-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
      box-sizing: border-box;
    }
    .ruled-line {
      height: 8.2mm;
      border-bottom: 0.8px solid #000000;
      box-sizing: border-box;
    }
    .ruled-line:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body>
`;

  // ====================================================================
  // PAGE 1: FRONT COVER (Unified 3-Tier Master Architectural Cover)
  // ====================================================================
  html += renderStandardFrontCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1: MEDICINE IN BRITAIN, C1250–PRESENT',
    specCode: 'SPECIFICATION 1HI0/11',
    keyTopicNum: 2,
    dateRange: 'c1500–c1700',
    title: 'The Medical Renaissance in Britain, c1500–c1700',
    subtitle: 'c1500–c1700: Humanism, Anatomy, Circulation, Scientific Observation &amp; The Great Plague',
    heroImage: {
      src: coverImgBase64,
      alt: 'Andreas Vesalius Dissecting a Female Cadaver (1543)',
      objectPosition: 'center 30%',
      shelfmark: 'CONTEMPORARY PRINT ARCHIVE',
      date: '1543',
      title: 'Title Page of Andreas Vesalius, De Humani Corporis Fabrica (1543)',
      caption: 'Woodcut title page showing Andreas Vesalius conducting an open human dissection surrounded by students, challenging Galenic anatomy directly from empirical observation.',
      sourceTag: 'Primary Visual Evidence',
      archiveTag: 'Wellcome Collection Historical Archive',
      heightMm: 88,
    },
    footerQuip: 'Notes: Key Topic 2 Specification Framework &bull; Retain for revision.',
    totalPageCount: 20,
    renderFooterStrip,
  });

  // ====================================================================
  // PAGES 2–3: CHRONOLOGY REVISION ANCHOR & CENTER-SPINE MIND-MAP CANVAS
  // (Pure Specification Headings, Zero Giveaways, Edge-to-Edge Open Space)
  // ====================================================================
  const renaissanceSpineLeft = [
    {
      date: 'c.1440',
      title: 'Printing Press &amp; Humanist Enquiry',
      kt: 'KT 2.1',
      leftCue: '◂ Church Monopoly Broken',
      rightCue: 'Mass-Printed Medical Texts ▸',
    },
    {
      date: '1543',
      title: 'Andreas Vesalius: De Fabrica',
      kt: 'KT 2.3',
      leftCue: '◂ Human Dissection vs Galen',
      rightCue: '300+ Errors Corrected &amp; Limits ▸',
    },
    {
      date: '1628',
      title: 'William Harvey: Blood Circulation',
      kt: 'KT 2.4',
      leftCue: '◂ Galen’s Liver Myth Refuted',
      rightCue: 'Heart Pump &amp; One-Way Valves ▸',
    },
    {
      date: '1660',
      title: 'The Royal Society &amp; Nullius in Verba',
      kt: 'KT 2.1',
      leftCue: '◂ Charles II Royal Charter',
      rightCue: 'Peer Review &amp; Transactions ▸',
    },
  ];

  const renaissanceSpineRight = [
    {
      date: '1661–65',
      title: 'Malpighi’s Capillaries &amp; Hooke',
      kt: 'KT 2.1 &bull; 2.4',
      leftCue: '◂ Early Compound Microscopes',
      rightCue: 'Capillaries &amp; Micrographia ▸',
    },
    {
      date: '1665',
      title: 'Great Plague: Continuity of Ideas',
      kt: 'KT 2.5',
      leftCue: '◂ Miasma, Sin &amp; Astrology',
      rightCue: 'Transference, Herbs &amp; Fires ▸',
    },
    {
      date: '1665',
      title: 'Lord Mayor’s Orders &amp; Quarantine',
      kt: 'KT 2.5',
      leftCue: '◂ Watchmen &amp; Red Cross Doors',
      rightCue: 'Pest Houses &amp; Animal Culls ▸',
    },
    {
      date: '1676',
      title: 'Thomas Sydenham: Observationes',
      kt: 'KT 2.2',
      leftCue: '◂ Clinical Bedside Symptoms',
      rightCue: 'Disease Species &amp; Quinine ▸',
    },
  ];

  const renderSpineNodes = (nodes) =>
    nodes
      .map(
        (n) => `
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 6px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.25px; white-space: nowrap;">
              ${n.leftCue}
            </div>
            <div style="background: #000000; color: #ffffff; padding: 4.5px 14px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 8.3pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 7px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000;">
              <span style="background: #ffffff; color: #000000; padding: 1.5px 6.5px; border-radius: 10px; font-size: 7.1pt; font-weight: 900;">${n.date}</span>
              <span>${n.title}</span>
              <span style="font-size: 6.8pt; font-weight: 700; color: #ffffff;">(${n.kt})</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 6.7pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.25px; white-space: nowrap;">
              ${n.rightCue}
            </div>
          </div>
        </div>`,
      )
      .join('');

  html += `
  <!-- PAGE 2: CHRONOLOGY REVISION ANCHOR PART 1 -->
  <div class="page page-container verso-page" id="page-2" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="position: relative;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
            CHRONOLOGY SPREAD &bull; PART 1
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 800; text-transform: uppercase; color: #000000;">
            MEDICAL RENAISSANCE &bull; SPECIFICATION ANCHORS (c1440–1660)
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 11.5pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
          New Spirit of Enquiry, Human Dissection &amp; Blood Circulation
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 7.4pt; color: #000000; line-height: 1.22;">
          <strong>REVISION MIND-MAP CANVAS:</strong> At the end of each lesson, use the app's <em>Consolidate Station</em> to retrieve your keywords and branch out your mind-map across the open page (Challenges to Tradition to the left &bull; Breakthroughs &amp; Limits to the right).
        </div>
      </div>

      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>
        ${renderSpineNodes(renaissanceSpineLeft)}
      </div>

      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          Specification Spine Continues to Sydenham &amp; 1665 Great Plague (Page 3) ➔
        </span>
      </div>

      ${renderFooterStrip(2, 'Vesalius proved Galen had been dissecting pigs, dogs, and apes for 1,300 years. The human jawbone is one piece, not two.', 20)}
    </div>
  </div>

  <!-- PAGE 3: CHRONOLOGY REVISION ANCHOR PART 2 -->
  <div class="page page-container recto-page" id="page-3" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="position: relative;">
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
            CHRONOLOGY SPREAD &bull; PART 2
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 800; text-transform: uppercase; color: #000000;">
            MEDICAL RENAISSANCE &bull; SPECIFICATION ANCHORS (1661–1676)
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 11.5pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
          Optical Proof, Bedside Observation &amp; The Great Plague of London (1665)
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 7.4pt; color: #000000; line-height: 1.22;">
          <strong>REVISION MIND-MAP CANVAS:</strong> At the end of each lesson, use the app's <em>Consolidate Station</em> to retrieve your keywords and branch out your mind-map across the open page (Continuity in Ideas to the left &bull; Change in Practice to the right).
        </div>
      </div>

      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>
        ${renderSpineNodes(renaissanceSpineRight)}
      </div>

      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          Key Topic 2 Specification Spine Complete ➔
        </span>
      </div>

      ${renderFooterStrip(3, 'Nullius in Verba: "Take nobody’s word for it." A brilliant motto for science, and a great rule for evaluating historical sources.', 20)}
    </div>
  </div>
`;

  // ====================================================================
  // PAGES 4–18: 5 DEDICATED THREE-PAGE ENQUIRY MODULES (15 PAGES TOTAL)
  // Page 1: Chronological Inquiry Spine & Exposition Notes (Left/Right)
  // Page 2: Extended Writing Part 1 (18 task lines, stimulus, writing frames & vocab @ 8.2pt)
  // Page 3: Extended Writing Part 2 (16 continuation lines + Question 3 Similarity/Difference [4 marks])
  // ====================================================================
  renaissanceConfigs.forEach((cfg, idx) => {
    const spinePageNum = 4 + idx * 3; // 4, 7, 10, 13, 16
    const questionPart1PageNum = spinePageNum + 1; // 5, 8, 11, 14, 17
    const questionPart2PageNum = spinePageNum + 2; // 6, 9, 12, 15, 18

    // PAGE 1 OF ENQUIRY: CHRONOLOGICAL INQUIRY SPINE
    html += renderSpinePage({ ...cfg, pageNum: spinePageNum });

    // PAGE 2 OF ENQUIRY: EXAM QUESTION PART 1 (26 FLEX TASK LINES, TIMELINE MISSION, PROMINENT TYPOGRAPHY)
    const part1TaskLines = Array.from(
      { length: 26 },
      () => '<div class="task-line-flex"></div>',
    ).join('');

    html += `
  <div class="page page-container" id="page-${questionPart1PageNum}">
    <div class="page-body-full">
      <div>
        <!-- Exam Header -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 5px;">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 11pt; color: #000000; margin: 0; font-weight: 800;">
            ${cfg.tariff}
          </h2>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            Extended Writing Assessment
          </span>
        </div>

        <!-- Question Stem & Stimulus Box -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 5px 8px; background: #ffffff; margin-bottom: 5px;">
          <div style="font-family: 'Playfair Display', serif; font-size: 9.2pt; font-weight: 800; color: #000000; margin-bottom: 4px; line-height: 1.28;">
            ${cfg.examStem}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 7.8pt; color: #000000;">
            <strong>Stimulus:</strong>
            <span style="border: 1px solid #000000; padding: 1px 6px; border-radius: 2px; font-weight: 700;">${cfg.stimulus[0]}</span>
            <span style="border: 1px solid #000000; padding: 1px 6px; border-radius: 2px; font-weight: 700;">${cfg.stimulus[1]}</span>
            <span style="font-style: italic; color: #333333;">(You must also use information of your own)</span>
          </div>
        </div>

        <!-- Analytical Connectives (Full Width Scaffolding Standard) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #ffffff; margin-bottom: 3px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.0pt; text-transform: uppercase; display: inline-block; margin-right: 4px; color: #000000;">Analytical Connectives:</strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-style: italic; color: #222222; line-height: 1.2;">${cfg.connectives}</span>
        </div>

        <!-- Ruled Task Lines Prompt -->
        <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-style: italic; color: #222222; margin: 2px 0 2px 0; display: flex; justify-content: space-between;">
          <span><strong>Write your response in the space provided below:</strong></span>
          <span style="font-size: 7.0pt; color: #555555; font-weight: 600;">(Response continues on facing page)</span>
        </div>
      </div>

      <!-- 26 Ruled Task Lines for Extended Writing (Full Height to Timeline Mission) -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 1px 0 3px 0;">
${part1TaskLines}
      </div>

      <!-- Timeline Mission -->
      <div style="border: 1.5px solid #000000; border-radius: 4px; padding: 4px 8px; background: #ffffff; display: flex; justify-content: space-between; align-items: center; margin-top: 2px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; background: #000000; color: #ffffff; padding: 2px 6px; border-radius: 2px; text-transform: uppercase; white-space: nowrap;">
            Mind-Map Mission
          </span>
          <span style="font-family: 'Georgia', serif; font-size: 7.4pt; line-height: 1.25; color: #000000;">
            ${cfg.timelineMission}
          </span>
        </div>
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 7pt; font-weight: 800; white-space: nowrap;">
          [ &nbsp;&nbsp; ] Done
        </div>
      </div>

      ${renderFooterStrip(questionPart1PageNum, cfg.rightPageQuip, 20)}
    </div>
  </div>
`;

    // PAGE 3 OF ENQUIRY: EXAM QUESTION PART 2 (23 CONTINUATION LINES + QUESTION 3 [4 MARKS] AT BOTTOM)
    const part2ContinuationLines = Array.from(
      { length: 23 },
      () => '<div class="task-line-flex"></div>',
    ).join('');

    const q3TaskLines = Array.from(
      { length: 6 },
      () => '<div class="task-line" style="height: 7.8mm;"></div>',
    ).join('');

    html += `
  <div class="page page-container" id="page-${questionPart2PageNum}">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 4px;">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 10.5pt; color: #000000; margin: 0; font-weight: 800;">
            ${cfg.title}
          </h2>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            ${cfg.tariff.split(':')[0]} Continued
          </span>
        </div>

        <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-style: italic; color: #333333; margin-bottom: 2px;">
          Continue your response to ${cfg.tariff.split(':')[0]} below:
        </div>
      </div>

      <!-- 23 Continuation Lines (Full Height to Question 3) -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 1px 0 4px 0;">
        ${part2ContinuationLines}
      </div>

      <!-- Question 3: Similarity / Difference [4 marks] At Bottom of Page -->
      <div style="border-top: 2px solid #000000; padding-top: 4px; margin-top: 2px; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 8.2pt; text-transform: uppercase; letter-spacing: 0.5px;">
            &bull; Question 3: Explain One ${cfg.fourMark.type} [4 marks]
          </strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; border: 1px solid #000000; padding: 1px 5px; border-radius: 2px; text-transform: uppercase;">
            Score: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 4 ] &bull; 5 Mins
          </span>
        </div>
        <p style="font-family: 'Playfair Display', serif; font-size: 8.8pt; font-weight: 800; color: #000000; margin: 0 0 2px 0; line-height: 1.25;">
          ${cfg.fourMark.question}
        </p>
        <div style="font-family: 'Inter', sans-serif; font-size: 7.0pt; font-style: italic; color: #475569; margin-bottom: 2px;">
          ${cfg.fourMark.hint}
        </div>
        <div style="display: flex; flex-direction: column; margin: 1px 0 0 0;">
          ${q3TaskLines}
        </div>
      </div>

      ${renderFooterStrip(questionPart2PageNum, cfg.linedRightQuip, 20)}
    </div>
  </div>
`;
  });

  // ====================================================================
  // PAGE 19: DEDICATED BRITISH EXERCISE NOTES & REVISION STRATEGY PAGE
  // ====================================================================
  html += renderNotesPage(
    19,
    'Notes: Record key causal links, essay plans, and teacher feedback for this unit.',
    20,
  );

  // ====================================================================
  // PAGE 20: MASTER BACK COVER (Student Assessment Record & Digital Quizzing Hub)
  // ====================================================================
  const renaissanceEnquiries = renaissanceConfigs.map((cfg, idx) => ({
    num: cfg.lessonNum,
    code: `KT2.${cfg.lessonNum}`,
    title: cfg.title.replace(/^KT\d+\.\d+:\s*/, ''),
    enquiryQuestion: cfg.enquiryQuestion,
    doNowMarks: 10,
    q3Marks: 4,
    extType: idx === 4 ? 'Q5/6 Essay' : 'Q4 Explain',
    extMarks: idx === 4 ? 20 : 12,
    totalMarks: idx === 4 ? 34 : 26,
  }));

  const renaissanceQrLessons = renaissanceConfigs.map((cfg) => ({
    label: `KT 2.${cfg.lessonNum}`,
    url: `https://the-history-revision-hub.netlify.app/?unit=edexcel_medicine&lesson=${cfg.id}&quiz=true`,
  }));

  html += renderStandardBackCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1: MEDICINE IN BRITAIN, C1250–PRESENT',
    keyTopicNum: 2,
    trackerTitle: 'Student Assessment Record &bull; Key Topic 2 Tracker',
    trackerSubtitle: 'Paper 1: Medicine in Britain, c1250–present &bull; Renaissance Britain (c1500–c1700)',
    enquiries: renaissanceEnquiries,
    qrLessons: renaissanceQrLessons,
    footerQuip: 'Retain this student assessment record for parent consultations and GCSE revision monitoring.',
    totalPageCount: 20,
    renderFooterStrip,
  });

  html += `
</body>
</html>
`;

  return html;
}

async function main() {
  console.log(
    'Rendering 20-Page A4 Pupil Workbook (Dual QR & Assessment Portfolio): Key Topic 2: Renaissance Britain (c1500–c1700)...',
  );
  const puppeteer = require('puppeteer');
  const customHtml = buildRenaissanceTwoPageWorkbook({}, {});

  const unitDir = path.resolve(__dirname, '../units/edexcel_medicine');
  const publicUnitDir = path.resolve(__dirname, '../public/units/edexcel_medicine');
  const pdfsDir = path.resolve(__dirname, '../public/pdfs');

  const unitHtmlPath = path.join(unitDir, 'pupil_workbook_renaissance.html');
  const pubHtmlPath = path.join(publicUnitDir, 'pupil_workbook_renaissance.html');
  const outPdfPath = path.join(
    pdfsDir,
    'edexcel_medicine_pupil_workbook_renaissance.pdf',
  );
  const pubPdfCopy = path.join(publicUnitDir, 'pupil_workbook_renaissance.pdf');

  fs.writeFileSync(unitHtmlPath, customHtml, 'utf8');
  fs.writeFileSync(pubHtmlPath, customHtml, 'utf8');
  console.log(`[OK] HTML written to: ${pubHtmlPath}`);

  console.log('Launching Puppeteer to generate high-resolution print PDF...');
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--allow-file-access-from-files', '--disable-web-security', '--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  await page.setContent(customHtml, { waitUntil: 'networkidle0', timeout: 60000 });

  await page.pdf({
    path: outPdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm',
    },
  });

  await browser.close();
  console.log(`[OK] PDF successfully compiled: ${outPdfPath}`);

  fs.copyFileSync(outPdfPath, pubPdfCopy);
  console.log(`[OK] PDF copy written: ${pubPdfCopy}`);

  const outPdfStandardPath = path.join(pdfsDir, 'edexcel_medicine_pupil_workbook_renaissance.pdf');
  fs.copyFileSync(outPdfPath, outPdfStandardPath);
  console.log(`[OK] PDF standard copy written: ${outPdfStandardPath}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Error compiling Renaissance workbook:', err);
    process.exit(1);
  });
}

module.exports = {
  buildRenaissanceTwoPageWorkbook,
  buildMedicineTwoPageWorkbook: buildRenaissanceTwoPageWorkbook,
  renaissanceConfigs,
};
