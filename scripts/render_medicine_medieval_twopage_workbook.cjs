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
          Key Topic 1 Notes &amp; Examination Strategy
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
// 5 Dedicated Medieval Enquiry Lesson Configurations (100% Black & White)
// ============================================================================
const medievalConfigs = [
  {
    lessonIndex: 0,
    lessonNum: 1,
    id: 'lesson_1_1',
    keyTopicBadge: 'KEY TOPIC 1.1',
    title: 'KT1.1: Supernatural & Religious Explanations of Disease',
    enquiryQuestion: 'Why did the Catholic Church dominate medieval explanations of disease?',
    specAnchor:
      'Supernatural & religious causes; Catholic Church influence; astrology & planetary conjunctions.',
    tariff: 'Question 4: Explain Why [12 marks &bull; 15 mins]',
    examStem:
      'Explain why the Catholic Church had such a major influence on ideas about the causes of disease in the period c1250–c1500. [12 marks]',
    stimulus: ['Monastic scriptoria and book-copying', 'The imprisonment of Roger Bacon (1277)'],
    connectives:
      'One main reason was that... &bull; For example, ... &bull; This was important because... &bull; Another key factor was... &bull; In particular, ... &bull; Overall, the most decisive reason was... because...',
    wordBank:
      'divine retribution &bull; biblical leprosy &bull; Lazar houses &bull; teleology &bull; heresy &bull; Roger Bacon (1277) &bull; monastic scriptoria &bull; 1345 planetary conjunction &bull; astrological almanacs',
    timelineMission:
      'Turn to Pages 2–3 (Key Topic 1.1). In the drawing box, sketch a monk copying Galen’s medical book in a scriptorium. Add two speech bubbles explaining why the Church banned new medical experiments and imprisoned Roger Bacon in 1277.',
    fourMark: {
      type: 'Similarity',
      question:
        'Explain one way in which ideas about the cause of disease in the Medieval period (c1250–c1500) were similar to ideas in the Renaissance period (c1500–c1700). [4 marks]',
      hint: 'Identify 1 valid similarity, then explain with specific historical detail from both named eras.',
      stems:
        'One way ideas were similar was that... &bull; In the Medieval period... &bull; Similarly, in the Renaissance...',
    },
    leftPageQuip:
      'If you develop a fever in 1300, church logic dictates you definitely committed a sin last Tuesday. Time to buy a pilgrimage badge!',
    rightPageQuip:
      'Galen wrote it, monks copied it, nobody dared question it. Because questioning Galen wasn’t just bad science—it was a heresy trial.',
    linedLeftQuip:
      'Questioning Galen or Church doctrine in 1300 was not just bad science — it was an immediate charge of heresy.',
    linedRightQuip:
      'Explain the monopoly: monks hand-copied manuscripts in scriptoria, so Christian ideas of divine punishment went unchallenged.',
    stages: [
      {
        step: 1,
        dates: 'c1250',
        title: 'Scriptoria & Church Monopoly on Learning',
        questionHeading: 'How did church scriptoria prevent new medical ideas from spreading?',
        paraBadge: '[1.1]',
        bullets: [
          'Church scriptoria monopoly',
          'Latin manuscript copying',
          'Roger Bacon imprisoned (1277)',
        ],
      },
      {
        step: 2,
        dates: 'c1280',
        title: 'Biblical Leprosy & Divine Retribution',
        questionHeading: 'Why was leprosy viewed as visible proof of divine judgment?',
        paraBadge: '[1.2]',
        bullets: [
          'Divine punishment for sin',
          'Biblical leprosy stigma',
          'Lazar houses isolation',
        ],
      },
      {
        step: 3,
        dates: '1345',
        title: 'Christian Astrology & Planetary Conjunction',
        questionHeading: 'How did the Church reconcile astrology with Christian doctrine?',
        paraBadge: '[1.3]',
        bullets: [
          '1345 planetary conjunction',
          'Mars, Jupiter & Saturn',
          'Zodiac calendar almanacs',
        ],
      },
      {
        step: 4,
        dates: 'c1350',
        title: 'Purgatory, Saints & Holy Relics',
        questionHeading: 'Why did sick people turn to pilgrimage shrines rather than doctors?',
        paraBadge: '[1.4]',
        bullets: [
          'Shrines & holy relics',
          'Pilgrimage prayers',
          'Sale of indulgences',
        ],
      },
      {
        step: 5,
        dates: 'c1400',
        title: 'Censorship & The Ban on Dissection',
        questionHeading: 'Why did church enforcement of Galen prevent medical progress?',
        paraBadge: '[1.5]',
        bullets: [
          'Galen theological fit',
          'Dissection bans enforced',
          'Heresy excommunication threat',
        ],
      },
    ],
  },
  {
    lessonIndex: 1,
    lessonNum: 2,
    id: 'lesson_1_2',
    keyTopicBadge: 'KEY TOPIC 1.2',
    title: 'KT1.2: Rational Explanations: Hippocrates, Galen & The Four Humours',
    enquiryQuestion:
      'Why did the Theory of the Four Humours dominate rational medicine for centuries?',
    specAnchor:
      'Rational explanations: Four Humours (Hippocrates), Theory of Opposites (Galen), Miasma; diagnostic tools.',
    tariff: 'Question 4: Explain Why [12 marks &bull; 15 mins]',
    examStem:
      'Explain why the Theory of the Four Humours remained the dominant rational explanation of disease throughout the period c1250–c1500. [12 marks]',
    stimulus: ['Galen’s Theory of Opposites', 'The diagnostic matula (uroscopy)'],
    connectives:
      'One main reason was that... &bull; For example, ... &bull; This was important because... &bull; Another key factor was... &bull; In particular, ... &bull; Overall, the most decisive reason was... because...',
    wordBank:
      'Four Humours &bull; blood, phlegm, yellow bile, black bile &bull; Theory of Opposites &bull; Galen &bull; clinical observation &bull; Hippocratic Oath &bull; matula &bull; uroscopy wheel &bull; Zodiac Man &bull; miasma',
    timelineMission:
      'Turn to Pages 2–3 (Key Topic 1.2). In the drawing box, sketch a four-part diagram of the Four Humours (Blood, Phlegm, Yellow Bile, Black Bile) showing their seasons and qualities. Annotate Galen’s Theory of Opposites alongside a flask of urine.',
    fourMark: {
      type: 'Difference',
      question:
        'Explain one way in which ideas about the cause of disease in the Medieval period (c1250–c1500) were different from ideas in the Modern period (c1900–present). [4 marks]',
      hint: 'Identify 1 valid difference, then explain with specific historical detail from both named eras.',
      stems:
        'One way ideas differed was that... &bull; In the Medieval period... &bull; In contrast, in the Modern period...',
    },
    leftPageQuip:
      'Cold and wet? Have some hot dry pepper. Too much blood? Let’s slice your arm open. Galen’s logic was flawless, provided you survived the cure.',
    rightPageQuip:
      'Sniffing urine, tasting urine, holding urine up to the window. 14th-century diagnostics was 90% liquid inspection and 10% guessing.',
    linedLeftQuip:
      'Hippocrates separated medicine from religion; Galen created a complete logical system that answered every symptom without needing dissection.',
    linedRightQuip:
      'Explain the logic: the Theory of Opposites provided clear, practical action for every physician, even when the patient grew worse.',
    stages: [
      {
        step: 1,
        dates: 'c460 BC',
        title: 'Hippocrates & Natural Observation',
        questionHeading: 'How did Hippocrates separate medicine from superstition?',
        paraBadge: '[2.1]',
        bullets: [
          'Hippocratic clinical method',
          'Rejection of gods',
          'Hippocratic Oath ethics',
        ],
      },
      {
        step: 2,
        dates: 'c1250',
        title: 'The Four Bodily Humours',
        questionHeading: 'Why did humoral theory seem logical to medieval people?',
        paraBadge: '[2.2]',
        bullets: [
          'Four bodily humours',
          'Blood, phlegm & biles',
          'Seasonal balance system',
        ],
      },
      {
        step: 3,
        dates: 'c1280',
        title: 'Galen’s Theory of Opposites',
        questionHeading: 'How did the Theory of Opposites provide practical treatment rules?',
        paraBadge: '[2.3]',
        bullets: [
          'Galen Theory of Opposites',
          'Contraries cure contraries',
          'Animal dissection errors',
        ],
      },
      {
        step: 4,
        dates: 'c1300',
        title: 'The Matula & Diagnostic Uroscopy',
        questionHeading: 'Why did uroscopy give physicians great diagnostic authority?',
        paraBadge: '[2.4]',
        bullets: [
          'Uroscopy urine flask (matula)',
          'Urine diagnostic wheel',
          'Zodiac Man alignment',
        ],
      },
      {
        step: 5,
        dates: 'c1350',
        title: 'Miasma Theory & Foul Vapours',
        questionHeading: 'Why did rational physicians link bad smells directly to epidemics?',
        paraBadge: '[2.5]',
        bullets: [
          'Miasma theory (bad air)',
          'Cesspool stench fears',
          'Unbalanced bodily fluids',
        ],
      },
    ],
  },
  {
    lessonIndex: 2,
    lessonNum: 3,
    id: 'lesson_1_3',
    keyTopicBadge: 'KEY TOPIC 1.3',
    title: 'KT1.3: Approaches to Prevention & Treatment: Rituals, Bleeding & Purging',
    enquiryQuestion:
      'How did medieval people attempt to treat and prevent disease, and why did rational and religious methods coexist?',
    specAnchor:
      'Approaches to treatment and prevention; religious & supernatural treatments; humoral treatments (phlebotomy, purging); herbal remedies; regimens.',
    tariff: 'Question 4: Explain Why [12 marks &bull; 15 mins]',
    examStem:
      'Explain why bloodletting and purging remained the most common medical treatments throughout the period c1250–c1500. [12 marks]',
    stimulus: ['Phlebotomy (bloodletting by fleam or leeches)', 'The Regimen Sanitatis'],
    connectives:
      'One main reason was that... &bull; For example, ... &bull; This was important because... &bull; Another key factor was... &bull; In particular, ... &bull; Overall, the most decisive reason was... because...',
    wordBank:
      'phlebotomy &bull; fleam &bull; leeches &bull; cupping &bull; purging &bull; emetics &bull; clysters &bull; theriac &bull; herbal materia medica &bull; Regimen Sanitatis &bull; flagellants',
    timelineMission:
      'Turn to Pages 2–3 (Key Topic 1.3). In the drawing box, sketch a barber-surgeon using a fleam and pewter bleeding bowl, alongside a flagellant whip. Label how one treated the body and the other treated the soul.',
    fourMark: {
      type: 'Similarity',
      question:
        'Explain one way in which approaches to preventing disease in the Medieval period (c1250–c1500) were similar to approaches in the Renaissance period (c1500–c1700). [4 marks]',
      hint: 'Identify 1 valid similarity, then explain with specific historical detail from both named eras.',
      stems:
        'One way prevention was similar was... &bull; In the Medieval period... &bull; Similarly, in the Renaissance period...',
    },
    leftPageQuip:
      'Bleeding, purging, boiling vinegar, and swallowing crushed emeralds. If the disease didn’t kill you, the apothecary’s bill definitely would.',
    rightPageQuip:
      'Flagellants marched from town to town whipping themselves bloody to appease God. The townspeople were suitably terrified, and the plague spread faster.',
    linedLeftQuip:
      'Phlebotomy was not random violence: physicians consulted the Zodiac Man to ensure the moon was in the correct astrological house before opening a vein.',
    linedRightQuip:
      'Explain the dual approach: medieval treatments treated the mortal body through purging humours and the immortal soul through fasting and penance.',
    stages: [
      {
        step: 1,
        dates: 'c1250',
        title: 'Religious Prayers, Fasting & Flagellation',
        questionHeading: 'Why did ordinary people consider prayer more vital than medicine?',
        paraBadge: '[3.1]',
        bullets: [
          'Penance & fasting',
          'Chanted Latin prayers',
          'Flagellant whipping processions',
        ],
      },
      {
        step: 2,
        dates: 'c1300',
        title: 'Humoral Phlebotomy (Bloodletting)',
        questionHeading: 'Why was bloodletting the most universal physical treatment?',
        paraBadge: '[3.2]',
        bullets: [
          'Phlebotomy vein incision',
          'Iron fleams & leeches',
          'Cupping & pewter bowls',
        ],
      },
      {
        step: 3,
        dates: 'c1320',
        title: 'Purging, Vomiting & Enemas',
        questionHeading: 'How was purging believed to restore bodily equilibrium?',
        paraBadge: '[3.3]',
        bullets: [
          'Emetics (black hellebore)',
          'Laxatives & clysters',
          'Humoural fluid evacuation',
        ],
      },
      {
        step: 4,
        dates: 'c1350',
        title: 'Herbal Apothecary Remedies & Theriac',
        questionHeading: 'Why did herbal recipes remain popular across all social classes?',
        paraBadge: '[3.4]',
        bullets: [
          'Herbal Materia Medica',
          'Theriac (70 ingredients)',
          'Local apothecaries remedies',
        ],
      },
      {
        step: 5,
        dates: 'c1400',
        title: 'The Regimen Sanitatis & Clean Air',
        questionHeading: 'How did wealthy barons attempt to prevent sickness before it struck?',
        paraBadge: '[3.5]',
        bullets: [
          'Regimen Sanitatis rules',
          'Sweet pomander scents',
          'Lavender & burning tar',
        ],
      },
    ],
  },
  {
    lessonIndex: 3,
    lessonNum: 4,
    id: 'lesson_1_4',
    keyTopicBadge: 'KEY TOPIC 1.4',
    title: 'KT1.4: Medical Care Providers & Monastic Hospitals: ‘Care Not Cure’',
    enquiryQuestion:
      'Who provided medical care in medieval England, and why did hospitals focus on care rather than cure?',
    specAnchor:
      'Medical care providers: physicians, apothecaries, barber-surgeons; women in the home; hospitals (monastic care, care not cure).',
    tariff: 'Question 4: Explain Why [12 marks &bull; 15 mins]',
    examStem:
      'Explain why hospital care in medieval England was based on the concept of ‘care rather than cure’ in the period c1250–c1500. [12 marks]',
    stimulus: [
      'Monastic rules and religious charity',
      'The exclusion of infectious diseases (lepers and plague victims)',
    ],
    connectives:
      'One main reason was that... &bull; For example, ... &bull; This was important because... &bull; Another key factor was... &bull; In particular, ... &bull; Overall, the most decisive reason was... because...',
    wordBank:
      'care not cure &bull; monastic hospitals &bull; St Bartholomew’s (1123) &bull; infirmarer &bull; university physicians &bull; apothecaries &bull; barber-surgeons &bull; wise women &bull; fleam &bull; Lazar houses',
    timelineMission:
      'Turn to Pages 2–3 (Key Topic 1.4). In the drawing box, sketch the interior of a monastic hospital ward showing rows of beds facing a chapel altar. Annotate why monks prioritized prayer over medical surgery.',
    fourMark: {
      type: 'Difference',
      question:
        'Explain one way in which the work of hospitals in the Medieval period (c1250–c1500) was different from hospitals in the nineteenth century. [4 marks]',
      hint: 'Identify 1 valid difference, then explain with specific historical detail from both named eras.',
      stems:
        'One way hospital care differed was... &bull; In the Medieval period... &bull; In contrast, in the nineteenth century...',
    },
    leftPageQuip:
      'Medieval hospitals: clean sheets, warm porridge, 24-hour prayer, and absolutely zero doctors. It was luxury hospitality, not clinical medicine.',
    rightPageQuip:
      'Barber-surgeons: short back and sides, pull out a molar, lance a boil, amputate a leg. Multi-tasking at its finest and bloodiest.',
    linedLeftQuip:
      'Over 1,200 medieval hospitals in England were run by religious orders: their goal was spiritual salvation of the soul, not medical recovery of the body.',
    linedRightQuip:
      'Explain the hierarchy: wealthy barons hired Oxford-trained physicians; town merchants visited guild apothecaries; ordinary peasants relied on wise women.',
    stages: [
      {
        step: 1,
        dates: 'c1250',
        title: 'University-Trained Physicians',
        questionHeading: 'Why were university physicians accessible only to the ultra-wealthy?',
        paraBadge: '[4.1]',
        bullets: [
          'University-trained physicians',
          'Latin texts & star charts',
          'High diagnostic fees',
        ],
      },
      {
        step: 2,
        dates: 'c1300',
        title: 'Guild Apothecaries & Spicers',
        questionHeading: 'How did apothecaries provide accessible medicines to townspeople?',
        paraBadge: '[4.2]',
        bullets: [
          'Apothecary guild trade',
          'Herbal preparations sold',
          'Cheaper urban access',
        ],
      },
      {
        step: 3,
        dates: 'c1320',
        title: 'Barber-Surgeons & Wound Care',
        questionHeading: 'Why were barber-surgeons viewed as lower-status craftsmen?',
        paraBadge: '[4.3]',
        bullets: [
          'Barber-surgeon guild',
          'Bloodletting & tooth pulling',
          'Cauterisation & amputation',
        ],
      },
      {
        step: 4,
        dates: 'c1350',
        title: 'Monastic Hospitals: Care Not Cure',
        questionHeading: 'Why did monastic hospitals deliberately avoid medical treatment?',
        paraBadge: '[4.4]',
        bullets: [
          'Monastic charity hospitals',
          'Care not cure philosophy',
          'Bed rest & prayer',
        ],
      },
      {
        step: 5,
        dates: 'c1400',
        title: 'Women Healers & Household Care',
        questionHeading: 'Why did the vast majority of sick people rely on female family members?',
        paraBadge: '[4.5]',
        bullets: [
          'Domestic women healers',
          'Local herb gardening',
          'Midwifery & home care',
        ],
      },
    ],
  },
  {
    lessonIndex: 4,
    lessonNum: 5,
    id: 'lesson_1_5',
    keyTopicBadge: 'KEY TOPIC 1.5',
    title: 'KT1.5: Case Study: Dealing with the Black Death (1348–1349)',
    enquiryQuestion:
      'Why did medieval society fail to halt the devastating mortality of the Black Death?',
    specAnchor:
      'Case study: The Black Death, 1348–49; beliefs about causes; approaches to treatment and prevention; local government action.',
    tariff: 'Question 5/6: Thematic Essay [16 marks + 4 marks SPaG &bull; 25 mins]',
    examStem:
      '‘The main reason why so many people died during the Black Death (1348–49) was because governments had no effective way of preventing disease.’ How far do you agree? Explain your answer. [16 marks + 4 marks SPaG]',
    stimulus: [
      'King Edward III’s cleanliness order (1349)',
      'Belief in miasma and supernatural causes',
    ],
    connectives:
      'One main reason was that... &bull; For example, ... &bull; This was important because... &bull; Another key factor was... &bull; In particular, ... &bull; Overall, the most decisive reason was... because...',
    wordBank:
      'Black Death (1348) &bull; Melcombe Regis &bull; bubonic plague &bull; pneumonic plague &bull; Yersinia pestis &bull; black rats &bull; Xenopsylla cheopis fleas &bull; buboes &bull; King Edward III &bull; East Smithfield mass graves &bull; miasma',
    timelineMission:
      'Turn to Pages 2–3 (Key Topic 1.5). In the drawing box, sketch the arrival of a trading cog at Melcombe Regis carrying rats and fleas, alongside an emergency mass burial pit at East Smithfield.',
    fourMark: {
      type: 'Similarity',
      question:
        'Explain one way in which responses to the Black Death (1348–49) were similar to responses to the Great Plague of London (1665). [4 marks]',
      hint: 'Identify 1 valid similarity, then explain with specific historical detail from both named eras.',
      stems:
        'One way responses were similar was... &bull; During the Black Death... &bull; Similarly, during the Great Plague of 1665...',
    },
    leftPageQuip:
      'In 1348, people blamed God, the planets, bad smells, and foreigners. The actual culprits—fleas on black rats—went completely unnoticed.',
    rightPageQuip:
      'King Edward III ordered the streets cleaned because of bad smells. It smelled marginally better, but fleas don’t care about fresh air.',
    linedLeftQuip:
      'Between 30% and 50% of England’s population died in eighteen months: churchyards overflowed, fields went unharvested, and villages were abandoned.',
    linedRightQuip:
      'Weigh the factors: did mortality explode because of scientific ignorance, municipal filth, or the sheer biological ferocity of pneumonic infection?',
    stages: [
      {
        step: 1,
        dates: 'June 1348',
        title: 'Arrival at Melcombe Regis',
        questionHeading: 'How did trade routes unwittingly bring the plague to England?',
        paraBadge: '[5.1]',
        bullets: [
          'Melcombe Regis port (1348)',
          'Yersinia pestis bacteria',
          'Black rats & fleas',
        ],
      },
      {
        step: 2,
        dates: 'Autumn 1348',
        title: 'Buboes & Pneumonic Terror',
        questionHeading: 'Why was the pneumonic strain far deadlier than the bubonic form?',
        paraBadge: '[5.2]',
        bullets: [
          'Bubonic groin swellings (buboes)',
          'Pneumonic bloody coughing',
          'Mortality in three days',
        ],
      },
      {
        step: 3,
        dates: 'Winter 1348',
        title: 'Desperate Treatments & Strapped Chickens',
        questionHeading: 'Why were medical treatments completely useless against the plague?',
        paraBadge: '[5.3]',
        bullets: [
          'Divine wrath & miasma',
          'Lancing buboes & live hens',
          'Bleeding & crushed emeralds',
        ],
      },
      {
        step: 4,
        dates: '1349',
        title: 'King Edward III’s Cleanliness Order',
        questionHeading: 'How did belief in miasma shape royal prevention orders?',
        paraBadge: '[5.4]',
        bullets: [
          'Quarantine isolation rules',
          'Cleaning town butchery waste',
          'Street fire smoke barriers',
        ],
      },
      {
        step: 5,
        dates: '1349–1350',
        title: 'Mass Burial Pits & Demographic Collapse',
        questionHeading: 'Why did the Black Death trigger a long-term social and economic crisis?',
        paraBadge: '[5.5]',
        bullets: [
          'Mass burial trenches',
          'Third to half population lost',
          'Labour shortage & wage rises',
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
          
          <!-- Full-Width Banner with Key Question Across Page (Strict Single-Line Fit) -->
          <div class="stage-banner" style="background: #000000; color: #ffffff; padding: 1.5px 6px; display: flex; align-items: center; border-bottom: 1.2px solid #000000;">
            <div style="display: flex; align-items: center; gap: 5px; min-width: 0; flex: 1; overflow: hidden;">
              <span style="background: #ffffff; color: #000000; font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; padding: 0.5px 4.5px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;">
                ${st.step || sIdx + 1}
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #e2e8f0; white-space: nowrap; flex-shrink: 0;">
                ${st.dates || st.date}
              </span>
              <span style="color: #94a3b8; font-size: 7pt; flex-shrink: 0;">&bull;</span>
              <span style="font-family: 'Playfair Display', serif; font-size: 8.5pt; font-weight: 800; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
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

function buildMedievalTwoPageWorkbook(unitData, period) {
  const coverImgBase64 =
    getBase64Image('public/images/plague_toggenburg_clean.jpg') ||
    getBase64Image('/images/plague_toggenburg_clean.jpg') ||
    getBase64Image('units/edexcel_medicine/assets/authentic_medieval.jpg') ||
    '';

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Key Topic 1: Medicine in Medieval Britain, c1250–c1500 Workbook</title>
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
    keyTopicNum: 1,
    dateRange: 'c1250–c1500',
    title: 'Medicine in Medieval Britain, c1250–c1500',
    subtitle: 'c1250–c1500: Ideas on Causes, Prevention, Treatment, Medical Care &amp; The Black Death',
    heroImage: {
      src: coverImgBase64,
      alt: 'Medieval Plague Sufferers in Bed with Buboes',
      objectPosition: 'center 30%',
      shelfmark: 'MS 13076 • FOLIO 24V',
      date: 'c.1350',
      title: 'Omne Bonum: Clerics Ministering to Plague Victims with Buboes',
      caption: 'James le Palmer (fl. 1360–1375) • Fourteenth-century illuminated manuscript showing two plague sufferers bearing bubonic sores in bed while priests administer last rites and prayer.',
      sourceTag: 'Primary Visual Evidence',
      archiveTag: 'The British Library Manuscript Collection',
      heightMm: 68,
    },
    footerQuip: 'Notes: Key Topic 1 Specification Framework &bull; Retain for revision.',
    totalPageCount: 20,
    renderFooterStrip,
  });

  // ====================================================================
  // PAGES 2–3: PANORAMIC LIVING TIMELINE (8 HISTORICAL MILESTONES)
  // ====================================================================
  html += `
  <div class="page page-container verso-page" id="page-2" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 4px;">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 11pt; color: #000000; margin: 0; font-weight: 800;">
            Living Timeline &bull; Part 1: Medieval Ideas &amp; Medical Hierarchy (c1250–c1350)
          </h2>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            Chronological Inquiry &bull; Milestones 1–4
          </span>
        </div>

        <div style="border: 1.2px solid #000000; border-radius: 3px; background: #ffffff; padding: 3px 6px; margin-bottom: 5px; font-family: 'Inter', sans-serif; font-size: 7.8pt; color: #000000;">
          <strong style="color: #000000;">Living Timeline Dual-Coding Protocol:</strong> Complete each milestone sketchpad using dual-coding (combining visual storytelling symbols, causal arrows, and dates) to master the chronological spine across the centre-fold.
        </div>
      </div>

      <!-- 4 Milestones with Open Drawing Area (Zero Box Lines) -->
      <div style="display: flex; flex-direction: column; flex: 1; justify-content: space-between; min-height: 0;">
        
        <!-- Milestone 1: c. 1250 -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; min-height: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 9.6pt; font-weight: 900; color: #000000;">
              c. 1250 &bull; The Church &amp; The Monopoly on Medical Learning
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; background: #000000; color: #ffffff; border: 1px solid #000000; padding: 1px 6px; border-radius: 2px;">Key Topic 1.1</span>
          </div>
          <p style="font-family: 'Georgia', serif; font-size: 8.6pt; color: #000000; margin: 0; line-height: 1.3;">
            The Catholic Church controls all English universities (Oxford, Cambridge) and hospital foundations. Monks hand-copy medical manuscripts in scriptoria, preserving Galen’s anatomical writings because his teleological view—that the body had a single divine Creator—aligned with Christian dogma.
          </p>
        </div>

        <!-- Milestone 2: 1277 -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; min-height: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 9.6pt; font-weight: 900; color: #000000;">
              1277 &bull; The Imprisonment of Roger Bacon
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; background: #000000; color: #ffffff; border: 1px solid #000000; padding: 1px 6px; border-radius: 2px;">Key Topic 1.1</span>
          </div>
          <p style="font-family: 'Georgia', serif; font-size: 8.6pt; color: #000000; margin: 0; line-height: 1.3;">
            Franciscan friar and Oxford scholar Roger Bacon is imprisoned by church leaders for heresy after writing that physicians should conduct original scientific experiments rather than blindly copying Galen. This imprisonment effectively halts independent anatomical inquiry for over two centuries.
          </p>
        </div>

        <!-- Milestone 3: c. 1300 -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; min-height: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 9.6pt; font-weight: 900; color: #000000;">
              c. 1300 &bull; The Diagnostic Tools: Matula Flasks &amp; The Zodiac Man
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; background: #000000; color: #ffffff; border: 1px solid #000000; padding: 1px 6px; border-radius: 2px;">Key Topic 1.2</span>
          </div>
          <p style="font-family: 'Georgia', serif; font-size: 8.6pt; color: #000000; margin: 0; line-height: 1.3;">
            Physicians practice uroscopy using glass matula flasks, comparing urine colour, density, and smell against 20-shade charts to diagnose humoral imbalance. They carry Vademecum pocketbooks containing the Zodiac Man to determine safe planetary alignments for phlebotomy (bloodletting).
          </p>
        </div>

        <!-- Milestone 4: c. 1320 -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; min-height: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 9.6pt; font-weight: 900; color: #000000;">
              c. 1320 &bull; The Medical Hierarchy: Physicians, Barber-Surgeons &amp; Apothecaries
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; background: #000000; color: #ffffff; border: 1px solid #000000; padding: 1px 6px; border-radius: 2px;">Key Topic 1.4</span>
          </div>
          <p style="font-family: 'Georgia', serif; font-size: 8.6pt; color: #000000; margin: 0; line-height: 1.3;">
            A rigid division of medical labour establishes in England. Fewer than 100 elite university-trained physicians diagnose wealthy nobility. Town apothecaries mix theriac and herbal compounds, while lower-status barber-surgeons perform tooth-pulling, wound-cautery, and bloodletting.
          </p>
        </div>

      </div>

      ${renderFooterStrip(2, 'Roger Bacon spent years in a prison cell for suggesting doctors should actually test things. Remember that when your teacher asks you to write an extra paragraph!', 20)}
    </div>
  </div>

  <!-- PAGE 3: LIVING TIMELINE PART 2 -->
  <div class="page page-container recto-page" id="page-3" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 4px;">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 11pt; color: #000000; margin: 0; font-weight: 800;">
            Living Timeline &bull; Part 2: Hospitals, Planetary Conjunctions &amp; The Black Death (c1345–1350)
          </h2>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            Chronological Inquiry &bull; Milestones 5–8
          </span>
        </div>

        <div style="border: 1.2px solid #000000; border-radius: 3px; background: #ffffff; padding: 3px 6px; margin-bottom: 5px; font-family: 'Inter', sans-serif; font-size: 7.8pt; color: #000000;">
          <strong style="color: #000000;">Living Timeline Dual-Coding Protocol:</strong> Complete each milestone sketchpad using dual-coding (combining visual storytelling symbols, causal arrows, and dates) to master the chronological spine across the centre-fold.
        </div>
      </div>

      <!-- 4 Milestones with Open Drawing Area (Zero Box Lines) -->
      <div style="display: flex; flex-direction: column; flex: 1; justify-content: space-between; min-height: 0;">
        
        <!-- Milestone 5: c. 1350 -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; min-height: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 9.6pt; font-weight: 900; color: #000000;">
              c. 1350 &bull; Monastic Hospitals: The Era of ‘Care Not Cure’
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; background: #000000; color: #ffffff; border: 1px solid #000000; padding: 1px 6px; border-radius: 2px;">Key Topic 1.4</span>
          </div>
          <p style="font-family: 'Georgia', serif; font-size: 8.6pt; color: #000000; margin: 0; line-height: 1.3;">
            Over 1,200 hospitals run by monks and nuns operate in England (e.g. St Bartholomew’s, 1123). Patients receive clean bedding, warmth, food, and continuous prayer facing a chapel altar. Zero surgery or medical cure is attempted; lepers and plague victims are strictly barred.
          </p>
        </div>

        <!-- Milestone 6: 1345 -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; min-height: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 9.6pt; font-weight: 900; color: #000000;">
              1345 &bull; The Great Planetary Conjunction in Aquarius
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; background: #000000; color: #ffffff; border: 1px solid #000000; padding: 1px 6px; border-radius: 2px;">Key Topic 1.5</span>
          </div>
          <p style="font-family: 'Georgia', serif; font-size: 8.6pt; color: #000000; margin: 0; line-height: 1.3;">
            In March 1345, Mars, Jupiter, and Saturn align in Aquarius. University of Paris physicians state this celestial conjunction drew up poisonous vapours from the earth, corrupting the air with deadly miasma, preparing Europe for the Black Death.
          </p>
        </div>

        <!-- Milestone 7: 1348 -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; min-height: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 9.6pt; font-weight: 900; color: #000000;">
              1348 &bull; The Black Death Reaches Melcombe Regis, Dorset
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; background: #000000; color: #ffffff; border: 1px solid #000000; padding: 1px 6px; border-radius: 2px;">Key Topic 1.5</span>
          </div>
          <p style="font-family: 'Georgia', serif; font-size: 8.6pt; color: #000000; margin: 0; line-height: 1.3;">
            In June 1348, the pestilence arrives on trade ships carrying black rats and fleas. The dual epidemic—bubonic plague (flea bites, agonizing buboes) and pneumonic plague (airborne coughing droplets)—kills 30–50% of England’s population within 18 months.
          </p>
        </div>

        <!-- Milestone 8: 1349 -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; min-height: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="font-family: 'Inter', sans-serif; font-size: 9.6pt; font-weight: 900; color: #000000;">
              1349 &bull; King Edward III’s Cleanliness Order &amp; East Smithfield Mass Pits
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 800; background: #000000; color: #ffffff; border: 1px solid #000000; padding: 1px 6px; border-radius: 2px;">Key Topic 1.5</span>
          </div>
          <p style="font-family: 'Georgia', serif; font-size: 8.6pt; color: #000000; margin: 0; line-height: 1.3;">
            Alarmed by rotting waste and stench, Edward III orders London streets cleared of dung to remove miasma. Churchyards overflow; emergency mass burial trenches are dug outside city walls at East Smithfield to bury hundreds of corpses daily.
          </p>
        </div>

      </div>

      ${renderFooterStrip(3, 'King Edward III ordered Londoners to clean human filth off the streets in 1349. Outstanding for civic smell, totally useless against Yersinia pestis fleas.', 20)}
    </div>
  </div>
`;

  // ====================================================================
  // PAGES 4–18: 5 DEDICATED THREE-PAGE ENQUIRY MODULES (15 PAGES TOTAL)
  // Page 1: Chronological Inquiry Spine & Exposition Notes (Left/Right)
  // Page 2: Extended Writing Part 1 (18 task lines, stimulus, writing frames & vocab @ 8.2pt)
  // Page 3: Extended Writing Part 2 (16 continuation lines + Question 3 Similarity/Difference [4 marks])
  // ====================================================================
  medievalConfigs.forEach((cfg, idx) => {
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
            Timeline Mission
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
  const medievalEnquiries = medievalConfigs.map((cfg, idx) => ({
    num: cfg.lessonNum,
    code: `KT1.${cfg.lessonNum}`,
    title: cfg.title.replace(/^KT\d+\.\d+:\s*/, ''),
    enquiryQuestion: cfg.enquiryQuestion,
    doNowMarks: 10,
    q3Marks: 4,
    extType: idx === 4 ? 'Q5/6 Essay' : 'Q4 Explain',
    extMarks: idx === 4 ? 20 : 12,
    totalMarks: idx === 4 ? 34 : 26,
  }));

  const medievalQrLessons = medievalConfigs.map((cfg) => ({
    label: `KT 1.${cfg.lessonNum}`,
    url: `https://the-history-revision-hub.netlify.app/?unit=edexcel_medicine&lesson=${cfg.id}&quiz=true`,
  }));

  html += renderStandardBackCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1: MEDICINE IN BRITAIN, C1250–PRESENT',
    keyTopicNum: 1,
    trackerTitle: 'Student Assessment Record &bull; Key Topic 1 Tracker',
    trackerSubtitle: 'Paper 1: Medicine in Britain, c1250–present &bull; Medieval Britain (c1250–c1500)',
    enquiries: medievalEnquiries,
    qrLessons: medievalQrLessons,
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
    'Rendering 20-Page A4 Pupil Workbook (Dual QR & Assessment Portfolio): Key Topic 1: Medieval Britain (c1250–c1500)...',
  );
  const puppeteer = require('puppeteer');
  const customHtml = buildMedievalTwoPageWorkbook({}, {});

  const unitDir = path.resolve(__dirname, '../units/edexcel_medicine');
  const publicUnitDir = path.resolve(__dirname, '../public/units/edexcel_medicine');
  const pdfsDir = path.resolve(__dirname, '../public/pdfs');

  const unitHtmlPath = path.join(unitDir, 'pupil_workbook_medieval.html');
  const pubHtmlPath = path.join(publicUnitDir, 'pupil_workbook_medieval.html');
  const outPdfPath = path.join(pdfsDir, 'edexcel_medicine_pupil_workbook_medieval.pdf');
  const pubPdfCopy = path.join(publicUnitDir, 'pupil_workbook_medieval.pdf');

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

  const outPdfStandardPath = path.join(pdfsDir, 'edexcel_medicine_pupil_workbook_medieval.pdf');
  fs.copyFileSync(outPdfPath, outPdfStandardPath);
  console.log(`[OK] PDF standard copy written: ${outPdfStandardPath}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Error compiling Medieval workbook:', err);
    process.exit(1);
  });
}

module.exports = {
  buildMedievalTwoPageWorkbook,
  medievalConfigs,
};
