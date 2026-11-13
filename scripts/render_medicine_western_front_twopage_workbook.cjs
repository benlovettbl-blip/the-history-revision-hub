const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { renderStandardBackCover, renderVersoLessonQr } = require('./components/render_standard_cover.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * Robust Base64 Image Inliner
 * Resolves local image files from public/ or units/ assets and embeds them as data URIs
 * to prevent broken image icons when rendering via Puppeteer or standalone HTML files.
 */
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

// 16 APPROVED RISQUÉ / CHEEKY BLACKADDER-STYLE QUIPS
const quipList = [
  'Western Front Revision Hub • The History Department', // Page 1
  'If you think your walk to period 1 is rough, try carrying a 14-stone sergeant through 4 miles of knee-deep Flanders clay.', // Page 2
  'Living Timeline complete: 4 years of static trench warfare, mud, and rapid medical innovation summarized in 6 chronological milestones.', // Page 3
  'Welcome to Flanders: 500 square miles of fermented pig manure, liquid mud, and artillery with terrifying accuracy.', // Page 4
  'Trench drainage tip: If your duckboards are floating, you are no longer in an infantry trench; you are commanding a submarine.', // Page 5
  'Whale oil smells like dead fish and regrets, but it beats having your toes amputated by an RAMC surgeon with a bone-saw.', // Page 6
  "Body lice: The only creatures on the Western Front that didn't care about King, Kaiser, or your personal hygiene.", // Page 7
  'The Brodie helmet: Looks like an upside-down soup bowl, but prevents your skull from becoming one.', // Page 8
  'Chlorine gas: If it smells like rotten pineapple and bleaches the grass, do NOT inhale—unless you fancy drowning in your own lungs.', // Page 9
  'The Regimental Aid Post: 200 yards from the German front line, lit by candle-ends, and smelling entirely of iodine and panic.', // Page 10
  'Motor ambulances: Guaranteed to rattle every uninjured bone in your body while speeding you to the Casualty Clearing Station.', // Page 11
  'The Thomas Splint: Before Robert Jones introduced it, an 80% chance of death; after Jones, an 80% chance of living to complain about the food.', // Page 12
  'Carrel-Dakin solution: If it burns like liquid fire and smells like a Victorian washhouse, congratulations—it is killing the gas gangrene.', // Page 13
  "Robertson's Blood Depot: Ice chests, sodium citrate, and refrigerated blood at Cambrai—proof that cold beer isn't the only thing worth chilling.", // Page 14
  'Harold Gillies at Sidcup: Turning shattered faces into men again with tubed pedicle skin grafts, while patients politely pretended not to notice.', // Page 15
  'Western Front Spec Complete: 16 marks in the bag, zero gangrene, and not a single complaint to the War Office.', // Page 16
];

// FOOTER STRIP HELPER
function renderFooterStrip(pageNum, quipText, totalPages = 28) {
  const isEven = pageNum % 2 === 0;
  if (isEven) {
    return `
      <div class="page-footer-strip">
        <span class="footer-page-num" style="margin-right: 8px;">${pageNum}/${totalPages}</span>
        <span class="footer-quip" style="text-align: right; flex: 1;"><em>${quipText}</em></span>
      </div>`;
  } else {
    return `
      <div class="page-footer-strip">
        <span class="footer-quip" style="text-align: left; flex: 1; margin-right: 8px;"><em>${quipText}</em></span>
        <span class="footer-page-num">${pageNum}/${totalPages}</span>
      </div>`;
  }
}

// ============================================================================
// 6 DEDICATED WESTERN FRONT ENQUIRY LESSON CONFIGURATIONS
// Full Edexcel Specification Coverage & Environmental Inquiry Spines
// ============================================================================
const wfConfigs = [
  {
    lessonIndex: 20,
    lessonNum: 1,
    id: 'lesson_5_1',
    keyTopicBadge: 'KEY TOPIC 5.1',
    title: 'KT5.1: The Theatre of War: The British Sector, Trench Geography & Battles',
    enquiryQuestion:
      'How did the physical terrain and trench architecture of the British sector dictate medical evacuation and care?',
    specAnchor:
      'The British sector of the Western Front: theatre of war in Flanders and northern France; Ypres, Somme, Arras, Cambrai; trench system (frontline, support, reserve, communication trenches; saps); terrain, clay, water table, mud; underground systems at Arras (Thompson’s Cave).',
    sourceIndex: 0,
    sourceBadge: 'SOURCE A',
    sourceSubtitle: 'Contemporary Aerial Reconnaissance • Royal Flying Corps',
    sourceDate: '1917',
    q1Features: {
      a: {
        q: 'Describe one feature of the system of communication trenches on the Western Front.',
        hint: 'Identify one specific feature of communication trenches and add a factual detail about its design or purpose.',
      },
      b: {
        q: 'Describe one feature of the underground hospital at Arras (Thompson’s Cave).',
        hint: 'Identify one physical feature of Thompson’s Cave and explain its medical purpose.',
      },
    },
    tariff: 'Question 2(a): Source Utility Assessment [8 marks &bull; 10 mins]',
    examStem:
      'Study Source A. How useful is Source A for an enquiry into the defensive layout and tactical design of trench systems on the Western Front? Explain your answer, using Source A and your knowledge of the historical context. [8 marks]',
    provenanceClue:
      'Consider the nature of an official military aerial reconnaissance photograph taken by the Royal Flying Corps in 1917. What does an overhead view reveal about traverses, fire-steps, and saps, and what ground-level medical and mud conditions does it omit?',
    structureStrip: [
      {
        col: '1. CONTENT & UTILITY',
        text: 'Explain how the aerial photograph clearly shows the zig-zag traverse design, communication lines, and support saps.',
      },
      {
        col: '2. PROVENANCE & MOTIVE',
        text: 'Evaluate the RFC photographic intelligence: highly accurate for cartography, but taken from high altitude under combat conditions.',
      },
      {
        col: '3. CONTEXT & LIMITATIONS',
        text: 'Cross-reference with knowledge of mud, water tables at Ypres, and the difficulty stretcher bearers faced turning sharp right-angle corners.',
      },
    ],
    connectives:
      'Source A is useful for an enquiry into this topic because... &bull; Specifically, the source reveals... &bull; In terms of provenance, considering the author and date... &bull; However, the utility is limited because... &bull; Therefore...',
    wordBank:
      'Royal Flying Corps &bull; zig-zag traverses &bull; communication trench &bull; Ypres Salient &bull; Messines Ridge &bull; water table &bull; duckboards &bull; parapet &bull; parados &bull; fire-step',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT5.1 on Pages 2–3: map Ypres mud and zig-zag traverses (left) against Thompson’s Cave at Arras (right).',
    leftPageQuip:
      'Welcome to Flanders: 500 square miles of fermented pig manure, liquid mud, and artillery with terrifying accuracy.',
    rightPageQuip:
      'Trench drainage tip: If your duckboards are floating, you are no longer in an infantry trench; you are commanding a submarine.',
    linedLeftQuip:
      'Ypres Salient: surrounded on three sides by German artillery on Messines Ridge; duckboards were life preservers.',
    linedRightQuip:
      'Under Arras, 25,000 British soldiers waited in lit chalk tunnels with running water and electric power.',
    stages: [
      {
        dates: '1914–1915',
        title: 'Flanders Terrain & Ypres Salient',
        bullets: [
          'Ypres Salient waterlogged',
          'Clay soil drainage destruction',
          'Deep mud stretcher crisis',
        ],
        focusClue: 'Why was the low-lying topography of Ypres a tactical and medical nightmare?',
      },
      {
        dates: '1914–1918',
        title: 'Trench Architecture & Traverses',
        bullets: [
          'Zig-zag traverse construction',
          'Duckboards & sump drainage',
          'Frontline firing step',
        ],
        focusClue:
          'How did zig-zag traverses limit shrapnel injuries and contain shell explosions?',
      },
      {
        dates: '1915–1918',
        title: 'Trench System: Front to Rear',
        bullets: [
          'Three-line trench system',
          'Communication trench transit',
          'Narrow stretcher passages',
        ],
        focusClue: 'Why did narrow communication trenches create acute bottlenecks for stretchers?',
      },
      {
        dates: 'Nov 1916–1917',
        title: 'Thompson’s Cave & Arras Tunnels',
        bullets: [
          'Arras chalk caverns (1916)',
          'Thompson\'s Cave hospital',
          '700 underground beds',
        ],
        focusClue: 'How did the chalk geology at Arras allow safe, sterile surgical conditions?',
      },
      {
        dates: '1916–1917',
        title: 'Mass Trauma: Somme & Cambrai',
        bullets: [
          '1916 Somme casualty flood',
          '57,000 first-day casualties',
          '1917 Cambrai tank battle',
        ],
        focusClue: 'Why did mass-casualty offensives force the RAMC to reorganize evacuation?',
      },
    ],
  },
  {
    lessonIndex: 21,
    lessonNum: 2,
    id: 'lesson_5_2',
    keyTopicBadge: 'KEY TOPIC 5.2',
    title: 'KT5.2: The Trench Environment: Mud, Vermin & Non-Combat Illnesses',
    enquiryQuestion:
      'Why were environmental pathogens and vermin as dangerous to British troops as enemy artillery?',
    specAnchor:
      'Ill health arising from the trench environment: trench foot (pathology, gangrene, prevention, whale oil, sock inspection); trench fever (body lice, Pediculus humanus, delousing stations, Serbian barrels); shell shock (symptoms, NYDN, rest treatment); dysentery (water chlorination, chloride of lime, latrines); underground shelter conditions.',
    sourceIndex: 0,
    sourceBadge: 'SOURCE A',
    sourceSubtitle: 'Contemporary Photographic Evidence • Western Front',
    sourceDate: 'July 1916',
    q1Features: {
      a: {
        q: 'Describe one feature of the methods used to prevent trench foot on the Western Front.',
        hint: 'Identify one routine used by soldiers and explain how it protected feet from wet mud.',
      },
      b: {
        q: 'Describe one feature of the causes of trench fever among British troops.',
        hint: 'Identify the creature that spread trench fever and explain how soldiers caught it.',
      },
    },
    tariff: 'Question 2(b): Follow-Up Enquiry Table [4 marks &bull; 5 mins]',
    examStem:
      'Study Source A. How could you follow up Source A to find out more about the living conditions and non-combat illnesses experienced by British soldiers in frontline trenches on the Western Front? [4 marks]',
    q2bData: {
      sourceLetter: 'A',
      detailPrompt:
        'Soldiers huddled asleep on the damp trench floor wrapped in waterproof groundsheets.',
      questionPrompt:
        'What proportion of frontline infantry casualties were evacuated due to non-combat illnesses like trench fever and exhaustion rather than enemy action?',
      sourceTypePrompt:
        'RAMC Divisional Medical Officer monthly sickness returns and battalion casualty logs for the Somme sector in 1916.',
      helpPrompt:
        'This would provide official statistical data proving how many soldiers were incapacitated by trench living conditions, vermin, and exhaustion compared to battle wounds.',
    },
    connectives:
      'A key detail to follow up is... &bull; The question I would ask is... &bull; The specific historical source type needed is... &bull; This source would help answer my question because...',
    wordBank:
      'trench foot &bull; whale oil &bull; buddy-system &bull; gangrene &bull; trench fever &bull; body lice (Pediculus humanus) &bull; delousing stations &bull; Serbian barrels &bull; shell shock &bull; NYDN &bull; dysentery &bull; chloride of lime',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT5.2 on Pages 2–3: map trench foot, lice, and shell shock (left) against whale oil, delousing, and water chlorination (right).',
    leftPageQuip:
      'Whale oil smells like dead fish and regrets, but it beats having your toes amputated by an RAMC surgeon with a bone-saw.',
    rightPageQuip:
      "Body lice: The only creatures on the Western Front that didn't care about King, Kaiser, or your personal hygiene.",
    linedLeftQuip:
      'Trench foot required 3 pairs of dry socks and rubbing with whale oil; negligence resulted in court martial.',
    linedRightQuip:
      'Body lice lived in uniform seams; delousing machines reduced typhus and trench fever across the British Expeditionary Force.',
    stages: [
      {
        dates: '1914–1915',
        title: 'Trench Foot Pathology',
        bullets: [
          'Trench foot fungal infection',
          'Constricted circulation numbness',
          'Amputation gangrene risk',
        ],
        focusClue: 'How did prolonged cold water immersion destroy tissue and produce gangrene?',
      },
      {
        dates: '1915–1918',
        title: 'Prevention: Whale Oil & Socks',
        bullets: [
          'Whale oil rubbing',
          'Dry sock changes',
          'Daily officer foot inspections',
        ],
        focusClue:
          'Why did mandatory officer inspections succeed where voluntary advice had failed?',
      },
      {
        dates: '1914–1918',
        title: 'Trench Fever, Lice & Delousing',
        bullets: [
          'Trench fever pyrexia',
          'Body lice transmission',
          'Delousing bathhouses',
        ],
        focusClue:
          'Why did trench fever persist until the body louse insect vector was proven in 1918?',
      },
      {
        dates: '1914–1918',
        title: 'Dysentery & Water Chlorination',
        bullets: [
          'Bacterial dysentery illness',
          'Latrine chloride-of-lime',
          'Purified water chlorination',
        ],
        focusClue: 'How did strict sanitation and chemical water chlorination prevent epidemics?',
      },
      {
        dates: '1914–1918',
        title: 'Shell Shock & Psychological Trauma',
        bullets: [
          'Shell shock (NYDN)',
          'Artillery concussive trauma',
          'Craiglockhart mental convalescence',
        ],
        focusClue:
          'Why was shell shock initially stigmatised as cowardice before being treated medically?',
      },
    ],
  },
  {
    lessonIndex: 22,
    lessonNum: 3,
    id: 'lesson_5_3',
    keyTopicBadge: 'KEY TOPIC 5.3',
    title: 'KT5.3: Battlefield Trauma: High Explosive Shrapnel, Gas Attacks & Infection',
    enquiryQuestion:
      'How did high-explosive artillery trauma and chemical poison gas transform surgical treatment?',
    specAnchor:
      'Wounds, injuries and diseases: high-explosive artillery shells, shrapnel fragments; infection (gas gangrene, Clostridium welchii, tetanus); head trauma and the Brodie helmet; chemical gas attacks (chlorine, phosgene, mustard gas) and respirators.',
    sourceIndex: 1, // Source B is PH Anti-Gas Helmet
    sourceBadge: 'SOURCE B',
    sourceSubtitle: 'Contemporary Photographic Evidence • Machine Gun Corps',
    sourceDate: 'July 1916',
    q1Features: {
      a: {
        q: 'Describe one feature of the effects of poison gas attacks on soldiers on the Western Front.',
        hint: 'Identify one specific type of gas and describe its physical effect on the human body.',
      },
      b: {
        q: 'Describe one feature of the design of the British Brodie steel helmet.',
        hint: 'Identify one physical feature of the Brodie helmet and explain how it protected the soldier.',
      },
    },
    tariff: 'Question 2(a): Source Utility Assessment [8 marks &bull; 10 mins]',
    examStem:
      'Study Source B. How useful is Source B for an enquiry into the methods used to protect British soldiers from poison gas attacks on the Western Front? Explain your answer, using Source B and your knowledge of the historical context. [8 marks]',
    provenanceClue:
      'Consider the nature of an authentic British War Office Phenate-Hexamine (PH) anti-gas helmet manufactured in 1915–1916. What physical protective properties does chemically impregnated flannel possess, and what severe combat limitations did it have in battle?',
    structureStrip: [
      {
        col: '1. CONTENT & ARTIFACT UTILITY',
        text: 'Explain how the PH hood protected against chlorine and phosgene, featuring glass eyepieces and an exhalation valve.',
      },
      {
        col: '2. PROVENANCE & MOTIVE',
        text: 'Evaluate the artifact: official War Office standard issue, demonstrating rapid British industrial response to chemical warfare.',
      },
      {
        col: '3. CONTEXT & COMBAT LIMITS',
        text: 'Cross-reference with knowledge: hot, suffocating, prone to fogging, and completely ineffective against mustard gas introduced in 1917.',
      },
    ],
    connectives:
      'Source B is useful for investigating this topic because... &bull; Specifically, the source provides evidence that... &bull; In terms of provenance, considering the nature and purpose... &bull; However, the source is limited because... &bull; Consequently...',
    wordBank:
      'high-explosive artillery &bull; shrapnel balls &bull; gas gangrene &bull; Clostridium welchii &bull; Brodie steel helmet &bull; chlorine gas (1915) &bull; phosgene &bull; mustard gas (1917) &bull; PH helmet &bull; Small Box Respirator (1916)',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT5.3 on Pages 2–3: map shrapnel, gas gangrene, and gas attacks (left) against the Brodie helmet and Box Respirators (right).',
    leftPageQuip:
      'The Brodie helmet: Looks like an upside-down soup bowl, but prevents your skull from becoming one.',
    rightPageQuip:
      'Chlorine gas: If it smells like rotten pineapple and bleaches the grass, do NOT inhale—unless you fancy drowning in your own lungs.',
    linedLeftQuip:
      'The 1915 Brodie helmet slashed penetrating head wounds by 75%; shrapnel helmets became universal equipment.',
    linedRightQuip:
      'Small Box Respirators with charcoal filters neutralized chlorine and phosgene, though mustard gas still blistered through clothing.',
    stages: [
      {
        dates: '1914–1918',
        title: 'Artillery & Shrapnel Trauma',
        bullets: [
          'Artillery shrapnel (58%)',
          'High explosive fragments',
          'Embedded uniform cloth',
        ],
        focusClue:
          'Why did jagged shrapnel fragments cause far worse infections than rifle bullets?',
      },
      {
        dates: '1914–1918',
        title: 'Soil Bacteria & Gas Gangrene',
        bullets: [
          'Manured agricultural soil',
          'Clostridium gas gangrene',
          'Dead tissue bacteria',
        ],
        focusClue: 'Why was Clostridium welchii so lethal in deep, airless shrapnel wounds?',
      },
      {
        dates: 'Late 1915',
        title: 'Head Trauma & Brodie Helmet',
        bullets: [
          'Brodie steel helmet (1915)',
          'Shrapnel deflection rim',
          'Fatal head wounds halved',
        ],
        focusClue:
          'Why did the introduction of the Brodie helmet cause an apparent rise in hospital head cases?',
      },
      {
        dates: 'Apr 1915–1916',
        title: 'Chlorine & Phosgene Attacks',
        bullets: [
          'Chlorine gas Ypres (1915)',
          'Phosgene suffocation gas',
          'Urine-soaked pad protection',
        ],
        focusClue: 'How did the rapid evolution of chemical respirators counter suffocating gases?',
      },
      {
        dates: '1916–1918',
        title: 'Mustard Gas & Box Respirators',
        bullets: [
          'Mustard blistering agent (1917)',
          'Persistent chemical soil vapour',
          'Small Box Respirator',
        ],
        focusClue: 'Why was mustard gas far harder to counter than chlorine or phosgene?',
      },
    ],
  },
  {
    lessonIndex: 23,
    lessonNum: 4,
    id: 'lesson_5_4',
    keyTopicBadge: 'KEY TOPIC 5.4',
    title: 'KT5.4: The Chain of Evacuation: Stretcher Bearers, RAP, Dressing Stations & CCS',
    enquiryQuestion:
      'How successfully did the Chain of Evacuation transport, triage, and treat mass battlefield casualties?',
    specAnchor:
      'The work of the RAMC and FANY: the Chain of Evacuation (stretcher bearers, Regimental Aid Posts, Field Ambulances and Dressing Stations, Casualty Clearing Stations, Base Hospitals); triage systems; transport methods (motor ambulances, ambulance trains, canal barges).',
    sourceIndex: 0,
    sourceBadge: 'SOURCE A',
    sourceSubtitle: 'Contemporary Photographic Evidence • Western Front',
    sourceDate: 'August 1917',
    q1Features: {
      a: {
        q: 'Describe one feature of the triage system used at Casualty Clearing Stations on the Western Front.',
        hint: 'Identify one category of casualty at the CCS and explain how medical staff prioritised treatment.',
      },
      b: {
        q: 'Describe one feature of the work of the First Aid Nursing Yeomanry (FANY) on the Western Front.',
        hint: 'Identify one role carried out by FANY volunteers and describe their work near the front line.',
      },
    },
    tariff: 'Question 2(b): Follow-Up Enquiry Table [4 marks &bull; 5 mins]',
    examStem:
      'Study Source A. How could you follow up Source A to find out more about the difficulties stretcher bearers faced evacuating casualties from the Western Front? [4 marks]',
    q2bData: {
      sourceLetter: 'A',
      detailPrompt:
        'A team of six stretcher bearers struggling through deep, liquid mud to evacuate a wounded soldier on a wooden stretcher near Boesinghe.',
      questionPrompt:
        'What was the average time taken to evacuate a casualty from the frontline sap to the RAP and Dressing Station during the Third Battle of Ypres?',
      sourceTypePrompt:
        'RAMC Battalion Medical Officer war diaries and Field Ambulance stretcher bearer logs from the Ypres sector in autumn 1917.',
      helpPrompt:
        'This would reveal exact transport durations, bearer casualty rates, and whether delays caused fatal haemorrhagic shock.',
    },
    connectives:
      'A key detail to follow up is... &bull; The question I would ask is... &bull; The specific historical source type needed is... &bull; This source would help answer my question because...',
    wordBank:
      'RAMC &bull; FANY &bull; Regimental Aid Post &bull; Advanced Dressing Station &bull; Casualty Clearing Station &bull; Base Hospital &bull; triage system &bull; motor ambulance &bull; hospital train &bull; canal barge',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT5.4 on Pages 2–3: map stretcher bottlenecks and Somme casualties (left) against RAP, ADS, CCS triage, and FANY transport (right).',
    leftPageQuip:
      'The Regimental Aid Post: 200 yards from the German front line, lit by candle-ends, and smelling entirely of iodine and panic.',
    rightPageQuip:
      'Motor ambulances: Guaranteed to rattle every uninjured bone in your body while speeding you to the Casualty Clearing Station.',
    linedLeftQuip:
      'From Stretcher Bearer to RAP, ADS, and CCS: the 1917 evacuation chain prioritized speed to combat wound sepsis.',
    linedRightQuip:
      'Casualty Clearing Stations performed triage and emergency abdominal surgery before infection overwhelmed damaged organs.',
    stages: [
      {
        dates: '1914–1918',
        title: 'Stretcher Bearers & RAP',
        bullets: [
          'Four-man stretcher teams',
          'Regimental Aid Post (RAP)',
          'First aid & tourniquets',
        ],
        focusClue:
          'Why was rapid evacuation by stretcher bearers vital to prevent irreversible shock?',
      },
      {
        dates: '1914–1918',
        title: 'Field Ambulances & ADS/MDS',
        bullets: [
          'Advanced Dressing Stations (ADS)',
          'Field Ambulance RAMC',
          'Tetanus anti-toxin serum',
        ],
        focusClue: 'What was the tactical role of Dressing Stations in preventing CCS congestion?',
      },
      {
        dates: '1914–1918',
        title: 'CCS & The Triage System',
        bullets: [
          'Casualty Clearing Station (CCS)',
          'Three-tier triage sorting',
          'Immediate life-saving surgery',
        ],
        focusClue: 'How did the 3-tier triage system maximize survival during mass offensives?',
      },
      {
        dates: '1914–1918',
        title: 'Base Hospitals on French Coast',
        bullets: [
          'Coastal Base Hospitals',
          'Boulogne & Étaples centres',
          'Specialised surgery & convalescence',
        ],
        focusClue: 'Why were Base Hospitals situated near major coastal rail terminals and ports?',
      },
      {
        dates: '1914–1918',
        title: 'Motor Ambulances & Barges',
        bullets: [
          'Horse-drawn ambulance delays',
          'Motor ambulances introduced',
          'Canal barges head-trauma',
        ],
        focusClue: 'Why were canal barges preferred over trains for head and chest trauma?',
      },
    ],
  },
  {
    lessonIndex: 24,
    lessonNum: 5,
    id: 'lesson_5_5',
    keyTopicBadge: 'KEY TOPIC 5.5',
    title: 'KT5.5: Surgical Breakthroughs: The Thomas Splint, Wound Debridement & Mobile X-Rays',
    enquiryQuestion:
      'Why were the Thomas Splint, debridement, and mobile X-rays decisive surgical breakthroughs?',
    specAnchor:
      'Medical advances on the Western Front: the Thomas Splint (Hugh Owen Thomas, Robert Jones) reducing compound femur mortality; wound debridement and delayed primary closure; the Carrel-Dakin antiseptic irrigation method; mobile X-ray units and radiology.',
    sourceIndex: 0,
    sourceBadge: 'SOURCE A',
    sourceSubtitle: 'Contemporary Medical Artifact • Standard Issue',
    sourceDate: 'c.1916',
    q1Features: {
      a: {
        q: 'Describe one feature of the Thomas Splint used on the Western Front.',
        hint: "Identify one part of the splint's design and explain how it supported the injured leg.",
      },
      b: {
        q: 'Describe one feature of the Carrel-Dakin method of treating infected wounds.',
        hint: 'Identify one feature of how the chemical solution was delivered into deep wounds.',
      },
    },
    tariff: 'Question 2(a): Source Utility Assessment [8 marks &bull; 10 mins]',
    examStem:
      'Study Source A. How useful is Source A for an enquiry into the methods used to treat wounded soldiers with fractured limbs on the Western Front? Explain your answer, using Source A and your knowledge of the historical context. [8 marks]',
    provenanceClue:
      'Consider the nature of an authentic instructional photograph taken in an RAMC military hospital training ward c.1916. What does it demonstrate about mechanical traction and splinting, and why might an instructional training photograph differ from emergency frontline conditions in a mud dugout?',
    structureStrip: [
      {
        col: '1. CONTENT & UTILITY',
        text: 'Explain how Source A illustrates the Thomas Splint: groin ring, steel framework, and traction cord pulling the leg taut to prevent bone grinding.',
      },
      {
        col: '2. PROVENANCE & TONE',
        text: 'Evaluate the photograph: produced for medical training manuals, demonstrating correct surgical application under clean, controlled conditions.',
      },
      {
        col: '3. CONTEXT & LIMITS',
        text: 'Cross-reference with knowledge: Robert Jones 1915, 80% down to 20% mortality; note limitations—photograph cannot convey agony or muddy dugout application.',
      },
    ],
    connectives:
      'Source A is useful for an enquiry into this topic because... &bull; Specifically, the source demonstrates that... &bull; In terms of provenance, considering the contemporary context... &bull; However, the utility is limited because... &bull; Therefore...',
    wordBank:
      'Thomas Splint &bull; Hugh Owen Thomas &bull; Robert Jones &bull; compound fracture &bull; femoral artery &bull; mechanical traction &bull; wound debridement &bull; Carrel-Dakin solution &bull; delayed primary closure &bull; mobile X-ray unit',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT5.5 on Pages 2–3: map compound femur fractures and deep sepsis (left) against the Thomas Splint, Carrel-Dakin, and mobile X-rays (right).',
    leftPageQuip:
      'The Thomas Splint: Before Robert Jones introduced it, an 80% chance of death; after Jones, an 80% chance of living to complain about the food.',
    rightPageQuip:
      'Carrel-Dakin solution: If it burns like liquid fire and smells like a Victorian washhouse, congratulations—it is killing the gas gangrene.',
    linedLeftQuip:
      'The Thomas Splint immobilized compound femur fractures; mortality dropped from 80% to 20% in two years.',
    linedRightQuip:
      'Mobile X-ray units located shrapnel; Carrel-Dakin saline irrigation prevented anaerobic gas gangrene in massive wounds.',
    stages: [
      {
        dates: '1914–1918',
        title: 'Wound Debridement & Excision',
        bullets: [
          'Wound surgical debridement',
          'Dead tissue excision',
          'Delayed primary closure',
        ],
        focusClue:
          'Why was surgical excision of dead tissue more effective than chemical antiseptics?',
      },
      {
        dates: '1915–1918',
        title: 'Carrel-Dakin Antiseptic Flush',
        bullets: [
          'Carrel-Dakin antiseptic irrigation',
          'Sodium hypochlorite bleach',
          'Rubber perfusion tubes',
        ],
        focusClue:
          'How did continuous chemical irrigation solve the problem of deep wound infection?',
      },
      {
        dates: 'Dec 1915–1916',
        title: 'The Thomas Splint Breakthrough',
        bullets: [
          'Thomas splint (1915)',
          'Compound femur traction',
          'Mortality reduced (80% to 20%)',
        ],
        focusClue: 'How did rigid traction prevent fatal haemorrhage and shock from broken femurs?',
      },
      {
        dates: '1914–1918',
        title: 'Mobile X-Rays & Marie Curie',
        bullets: [
          'Mobile radiographic vans',
          'Van dynamo generators',
          'Locating embedded shrapnel',
        ],
        focusClue: 'Why was locating shrapnel on an X-ray vital before operating on gas gangrene?',
      },
      {
        dates: '1914–1918',
        title: 'X-Ray Limits in Combat',
        bullets: [
          'Fragile vacuum tubes',
          'Overheating radiation limits',
          'Undetected cloth fragments',
        ],
        focusClue:
          'Why did undetected cloth fragments remain the primary cause of post-op gangrene?',
      },
    ],
  },
  {
    lessonIndex: 25,
    lessonNum: 6,
    id: 'lesson_5_6',
    keyTopicBadge: 'KEY TOPIC 5.6',
    title: 'KT5.6: Lifesaving Innovations: Blood Storage, Brain Surgery & Plastic Reconstruction',
    enquiryQuestion:
      'How did stored blood banks, specialized neurosurgery, and plastic reconstruction transform wartime survival?',
    specAnchor:
      'Medical advances on the Western Front: blood transfusions and storage (Landsteiner, Hustin, Rous and Turner, Captain Oswald Robertson and the Cambrai blood bank); specialized neurosurgery (Harvey Cushing); plastic and facial reconstruction (Harold Gillies, Queen’s Hospital Sidcup, tubed pedicle).',
    sourceIndex: 0,
    sourceBadge: 'SOURCE A',
    sourceSubtitle: 'Primary Medical Artifact • Cambrai Blood Depot',
    sourceDate: '1917',
    q1Features: {
      a: {
        q: 'Describe one feature of Harvey Cushing’s surgical techniques in operating on head wounds on the Western Front.',
        hint: 'Identify one surgical technique used by Cushing and explain how it improved patient survival.',
      },
      b: {
        q: 'Describe one feature of the surgical methods used by Harold Gillies at Queen’s Hospital, Sidcup.',
        hint: 'Identify one method used by Gillies and explain how it helped reconstruct facial injuries.',
      },
    },
    tariff: 'Question 2(b): Follow-Up Enquiry Table [4 marks &bull; 5 mins]',
    examStem:
      'Study Source A. How could you follow up Source A to find out more about the success of stored blood transfusions at the Battle of Cambrai in 1917? [4 marks]',
    q2bData: {
      sourceLetter: 'A',
      detailPrompt:
        'Captain Oswald Robertson’s portable blood storage chest and glass transfusion bottles packed in ice.',
      questionPrompt:
        'What percentage of severely shocked casualties survived after receiving stored blood transfusions at Cambrai?',
      sourceTypePrompt:
        'RAMC Third Army medical report and clinical case records authored by Captain Oswald Robertson in November 1917.',
      helpPrompt:
        'This would provide empirical survival data comparing outcomes of refrigerated citrated blood versus direct donor transfusions.',
    },
    connectives:
      'A key detail to follow up is... &bull; The question I would ask is... &bull; The specific historical source type needed is... &bull; This source would help answer my question because...',
    wordBank:
      'Karl Landsteiner &bull; ABO blood groups &bull; sodium citrate (Hustin 1914) &bull; glucose preservative (Rous & Turner 1916) &bull; Oswald Robertson &bull; Battle of Cambrai (1917) &bull; blood depot &bull; Harvey Cushing &bull; silver clips &amp; surgical magnets &bull; Harold Gillies &bull; Queen’s Hospital Sidcup &bull; tubed pedicle graft',
    timelineMission:
      'Open the Consolidate Station in the app and branch out KT5.6 on Pages 2–3: map blood loss and facial trauma (left) against Robertson’s Cambrai Blood Depot, Cushing, and Gillies’ grafts (right).',
    leftPageQuip:
      "Robertson's Blood Depot: Ice chests, sodium citrate, and refrigerated blood at Cambrai—proof that cold beer isn't the only thing worth chilling.",
    rightPageQuip:
      'Harold Gillies at Sidcup: Turning shattered faces into men again with tubed pedicle skin grafts, while patients politely pretended not to notice.',
    linedLeftQuip:
      'Oswald Robertson stored blood in iced chests with sodium citrate and glucose at Cambrai in 1917, saving dying men from shock.',
    linedRightQuip:
      'At Queen’s Hospital Sidcup, Harold Gillies designed pedicle skin tubes to reconstruct faces shattered by artillery shrapnel.',
    stages: [
      {
        dates: '1914–1915',
        title: 'Sodium Citrate & Clotting',
        bullets: [
          'Richard Lewisohn sodium citrate',
          'Uncoupled indirect transfusion',
          'Preventing blood clotting',
        ],
        focusClue:
          'How did sodium citrate liberate blood transfusion from donor-to-patient tubing?',
      },
      {
        dates: '1916–1917',
        title: 'Citrate-Glucose Blood Storage',
        bullets: [
          'Rous & Turner citrate-glucose',
          'Stored refrigerated blood',
          'Four-week viability window',
        ],
        focusClue: 'Why was glucose addition essential to prevent red blood cell breakdown?',
      },
      {
        dates: 'Nov 1917',
        title: 'Cambrai Blood Bank Depot',
        bullets: [
          'Oswald Robertson (1917)',
          'Cambrai blood depot',
          'Type O universal donors',
        ],
        focusClue: 'Why did pre-stored blood transform surgical survival during surprise assaults?',
      },
      {
        dates: '1917–1918',
        title: 'Harvey Cushing’s Brain Surgery',
        bullets: [
          'Harvey Cushing neurosurgery',
          'Local anaesthetic brain operations',
          'Magnet shrapnel extraction',
        ],
        focusClue: 'Why was local anaesthesia superior to general anaesthetic in head trauma?',
      },
      {
        dates: '1917–1918',
        title: 'Harold Gillies at Sidcup',
        bullets: [
          'Harold Gillies Sidcup (1917)',
          'Queen\'s Hospital facial surgery',
          'Tubed pedicle skin grafting',
        ],
        focusClue:
          'How did the tubed pedicle technique prevent skin grafts from rotting and dying?',
      },
    ],
  },
];

// ============================================================================
// HELPER: RENDER ENVIRONMENTAL INQUIRY SPINE PAGE (PAGE 1 OF LESSON)
// ============================================================================
function renderWfSpinePage(cfg, pageNum) {
  const { keyTopicBadge, enquiryQuestion, specAnchor, stages, leftPageQuip } = cfg;

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
  <!-- LESSON ENVIRONMENTAL INQUIRY NOTEBOOK (PAGE ${pageNum})            -->
  <!-- ------------------------------------------------------------------ -->
  <div class="page page-container verso-page" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <!-- Lesson Header with Inquiry Question Title -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 2px;">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; border: 1.2px solid #000000; padding: 1.5px 7px; border-radius: 2px;">
                ${keyTopicBadge} &bull; ENVIRONMENTAL INQUIRY NOTEBOOK
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; color: #000000;">
                EDEXCEL GCSE (9–1) HISTORY &bull; PAPER 1 SECTION A
              </span>
            </div>
            <h2 style="font-family: 'Playfair Display', serif; font-size: 11.5pt; color: #000000; margin: 1px 0 1px 0; font-weight: 900; line-height: 1.18;">
              ${enquiryQuestion}
            </h2>
          </div>
          ${renderVersoLessonQr({ unitId: 'edexcel_medicine', lessonId: cfg.id })}
        </div>

        <!-- Chronological Inquiry Spine & Note-Taking Canvas -->
        <div style="flex: 1; display: flex; flex-direction: column; min-height: 0; margin-top: 2px;">
          <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 0;">
            ${stagesHtml}
          </div>
        </div>
      </div>

      ${renderFooterStrip(pageNum, leftPageQuip, 28)}
    </div>
  </div>`;
}

function renderWfExamQuestionPage(cfg, pageNum, primarySource, b64Img) {
  const isQ2a = cfg.tariff.includes('2(a)');

  let writingAreaHtml = '';
  if (isQ2a) {
    const linesHtml = Array.from(
      { length: 14 },
      () => '<div class="task-line" style="height: 7.2mm;"></div>',
    ).join('');
    writingAreaHtml = `
      <!-- Question 2(a) Ruled Writing Lines (14 Lines) -->
      <div style="font-family: 'Inter', sans-serif; font-size: 7pt; font-style: italic; color: #222222; margin: 2px 0 1px 0; display: flex; justify-content: space-between;">
        <span><strong>Write your response to Question 2(a) in the space provided below:</strong></span>
        <span style="font-size: 6.6pt; color: #555555;">(Response continues on facing page &rarr;)</span>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; margin: 1px 0 2px 0;">
        ${linesHtml}
      </div>
    `;
  } else {
    const q2bCommentaryLines = Array.from(
      { length: 5 },
      () => '<div class="task-line" style="height: 7.2mm;"></div>',
    ).join('');
    writingAreaHtml = `
      <!-- Question 2(b) 4-Prompt Follow-Up Matrix [4 marks] -->
      <div style="font-family: 'Inter', sans-serif; font-size: 7pt; font-style: italic; color: #222222; margin: 2px 0 1px 0; display: flex; justify-content: space-between;">
        <span><strong>Complete the 4-prompt historical enquiry matrix below:</strong></span>
        <span style="font-size: 6.6pt; color: #555555;">(Response continues on facing page &rarr;)</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #000000; font-family: 'Inter', sans-serif; font-size: 6.7pt; margin-bottom: 2px;">
        <tbody>
          <tr style="border-bottom: 1.2px solid #000000;">
            <td style="width: 38%; padding: 2.5px 5px; font-weight: 800; background: #f9f9f9; border-right: 1.2px solid #000000; vertical-align: top;">
              Detail in Source ${cfg.q2bData.sourceLetter} that I would follow up:
            </td>
            <td style="padding: 2px 4px;">
              <div class="task-line" style="height: 6.5mm;"></div>
              <div class="task-line" style="height: 6.5mm;"></div>
            </td>
          </tr>
          <tr style="border-bottom: 1.2px solid #000000;">
            <td style="padding: 2.5px 5px; font-weight: 800; background: #f9f9f9; border-right: 1.2px solid #000000; vertical-align: top;">
              Question I would ask:
            </td>
            <td style="padding: 2px 4px;">
              <div class="task-line" style="height: 6.5mm;"></div>
              <div class="task-line" style="height: 6.5mm;"></div>
            </td>
          </tr>
          <tr style="border-bottom: 1.2px solid #000000;">
            <td style="padding: 2.5px 5px; font-weight: 800; background: #f9f9f9; border-right: 1.2px solid #000000; vertical-align: top;">
              Type of source I would use:
            </td>
            <td style="padding: 2px 4px;">
              <div class="task-line" style="height: 6.5mm;"></div>
              <div class="task-line" style="height: 6.5mm;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 2.5px 5px; font-weight: 800; background: #f9f9f9; border-right: 1.2px solid #000000; vertical-align: top;">
              How this would help me find out more:
            </td>
            <td style="padding: 2px 4px;">
              <div class="task-line" style="height: 6.5mm;"></div>
              <div class="task-line" style="height: 6.5mm;"></div>
            </td>
          </tr>
        </tbody>
      </table>
      <div style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 700; color: #444444; margin: 1px 0;">
        Disciplinary Commentary &bull; Clinical Justification of Chosen Source Type:
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; margin: 0 0 2px 0;">
        ${q2bCommentaryLines}
      </div>
    `;
  }

  return `
  <!-- ------------------------------------------------------------------ -->
  <!-- LESSON EXAM QUESTION & SOURCE INVESTIGATION (PAGE ${pageNum})      -->
  <!-- ------------------------------------------------------------------ -->
  <div class="page page-container recto-page" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <!-- Running Header -->
        <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; border: 1.2px solid #000000; padding: 1.5px 7px; border-radius: 2px;">
              ${cfg.keyTopicBadge} &bull; SECTION A EXAM PRACTICE
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; text-transform: uppercase; color: #000000;">
              EDEXCEL GCSE (9–1) HISTORY &bull; PAPER 1 SECTION A
            </span>
          </div>
          <h2 style="font-family: 'Playfair Display', serif; font-size: 11pt; color: #000000; margin: 1px 0; font-weight: 900; line-height: 1.15;">
            ${cfg.tariff}
          </h2>
        </div>

        <!-- Primary Archival Source Investigation Box (Compact, Base64 Inlined) -->
        <div style="border: 1.5px solid #000000; border-radius: 3px; padding: 3px 5px; background: #ffffff; margin-bottom: 3px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase; color: #000000;">
              ${cfg.sourceBadge} &bull; ${cfg.sourceSubtitle}
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; color: #333333;">
              ORIGIN: ${cfg.sourceDate}
            </span>
          </div>
          <div style="display: flex; gap: 7px; align-items: center;">
            <div style="width: 42mm; height: 30mm; border: 1px solid #000000; border-radius: 2px; overflow: hidden; flex-shrink: 0; background: #f0f0f0;">
              <img src="${b64Img}" alt="${primarySource.caption || 'Primary Source Evidence'}" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); display: block;">
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; height: 30mm;">
              <div style="font-family: 'Georgia', serif; font-size: 7pt; line-height: 1.25; color: #000000;">
                ${primarySource.caption || 'Official photographic and archival evidence documenting medical facilities and conditions in the British sector of the Western Front.'}
              </div>
              <div style="border-top: 1px dashed #000000; padding-top: 2px; font-family: 'Inter', sans-serif; font-size: 6.2pt; color: #333333; line-height: 1.15;">
                <strong>Historical Provenance:</strong> ${primarySource.provenance || 'Imperial War Museum / Contemporary Photographic Record (1914–1918).'}
              </div>
            </div>
          </div>
        </div>

        <!-- Question Stem & Strategy Box -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 3px 6px; background: #ffffff; margin-bottom: 3px;">
          <div style="font-family: 'Playfair Display', serif; font-size: 8.2pt; font-weight: 800; color: #000000; margin-bottom: 2px; line-height: 1.2;">
            ${cfg.examStem}
          </div>
          <div style="background: #f4f4f4; border-left: 2.5px solid #000000; padding: 2px 5px; font-family: 'Inter', sans-serif; font-size: 6.6pt; line-height: 1.15;">
            ${
              isQ2a
                ? `<strong>Provenance Clue:</strong> ${cfg.provenanceClue}`
                : `<strong>Examiner Strategy:</strong> Follow up an exact quotation or visual detail. Your question must directly target your chosen detail. Your named source type must be authentic and specific (e.g. RAMC casualty returns, battalion war diaries).`
            }
          </div>
        </div>

        <!-- Analytical Connectives (Full Width Scaffolding Standard) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 2.5px 6px; background: #ffffff; margin-bottom: 3px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 6.8pt; text-transform: uppercase; display: inline-block; margin-right: 4px; color: #000000;">Analytical Connectives:</strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.4pt; font-style: italic; color: #222222; line-height: 1.2;">${cfg.connectives}</span>
        </div>
      </div>

      <!-- Writing / Answering Area -->
      ${writingAreaHtml}

      <!-- Timeline Mission Box -->
      <div style="border: 1.5px solid #000000; border-radius: 3px; padding: 3px 6px; background: #ffffff; display: flex; justify-content: space-between; align-items: center; margin-top: 2px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5px; border-radius: 2px; text-transform: uppercase; white-space: nowrap;">
            Mind-Map Mission
          </span>
          <span style="font-family: 'Georgia', serif; font-size: 7.2pt; line-height: 1.2; color: #000000;">
            ${cfg.timelineMission}
          </span>
        </div>
        <div style="border: 1.2px solid #000000; border-radius: 2px; padding: 1.5px 5px; font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; white-space: nowrap;">
          [ &nbsp;&nbsp; ] Done
        </div>
      </div>

      ${renderFooterStrip(pageNum, cfg.rightPageQuip, 28)}
    </div>
  </div>`;
}

// ============================================================================
// HELPER: RENDER OFFICIAL EXAM CONTINUATION PAGE (PAGE 3 OF LESSON)
// ============================================================================
function renderWfExamContinuationPage(cfg, pageNum) {
  const continuationTaskLines = Array.from(
    { length: 31 },
    () => '<div class="task-line" style="height: 7.3mm;"></div>',
  ).join('');

  return `
  <!-- ------------------------------------------------------------------ -->
  <!-- LESSON OFFICIAL EXAM CONTINUATION (PAGE ${pageNum})                -->
  <!-- ------------------------------------------------------------------ -->
  <div class="page page-container verso-page" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <!-- Running Header -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3px;">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 10.5pt; color: #000000; margin: 0; font-weight: 800;">
            ${cfg.title}
          </h2>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            ${cfg.tariff.split(':')[0]} Continued
          </span>
        </div>

        <div style="font-family: 'Inter', sans-serif; font-size: 7pt; font-style: italic; color: #333333; margin-bottom: 2px; display: flex; justify-content: space-between;">
          <span>Continue your response to ${cfg.tariff.split(':')[0]} below:</span>
          <span style="font-size: 6.6pt; color: #666666;">(Concludes on next page &rarr;)</span>
        </div>
      </div>

      <!-- 31 Uninterrupted Ruled Writing Lines -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; margin: 1px 0 2px 0;">
        ${continuationTaskLines}
      </div>

      ${renderFooterStrip(pageNum, cfg.linedLeftQuip, 28)}
    </div>
  </div>`;
}

// ============================================================================
// HELPER: RENDER OFFICIAL EXAM SYNTHESIS & QUESTION 1 FEATURES (PAGE 4)
// ============================================================================
function renderWfExamSynthesisAndFeaturesPage(cfg, pageNum) {
  const conclusionTaskLines = Array.from(
    { length: 24 },
    () => '<div class="task-line" style="height: 7.3mm;"></div>',
  ).join('');

  return `
  <!-- ------------------------------------------------------------------ -->
  <!-- LESSON SYNTHESIS & QUESTION 1 FEATURE DRILLS (PAGE ${pageNum})      -->
  <!-- ------------------------------------------------------------------ -->
  <div class="page page-container recto-page" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div>
        <!-- Running Header -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 3px;">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 10.5pt; color: #000000; margin: 0; font-weight: 800;">
            ${cfg.title}
          </h2>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            Assessment Synthesis &amp; Question 1 Feature Drills
          </span>
        </div>

        <div style="font-family: 'Inter', sans-serif; font-size: 7pt; font-style: italic; color: #333333; margin-bottom: 2px;">
          Final analytical evaluation &amp; concluding historical verdict for ${cfg.tariff.split(':')[0]}:
        </div>
      </div>

      <!-- 15 Ruled Writing Lines for Sustained Analysis & Final Verdict -->
      <div style="display: flex; flex-direction: column; margin: 1px 0 4px 0;">
        ${conclusionTaskLines}
      </div>

      <!-- Question 1 Feature Drills [2 x 2 = 4 marks] Strictly 2 Lines per Feature -->
      <div style="border: 1.5px solid #000000; border-radius: 3px; padding: 4px 6px; background: #ffffff; margin-top: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.2px solid #000000; padding-bottom: 2px; margin-bottom: 3px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.6pt; text-transform: uppercase; letter-spacing: 0.5px;">
            &bull; Edexcel Section A: Question 1 Feature Drills [4 marks &bull; 5 mins]
          </strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; border: 1px solid #000000; padding: 0 5px; border-radius: 2px;">
            2 SEPARATE QUESTIONS &bull; 2 MARKS EACH
          </span>
        </div>
        <div style="background: #f4f4f4; border-left: 2.5px solid #000000; padding: 2px 5px; font-family: 'Inter', sans-serif; font-size: 6.4pt; line-height: 1.15; margin-bottom: 4px;">
          <strong>Examiner Mark Scheme:</strong> Award 1 mark for identifying a valid historical feature + 1 mark for supporting factual detail. Supporting detail must directly develop the named feature.
        </div>

        <!-- 1(a) Response Area: STRICTLY 2 LINES (1 Feature, 1 Detail) -->
        <div style="margin-bottom: 4px; border-bottom: 1px dashed #cccccc; padding-bottom: 3px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px;">
            <span style="font-family: 'Playfair Display', serif; font-size: 7.8pt; font-weight: 800; color: #000000;">
              1(a) ${cfg.q1Features.a.q}
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 800;">[ &nbsp;&nbsp; <strong>/ 2</strong> ]</span>
          </div>
          <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 800; text-transform: uppercase; width: 14mm;">Feature:</span>
            <div style="flex: 1; border-bottom: 1.2px solid #000000; height: 7.0mm;"></div>
          </div>
          <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 800; text-transform: uppercase; width: 14mm;">Detail:</span>
            <div style="flex: 1; border-bottom: 1.2px solid #000000; height: 7.0mm;"></div>
          </div>
        </div>

        <!-- 1(b) Response Area: STRICTLY 2 LINES (1 Feature, 1 Detail) -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px;">
            <span style="font-family: 'Playfair Display', serif; font-size: 7.8pt; font-weight: 800; color: #000000;">
              1(b) ${cfg.q1Features.b.q}
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 800;">[ &nbsp;&nbsp; <strong>/ 2</strong> ]</span>
          </div>
          <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 800; text-transform: uppercase; width: 14mm;">Feature:</span>
            <div style="flex: 1; border-bottom: 1.2px solid #000000; height: 7.0mm;"></div>
          </div>
          <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 6.5pt; font-weight: 800; text-transform: uppercase; width: 14mm;">Detail:</span>
            <div style="flex: 1; border-bottom: 1.2px solid #000000; height: 7.0mm;"></div>
          </div>
        </div>
      </div>

      ${renderFooterStrip(pageNum, cfg.linedRightQuip, 28)}
    </div>
  </div>`;
}
// ============================================================================
// HELPER: RENDER EXPANDED ASSESSMENT RECORD & BACK COVER (PAGE 28)
// ============================================================================
function renderWfBackCover(cfgList, quipText) {
  const assessmentRows = [
    {
      enquiry: 'KT5.1',
      title: 'Trench Geography & Battles',
      q1: '<strong>Q1:</strong> Describe Two Features of Trenches / Arras [4m]',
      p1: 'p. 7',
      max1: 4,
      q2: '<strong>Q2(a):</strong> Source Utility Assessment (Trench Design) [8m]',
      p2: 'p. 5–7',
      max2: 8,
    },
    {
      enquiry: 'KT5.2',
      title: 'Trench Environment & Illnesses',
      q1: '<strong>Q1:</strong> Describe Two Features of Trench Foot / Fever [4m]',
      p1: 'p. 11',
      max1: 4,
      q2: '<strong>Q2(b):</strong> 4-Prompt Follow-Up Matrix (Living Conditions) [4m]',
      p2: 'p. 9–11',
      max2: 4,
    },
    {
      enquiry: 'KT5.3',
      title: 'Trauma, Shrapnel & Gas Attacks',
      q1: '<strong>Q1:</strong> Describe Two Features of Shrapnel / Poison Gas [4m]',
      p1: 'p. 15',
      max1: 4,
      q2: '<strong>Q2(a):</strong> Source Utility Assessment (Artillery Trauma) [8m]',
      p2: 'p. 13–15',
      max2: 8,
    },
    {
      enquiry: 'KT5.4',
      title: 'The Evacuation Chain & Transport',
      q1: '<strong>Q1:</strong> Describe Two Features of Dressing Station / FANY [4m]',
      p1: 'p. 19',
      max1: 4,
      q2: '<strong>Q2(b):</strong> 4-Prompt Follow-Up Matrix (Stretcher Transport) [4m]',
      p2: 'p. 17–19',
      max2: 4,
    },
    {
      enquiry: 'KT5.5',
      title: 'Splints, Antiseptics & Mobile X-Rays',
      q1: '<strong>Q1:</strong> Describe Two Features of Thomas Splint / X-Rays [4m]',
      p1: 'p. 23',
      max1: 4,
      q2: '<strong>Q2(a):</strong> Source Utility Assessment (Mobile X-Rays) [8m]',
      p2: 'p. 21–23',
      max2: 8,
    },
    {
      enquiry: 'KT5.6',
      title: 'Blood Storage, Brain & Plastic Surgery',
      q1: '<strong>Q1:</strong> Describe Two Features of Cushing / Gillies Surgery [4m]',
      p1: 'p. 27',
      max1: 4,
      q2: '<strong>Q2(b):</strong> 4-Prompt Follow-Up Matrix (Cambrai Blood Bank) [4m]',
      p2: 'p. 25–27',
      max2: 4,
    },
  ];

  const tableBodyHtml = assessmentRows
    .map(
      (item) => `
      <!-- ${item.enquiry}: ${item.title} -->
      <tr style="border-bottom: 1px dashed #cbd5e1;">
        <td rowspan="2" style="padding: 10px 4px; text-align: center; font-weight: 900; font-size: 9pt; border-right: 1.2px solid #cbd5e1; background: #f0f4f9; color: #0f284e; vertical-align: middle;">
          ${item.enquiry}
        </td>
        <td style="padding: 10px 8px; font-weight: 600; line-height: 1.35; border-right: 1.2px solid #cbd5e1; font-size: 7.8pt; color: #0f284e;">
          ${item.q1}
        </td>
        <td style="padding: 10px 4px; text-align: center; font-weight: 800; font-size: 8pt; border-right: 1.2px solid #cbd5e1; white-space: nowrap; color: #0f284e;">
          ${item.p1}
        </td>
        <td style="padding: 10px 4px; text-align: center; font-size: 9pt; font-weight: 900; border-right: 1.2px solid #cbd5e1; white-space: nowrap; color: #0f284e;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / ${item.max1}
        </td>
        <td rowspan="2" style="padding: 6px 8px; vertical-align: top; font-size: 7pt; background: #ffffff;">
          <div style="font-family: 'Inter', sans-serif; font-size: 6pt; color: #475569; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">
            Marking Feedback &bull; Targets:
          </div>
          <div style="display: flex; flex-direction: column; justify-content: space-around; height: 18.5mm;">
            <div style="border-bottom: 1px dotted #cbd5e1; height: 4.5mm;"></div>
            <div style="border-bottom: 1px dotted #cbd5e1; height: 4.5mm;"></div>
            <div style="border-bottom: 1px dotted #cbd5e1; height: 4.5mm;"></div>
            <div style="border-bottom: 1px dotted #cbd5e1; height: 4.5mm;"></div>
          </div>
        </td>
      </tr>
      <tr style="border-bottom: 1.5px solid #0f284e;">
        <td style="padding: 10px 8px; font-weight: 600; line-height: 1.35; border-right: 1.2px solid #cbd5e1; font-size: 7.8pt; color: #0f284e;">
          ${item.q2}
        </td>
        <td style="padding: 10px 4px; text-align: center; font-weight: 800; font-size: 8pt; border-right: 1.2px solid #cbd5e1; white-space: nowrap; color: #0f284e;">
          ${item.p2}
        </td>
        <td style="padding: 10px 4px; text-align: center; font-size: 9pt; font-weight: 900; border-right: 1.2px solid #cbd5e1; white-space: nowrap; color: #0f284e;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / ${item.max2}
        </td>
      </tr>
    `,
    )
    .join('');

  return `
  <!-- ------------------------------------------------------------------ -->
  <!-- PAGE 28: OUTSIDE BACK COVER & EXPANDED ASSESSMENT RECORD           -->
  <!-- ------------------------------------------------------------------ -->
  <div class="page page-container" id="page-28" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      <!-- Top Departmental Branding -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f284e; padding-bottom: 3px; margin-bottom: 4px;">
        <div data-department-name="The History Department">
          <span style="font-family: 'Inter', sans-serif; font-size: 9.5pt; font-weight: 900; color: #0f284e; text-transform: uppercase; letter-spacing: 0.8px;">
            <span class="school-brand-target">The History Department</span>
          </span>
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; color: #0f284e;">
          KEY TOPIC 5 ASSESSMENT RECORD &bull; 6 CURRICULUM HOURS &bull; 1914–1918
        </div>
      </div>

      <!-- Student Target Grade Strip -->
      <div style="border: 1.5px solid #0f284e; border-radius: 4px; padding: 7px 12px; background: #ffffff; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; align-items: center; margin-bottom: 4px;">
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #0f284e; text-transform: uppercase; margin-right: 8px;">Pupil Name:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid #0f284e; height: 14px;"></div>
        </div>
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #0f284e; text-transform: uppercase; margin-right: 8px;">Target:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid #0f284e; height: 14px;"></div>
        </div>
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #0f284e; text-transform: uppercase; margin-right: 8px;">Current Grade:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid #0f284e; height: 14px;"></div>
        </div>
      </div>

      <!-- Expanded Key Topic 5 Assessment Record Table (12 Exam Tasks) -->
      <div style="border: 1.5px solid #0f284e; border-radius: 4px; overflow: hidden; margin-bottom: 4px;">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif;">
          <thead>
            <tr style="background: #0f284e; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">
              <th style="padding: 6px 4px; text-align: center; width: 8%; font-size: 7.2pt; font-weight: 800;">Enquiry</th>
              <th style="padding: 6px 8px; text-align: left; width: 42%; font-size: 7.2pt; font-weight: 800; border-left: 1px solid rgba(255,255,255,0.25);">Assessment Component Focus</th>
              <th style="padding: 6px 4px; text-align: center; width: 8%; font-size: 7.2pt; font-weight: 800; border-left: 1px solid rgba(255,255,255,0.25);">Page</th>
              <th style="padding: 6px 4px; text-align: center; width: 10%; font-size: 7.2pt; font-weight: 800; border-left: 1px solid rgba(255,255,255,0.25);">Score</th>
              <th style="padding: 6px 8px; text-align: left; width: 32%; font-size: 7.2pt; font-weight: 800; border-left: 1px solid rgba(255,255,255,0.25);">Teacher Comment &amp; Next Steps</th>
            </tr>
          </thead>
          <tbody>
            ${tableBodyHtml}
          </tbody>
        </table>
      </div>

      <!-- 6 Verified Micro-QR Codes with Dual QR (Lesson + Quiz) -->
      <div style="border: 1.5px solid #0f284e; border-radius: 4px; padding: 4px 6px; background: #f0f4f9;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 7.2pt; text-transform: uppercase; letter-spacing: 0.5px; color: #0f284e;">
            &bull; Digital Learning &amp; Retrieval Hub &bull; Interactive Lessons &amp; Quizzes
          </strong>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.6pt; font-weight: 700; color: #475569;">
            Interactive Textbook &bull; 10/20 Questions Per Enquiry
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px;">
          ${cfgList
            .map((cfg, idx) => {
              const lessonUrl = `https://the-history-revision-hub.netlify.app/?unit=edexcel_medicine&lesson=${cfg.id}&view=lessons`;
              const quizUrl = `https://the-history-revision-hub.netlify.app/?unit=edexcel_medicine&lesson=${cfg.id}&quiz=true`;
              const lessonQrSvg = generateQrSvg(lessonUrl);
              const quizQrSvg = generateQrSvg(quizUrl);
              const shortLabels = [
                'Trenches & Mud',
                'Trench Illness',
                'Trauma & Gas',
                'Evacuation Chain',
                'Splints & X-Rays',
                'Blood & Plastic',
              ];
              return `
          <div style="border: 1.2px solid #0f284e; border-radius: 3px; padding: 3px 2px; background: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: space-between;">
            <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; text-transform: uppercase; margin-bottom: 1px; color: #0f284e;">
              KT5.${cfg.lessonNum}
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 5.6pt; font-weight: 700; color: #475569; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
              ${shortLabels[idx]}
            </div>

            <!-- Top QR: Interactive Lesson Hub -->
            <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 3px; width: 100%;">
              <div style="width: 16.5mm; height: 16.5mm; margin: 0 auto 1px auto;">
                ${lessonQrSvg}
              </div>
              <span style="font-family: 'Inter', sans-serif; font-size: 5.2pt; font-weight: 800; text-transform: uppercase; background: #0f284e; color: #ffffff; padding: 1px 3px; border-radius: 2px; letter-spacing: 0.2px; white-space: nowrap;">
                Lesson Hub
              </span>
            </div>

            <!-- Bottom QR: Practice Quiz -->
            <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
              <div style="width: 16.5mm; height: 16.5mm; margin: 0 auto 1px auto;">
                ${quizQrSvg}
              </div>
              <span style="font-family: 'Inter', sans-serif; font-size: 5.2pt; font-weight: 800; text-transform: uppercase; background: #0f284e; color: #ffffff; padding: 1px 3px; border-radius: 2px; letter-spacing: 0.2px; white-space: nowrap;">
                Practice Quiz
              </span>
            </div>

            <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; color: #0f284e; margin-top: 2px; white-space: nowrap; border: 1px solid #0f284e; border-radius: 2px; padding: 1px 3px; background: #f0f4f9;">
              Score: [ &nbsp;&nbsp;&nbsp;&nbsp; <strong>/ 10</strong> ]
            </div>
          </div>
          `;
            })
            .join('')}
        </div>
      </div>

      ${renderFooterStrip(28, quipText, 28)}
    </div>
  </div>`;
}

// ============================================================================
// MAIN GENERATOR FUNCTION: 28-PAGE TWO-PAGE SPREAD WORKBOOK
// ============================================================================
function buildWesternFrontTwoPageWorkbook(unitData, period) {
  const lessons = unitData.lessons;

  // Resolve cover image base64
  const coverImgBase64 =
    getBase64Image('/images/stretcher_bearers_gilbert_rogers.jpg') ||
    getBase64Image('/units/edexcel_medicine/assets/authentic_western_front.jpg') ||
    '';

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Key Topic 5: The British Sector of the Western Front Workbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&display=swap" rel="stylesheet">
  <style>
    *, *:before, *:after { box-sizing: border-box; }
    /* Print Offset for Saddle-Stitch Booklet Binding (3mm alternating inner margin) */
    @page {
      size: A4 portrait;
      margin: 10mm 10mm 12mm 10mm;
    }
    @page:left {
      margin-top: 10mm;
      margin-bottom: 12mm;
      margin-left: 7mm;
      margin-right: 13mm; /* 3mm inner gutter on right for verso staple fold */
    }
    @page:right {
      margin-top: 10mm;
      margin-bottom: 12mm;
      margin-left: 13mm; /* 3mm inner gutter on left for recto staple fold */
      margin-right: 7mm;
    }
    body {
      font-family: 'Georgia', 'Garamond', serif;
      font-size: 8.5pt;
      line-height: 1.32;
      color: #000000;
      margin: 0;
      padding: 0;
      background: #ffffff;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    h1, h2, h3, h4, h5, h6, strong, th, .sans {
      font-family: 'Inter', -apple-system, sans-serif;
    }
    /* Page Container: Zero outer border, pure flex distribution for optimal page budget */
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
    /* Full flex section container for interior distribution */
    .page-body-full {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .spine-stage-row {
      display: flex;
      flex: 1;
      min-height: 0;
      align-items: stretch;
      margin: 0;
    }
    /* Clean Task Section Spacing */
    .task-section {
      margin-bottom: 5px;
      padding-bottom: 0;
    }
    .task-section-divider {
      border-bottom: 1.2px solid #000000;
      padding-bottom: 4px;
      margin-bottom: 4px;
    }
    /* Standard Handwriting Writing Lines */
    .spine-stage-block {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      margin-bottom: 2.5px;
      border: 1.2px solid #000000;
      border-radius: 2px;
      overflow: hidden;
      background: #ffffff;
    }
    .stage-banner {
      background: #000000;
      color: #ffffff;
      padding: 2px 7px;
      display: flex;
      align-items: center;
      border-bottom: 1.2px solid #000000;
      min-height: 20px;
      box-sizing: border-box;
    }
    .task-line {
      border-bottom: 1.2px solid #000000;
      height: 7.4mm;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }
    .task-line-dotted {
      border-bottom: 1.2px dotted #000000;
      height: 7.2mm;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }
    .ruled-lines-block {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin: 1px 0;
    }
    /* Clean Lined Paper Grid for Extended Writing Pages (Ruled lines across 100% width) */
    .lined-page-grid {
      display: flex;
      flex-direction: column;
      margin: 2px 0 3px 0;
      border-top: 1.2px solid #000000;
      width: 100%;
    }
    .lined-row {
      display: flex;
      align-items: center;
      width: 100%;
      height: 7.2mm;
      border-bottom: 1.2px solid #000000;
      box-sizing: border-box;
      padding-left: 2px;
      padding-right: 2px;
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
  // PAGE 1: FRONT COVER
  // ====================================================================
  html += `
  <div class="page page-container" id="page-1" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      
      <!-- Top Department & Specification Header Strip -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f284e; padding-bottom: 4px; margin-bottom: 6px;">
        <span data-department-name="The History Department" style="font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; color: #0f284e;">
          <span class="school-brand-target">The History Department</span> &bull; GCSE Revision Hub
        </span>
        <span style="font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 800; text-transform: uppercase; color: #0f284e;">
          Edexcel GCSE (9-1) History &bull; Paper 1 Section A
        </span>
      </div>

      <!-- Pupil Identification Card -->
      <div style="border: 1.5px solid #000; border-radius: 4px; padding: 5.5px 14px; background: #fff; margin-bottom: 3px;">
        <div style="display: grid; grid-template-columns: 2.2fr 1.1fr 1.3fr; gap: 18px; font-family: 'Inter', sans-serif; font-size: 8.0pt;">
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 50px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Name:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 46px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Class:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
          <div style="display: flex; align-items: baseline;">
            <strong style="text-transform: uppercase; width: 62px; font-size: 7.6pt; color: #000; font-weight: 800; letter-spacing: 0.5px;">Teacher:</strong>
            <div style="flex: 1; border-bottom: 1.4px solid #000; height: 15px;"></div>
          </div>
        </div>
      </div>

      <!-- Main Title Block -->
      <div style="text-align: center; margin: 2px 0 4px 0;">
        <div style="display: inline-block; border: 1.5px solid #0f284e; color: #0f284e; font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; padding: 1.5px 10px; border-radius: 3px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; background: #ffffff;">
          Key Topic 5 &bull; 6 Enquiry Hours &bull; 1914–1918
        </div>
        <h1 style="font-family: 'Playfair Display', serif; font-size: 20pt; line-height: 1.12; color: #0f284e; margin: 1px 0 1px 0; font-weight: 900;">
          The British Sector of the Western Front, 1914–1918
        </h1>
        <div style="font-family: 'Georgia', serif; font-size: 9.5pt; color: #334155; font-style: italic; font-weight: 600;">
          Injuries, Treatment and the Trenches in the British Sector
        </div>
      </div>

      <!-- Master Wide Photographic Plate -->
      <div style="margin: 2px 0 3px 0; border: 1.5px solid #0f284e; border-radius: 4px; overflow: hidden; background: #ffffff;">
        <div style="height: 94mm; background: #000000; display: flex; justify-content: center; align-items: center; overflow: hidden;">
          <img src="${coverImgBase64}" alt="Stretcher Bearers of the Royal Army Medical Corps (RAMC) Lifting a Wounded Man out of a Trench by Gilbert Rogers (c1919)" style="width: 100%; height: 100%; object-fit: cover; object-position: center 25%; display: block; filter: grayscale(100%) contrast(115%);">
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 7.0pt; color: #0f284e; padding: 3px 8px; border-top: 1.5px solid #0f284e; background: #ffffff;">
          <span><strong>Primary Visual Evidence:</strong> <em>Stretcher Bearers of the RAMC Lifting a Wounded Man out of a Trench</em> &bull; Gilbert Rogers (c. 1919)</span>
          <span style="font-weight: 700; color: #475569;">OFFICIAL EDEXCEL SOURCE ARCHIVE &bull; IWM ART 2485 / RAMC HISTORIC COLLECTION</span>
        </div>
      </div>

      <!-- Edexcel Paper 1 Section A Examination Targeting Matrix -->
      <div style="border: 1.4px solid #0f284e; border-radius: 4px; overflow: hidden; background: #ffffff; margin: 2px 0 3px 0;">
        <div style="background: linear-gradient(135deg, #0f284e 0%, #1e3a5f 100%); color: #ffffff; padding: 2.5px 8px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="background: #0284c7; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 6.2pt; font-weight: 900; padding: 1px 5px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.6px;">Exam Matrix</span>
            <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #f8fafc;">
              Edexcel Paper 1 Section A Examination Targeting Matrix &bull; Historic Environment [16 Marks &bull; 25 Mins]
            </span>
          </div>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.2pt; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
            Specification 1HI0/11
          </span>
        </div>
        <div style="padding: 4px 6px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; background: #f8fafc;">
          <!-- Card 1: Question 1 -->
          <div style="background: #ffffff; border: 1.2px solid #cbd5e1; border-top: 2.5px solid #0284c7; border-radius: 3px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
                <span style="background: #0f172a; color: #38bdf8; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; padding: 1px 5px; border-radius: 2px;">Q1 &bull; 4 MARKS</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #0369a1; text-transform: uppercase;">AO1 Historic Site</span>
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 7.3pt; font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 2px;">
                Describe Two Features of [Site Focus]
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; line-height: 1.24; color: #334155;">
                <strong>Format:</strong> Two distinct feature pairs (2m + 2m).<br>
                <strong>Rule:</strong> State 1 valid feature + add 1 specific supporting factual detail per feature (5 mins).
              </div>
            </div>
            <div style="margin-top: 3px; padding: 1.5px 4px; background: #e0f2fe; border-left: 2px solid #0284c7; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #0369a1;">
              Practice: In-Workbook Feature Drills
            </div>
          </div>
          <!-- Card 2: Question 2(a) -->
          <div style="background: #ffffff; border: 1.2px solid #cbd5e1; border-top: 2.5px solid #2563eb; border-radius: 3px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
                <span style="background: #0f172a; color: #60a5fa; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; padding: 1px 5px; border-radius: 2px;">Q2(a) &bull; 8 MARKS</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">AO3 Dual Source Utility</span>
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 7.3pt; font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 2px;">
                How Useful Are Sources A and B?
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; line-height: 1.24; color: #334155;">
                <strong>Format:</strong> Evaluate both sources systematically.<br>
                <strong>Rule:</strong> Assess Content detail, Provenance (Nature, Origin, Motive), and contextual accuracy (12 mins).
              </div>
            </div>
            <div style="margin-top: 3px; padding: 1.5px 4px; background: #eff6ff; border-left: 2px solid #2563eb; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #1e40af;">
              Practice: Dual-Source Utility Evaluation Pages
            </div>
          </div>
          <!-- Card 3: Question 2(b) -->
          <div style="background: #ffffff; border: 1.2px solid #cbd5e1; border-top: 2.5px solid #d97706; border-radius: 3px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
                <span style="background: #0f172a; color: #fbbf24; font-family: 'Inter', sans-serif; font-size: 6.4pt; font-weight: 900; padding: 1px 5px; border-radius: 2px;">Q2(b) &bull; 4 MARKS</span>
                <span style="font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #b45309; text-transform: uppercase;">AO3 Historical Enquiry</span>
              </div>
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 7.3pt; font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 2px;">
                4-Prompt Follow-Up Matrix
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.1pt; line-height: 1.24; color: #334155;">
                <strong>Format:</strong> 4-step tabular enquiry.<br>
                <strong>Rule:</strong> (1) Detail to follow up, (2) Question to ask, (3) Source type to use, (4) Clinical/military value (8 mins).
              </div>
            </div>
            <div style="margin-top: 3px; padding: 1.5px 4px; background: #fefce8; border-left: 2px solid #d97706; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 5.8pt; font-weight: 800; color: #854d0e;">
              Practice: 4-Prompt Tabular Follow-Up Matrix
            </div>
          </div>
        </div>
      </div>

      <!-- Course Specification Curriculum Tracking Table -->
      <div style="border: 1.5px solid #0f284e; border-radius: 4px; overflow: hidden; margin: 2px 0 2px 0;">
        <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif;">
          <thead>
            <tr style="border-bottom: 1.5px solid #0f284e; background: #0f284e; color: #ffffff;">
              <th style="padding: 6px 10px; text-align: left; font-size: 8pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; border-right: 1.2px solid rgba(255,255,255,0.25);">
                Course Specification &bull; Key Enquiry Sequence (1914–1918)
              </th>
              <th style="padding: 4px; width: 68px; text-align: center; font-size: 7.6pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; border-right: 1.2px solid rgba(255,255,255,0.25);">
                Learnt
              </th>
              <th style="padding: 4px; width: 68px; text-align: center; font-size: 7.6pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
                Revised
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #cbd5e1;">
              <td style="padding: 6px 10px; border-right: 1.2px solid #cbd5e1;">
                <div style="font-size: 8.2pt; font-weight: 800; color: #0f284e; line-height: 1.2;">
                  Key Topic 5.1: The Theatre of War: The British Sector, Trench Geography &amp; Battles
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 7.5pt; font-style: italic; color: #334155; margin-top: 1px; line-height: 1.2;">
                  Why were trenches designed in zig-zag traverses, and how did terrain at Ypres, Somme, and Arras affect medical treatment?
                </div>
              </td>
              <td style="text-align: center; vertical-align: middle; border-right: 1.2px solid #cbd5e1;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
              <td style="text-align: center; vertical-align: middle;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #cbd5e1;">
              <td style="padding: 6px 10px; border-right: 1.2px solid #cbd5e1;">
                <div style="font-size: 8.2pt; font-weight: 800; color: #0f284e; line-height: 1.2;">
                  Key Topic 5.2: The Trench Environment: Mud, Vermin &amp; Non-Combat Illnesses
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 7.5pt; font-style: italic; color: #334155; margin-top: 1px; line-height: 1.2;">
                  How did frontline conditions cause trench foot, trench fever, and dysentery, and what preventive routines were enforced?
                </div>
              </td>
              <td style="text-align: center; vertical-align: middle; border-right: 1.2px solid #cbd5e1;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
              <td style="text-align: center; vertical-align: middle;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #cbd5e1;">
              <td style="padding: 6px 10px; border-right: 1.2px solid #cbd5e1;">
                <div style="font-size: 8.2pt; font-weight: 800; color: #0f284e; line-height: 1.2;">
                  Key Topic 5.3: Battlefield Trauma: High Explosive Shrapnel, Gas Attacks &amp; Infection
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 7.5pt; font-style: italic; color: #334155; margin-top: 1px; line-height: 1.2;">
                  Why did explosive artillery produce gas gangrene, and how did the Brodie steel helmet and respirators reduce fatalities?
                </div>
              </td>
              <td style="text-align: center; vertical-align: middle; border-right: 1.2px solid #cbd5e1;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
              <td style="text-align: center; vertical-align: middle;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #cbd5e1;">
              <td style="padding: 6px 10px; border-right: 1.2px solid #cbd5e1;">
                <div style="font-size: 8.2pt; font-weight: 800; color: #0f284e; line-height: 1.2;">
                  Key Topic 5.4: The Chain of Evacuation: Stretcher Bearers, RAP, Dressing Stations &amp; CCS
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 7.5pt; font-style: italic; color: #334155; margin-top: 1px; line-height: 1.2;">
                  How did the RAMC and FANY evacuate wounded soldiers through six stations, and why was triage critical at CCSs?
                </div>
              </td>
              <td style="text-align: center; vertical-align: middle; border-right: 1.2px solid #cbd5e1;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
              <td style="text-align: center; vertical-align: middle;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #cbd5e1;">
              <td style="padding: 6px 10px; border-right: 1.2px solid #cbd5e1;">
                <div style="font-size: 8.2pt; font-weight: 800; color: #0f284e; line-height: 1.2;">
                  Key Topic 5.5: Surgical Breakthroughs: The Thomas Splint, Wound Debridement &amp; Mobile X-Rays
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 7.5pt; font-style: italic; color: #334155; margin-top: 1px; line-height: 1.2;">
                  How did the Thomas Splint slash femur mortality from 80% to 20%, and why was Carrel-Dakin irrigation necessary?
                </div>
              </td>
              <td style="text-align: center; vertical-align: middle; border-right: 1.2px solid #cbd5e1;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
              <td style="text-align: center; vertical-align: middle;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 10px; border-right: 1.2px solid #cbd5e1;">
                <div style="font-size: 8.2pt; font-weight: 800; color: #0f284e; line-height: 1.2;">
                  Key Topic 5.6: Lifesaving Innovations: Blood Storage, Brain Surgery &amp; Plastic Reconstruction
                </div>
                <div style="font-family: 'Georgia', serif; font-size: 7.5pt; font-style: italic; color: #334155; margin-top: 1px; line-height: 1.2;">
                  How did Oswald Robertson establish the first blood bank at Cambrai, and how did Gillies rebuild shattered faces at Sidcup?
                </div>
              </td>
              <td style="text-align: center; vertical-align: middle; border-right: 1.2px solid #cbd5e1;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
              <td style="text-align: center; vertical-align: middle;">
                <div style="width: 14px; height: 14px; border: 1.5px solid #0f284e; border-radius: 2px; margin: 0 auto; background: #ffffff;"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      ${renderFooterStrip(1, quipList[0], 28)}
    </div>
  </div>
`;

  // ====================================================================
  // PAGES 2–3: CHRONOLOGY REVISION ANCHOR & CENTER-SPINE MIND-MAP CANVAS
  // (2 Pages, Milestones 1–6: Pure Headings, Zero Giveaways, Edge-to-Edge)
  // ====================================================================
  html += `
  <!-- PAGE 2: CHRONOLOGY REVISION ANCHOR PART 1 (MILESTONES 1–3: 1914–1915) -->
  <div class="page page-container verso-page" id="page-2" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="position: relative;">
      
      <!-- Top Spread Masthead -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
            CHRONOLOGY SPREAD &bull; PART 1
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; text-transform: uppercase; color: #000000;">
            THE WESTERN FRONT &bull; CAUSAL TURNING POINTS (1914–1915)
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 11.5pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
          Frontline Terrain, Acute Trauma &amp; Early Medical Responses
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 7.4pt; color: #000000; line-height: 1.22;">
          <strong>REVISION MIND-MAP CANVAS:</strong> At the end of each lesson, use the app's <em>Consolidate Station</em> to retrieve your keywords and branch out your mind-map across the open page (Conditions &amp; Trauma to the left &bull; RAMC Treatments to the right).
        </div>
      </div>

      <!-- Central Vertical Spine Highway Container -->
      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        
        <!-- Continuous Vertical Center Spine Line -->
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>

        <!-- Milestone 1: OCT 1914 -->
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 8px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              ◂ Conditions, Mud &amp; Trauma
            </div>
            <div style="background: #000000; color: #ffffff; padding: 5px 16px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 8.8pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000;">
              <span style="background: #ffffff; color: #000000; padding: 1.5px 7px; border-radius: 10px; font-size: 7.4pt; font-weight: 900;">OCT 1914</span>
              <span>1st Battle of Ypres &bull; Flanders Mud &amp; Terrain</span>
              <span style="font-size: 7.0pt; font-weight: 700; color: #ffffff;">(Enquiry 5.1)</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              RAMC Treatments &amp; Care ▸
            </div>
          </div>
        </div>

        <!-- Milestone 2: APR 1915 -->
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 8px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              ◂ Gas Symptoms &amp; Pulmonary Trauma
            </div>
            <div style="background: #000000; color: #ffffff; padding: 5px 16px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 8.8pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000;">
              <span style="background: #ffffff; color: #000000; padding: 1.5px 7px; border-radius: 10px; font-size: 7.4pt; font-weight: 900;">APR 1915</span>
              <span>2nd Battle of Ypres &bull; Poison Gas Attacks</span>
              <span style="font-size: 7.0pt; font-weight: 700; color: #ffffff;">(Enquiry 5.2)</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              Respirators &amp; Gas Defences ▸
            </div>
          </div>
        </div>

        <!-- Milestone 3: DEC 1915 -->
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 8px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              ◂ Shrapnel Splinters &amp; Fractures
            </div>
            <div style="background: #000000; color: #ffffff; padding: 5px 16px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 8.8pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000;">
              <span style="background: #ffffff; color: #000000; padding: 1.5px 7px; border-radius: 10px; font-size: 7.4pt; font-weight: 900;">DEC 1915</span>
              <span>The Thomas Splint &amp; Brodie Steel Helmet</span>
              <span style="font-size: 7.0pt; font-weight: 700; color: #ffffff;">(Enquiry 5.3 &bull; 5.5)</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              Splint Traction &amp; Head Protection ▸
            </div>
          </div>
        </div>

      </div>

      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          Causal Highway Continues to 1916–1917 (Page 3) ➔
        </span>
      </div>

      ${renderFooterStrip(2, quipList[1], 28)}
    </div>
  </div>

  <!-- PAGE 3: CHRONOLOGY REVISION ANCHOR PART 2 (MILESTONES 4–6: 1916–1917) -->
  <div class="page page-container recto-page" id="page-3" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="position: relative;">
      
      <!-- Top Spread Masthead -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
            CHRONOLOGY SPREAD &bull; PART 2
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; text-transform: uppercase; color: #000000;">
            THE WESTERN FRONT &bull; CAUSAL TURNING POINTS (1916–1917)
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 11.5pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.15;">
          Mass Attrition, The Triage Crisis &amp; Clinical Innovation
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2px 6px; font-family: 'Inter', sans-serif; font-size: 7.4pt; color: #000000; line-height: 1.22;">
          <strong>REVISION MIND-MAP CANVAS:</strong> At the end of each lesson, use the app's <em>Consolidate Station</em> to retrieve your keywords and branch out your mind-map across the open page (Attrition &amp; Logistics to the left &bull; Surgical Innovations to the right).
        </div>
      </div>

      <!-- Central Vertical Spine Highway Container -->
      <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin: 6px 0 2px 0;">
        
        <!-- Continuous Vertical Center Spine Line -->
        <div style="position: absolute; left: 50%; top: 15px; bottom: 15px; width: 2.5px; background: #000000; transform: translateX(-50%); z-index: 1;"></div>

        <!-- Milestone 4: JULY 1916 -->
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 8px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              ◂ Mass Casualties &amp; Transport Gridlock
            </div>
            <div style="background: #000000; color: #ffffff; padding: 5px 16px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 8.8pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000;">
              <span style="background: #ffffff; color: #000000; padding: 1.5px 7px; border-radius: 10px; font-size: 7.4pt; font-weight: 900;">JULY 1916</span>
              <span>Battle of the Somme &bull; The Triage Crisis</span>
              <span style="font-size: 7.0pt; font-weight: 700; color: #ffffff;">(Enquiry 5.4)</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              Three-Tier Triage &amp; CCS Surgery ▸
            </div>
          </div>
        </div>

        <!-- Milestone 5: APR–NOV 1917 -->
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 8px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              ◂ Liquid Mud &amp; Evacuation Delays
            </div>
            <div style="background: #000000; color: #ffffff; padding: 5px 16px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 8.8pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000;">
              <span style="background: #ffffff; color: #000000; padding: 1.5px 7px; border-radius: 10px; font-size: 7.4pt; font-weight: 900;">APR–NOV 1917</span>
              <span>Arras Underground Hospital &amp; Passchendaele</span>
              <span style="font-size: 7.0pt; font-weight: 700; color: #ffffff;">(Enquiry 5.1 &bull; 5.4)</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              Thompson’s Cave Underground Wards ▸
            </div>
          </div>
        </div>

        <!-- Milestone 6: NOV 1917 -->
        <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 0; padding: 8px 0;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%;">
            <div style="flex: 1; text-align: right; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              ◂ Severe Blood Loss &amp; Facial Trauma
            </div>
            <div style="background: #000000; color: #ffffff; padding: 5px 16px; border-radius: 20px; font-family: 'Inter', sans-serif; font-size: 8.8pt; font-weight: 900; text-align: center; white-space: nowrap; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 0 0 6px #ffffff; border: 1.5px solid #000000;">
              <span style="background: #ffffff; color: #000000; padding: 1.5px 7px; border-radius: 10px; font-size: 7.4pt; font-weight: 900;">NOV 1917</span>
              <span>Oswald Robertson's Blood Depot &amp; Plastic Surgery</span>
              <span style="font-size: 7.0pt; font-weight: 700; color: #ffffff;">(Enquiry 5.6)</span>
            </div>
            <div style="flex: 1; text-align: left; font-family: 'Inter', sans-serif; font-size: 7.0pt; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
              Stored Blood Banks &amp; Tubed Pedicles ▸
            </div>
          </div>
        </div>

      </div>

      <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 2px 1px 0;">
        <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; color: #000000; text-transform: uppercase;">
          Western Front Chronological Mastery Complete ➔
        </span>
      </div>

      ${renderFooterStrip(3, quipList[2], 28)}
    </div>
  </div>
`;

  // ====================================================================
  // PAGES 4–27: 6 DEDICATED FOUR-PAGE SPREADS (LESSONS 5.1 TO 5.6)
  // Each lesson = 4 pages:
  //   Page 1: Environmental Inquiry Spine (5 Stages • Full Spec Coverage)
  //   Page 2: Section A Exam Blueprint & Source Investigation
  //   Page 3: Official Exam Response (Q1 Features [4m] + Q2 Start)
  //   Page 4: Official Exam Response Continued (Sustained Analysis [26 lines])
  // ====================================================================
  wfConfigs.forEach((cfg) => {
    const lesson = lessons[cfg.lessonIndex];
    const leftPageNum = (cfg.lessonNum - 1) * 4 + 4; // Pages 4, 8, 12, 16, 20, 24
    const rightPageNum = (cfg.lessonNum - 1) * 4 + 5; // Pages 5, 9, 13, 17, 21, 25
    const linedLeftPageNum = (cfg.lessonNum - 1) * 4 + 6; // Pages 6, 10, 14, 18, 22, 26
    const linedRightPageNum = (cfg.lessonNum - 1) * 4 + 7; // Pages 7, 11, 15, 19, 23, 27

    // Select primary source
    const sIdx = cfg.sourceIndex !== undefined ? cfg.sourceIndex : 0;
    const primarySource =
      lesson && lesson.sources && lesson.sources[sIdx]
        ? lesson.sources[sIdx]
        : {
            caption: 'Contemporary primary visual source from the Western Front.',
            provenance: 'Imperial War Museum Photographic Archive (1914–1918).',
          };

    // Resolve base64 image
    const b64Img = primarySource.src ? getBase64Image(primarySource.src) || primarySource.src : '';

    // Page 1: Environmental Inquiry Spine (5 Stages • Full Spec Coverage)
    html += renderWfSpinePage(cfg, leftPageNum);

    // Page 2: Section A Exam Question & Primary Source Investigation
    html += renderWfExamQuestionPage(cfg, rightPageNum, primarySource, b64Img);

    // Page 3: Official Exam Continuation Page (31 Ruled Lines)
    html += renderWfExamContinuationPage(cfg, linedLeftPageNum);

    // Page 4: Official Exam Synthesis & Question 1 Feature Drills
    html += renderWfExamSynthesisAndFeaturesPage(cfg, linedRightPageNum);
  });

  // ====================================================================
  // PAGE 28: MASTER BACK COVER (Student Assessment Record & Digital Quizzing Hub)
  // ====================================================================
  const wfEnquiries = wfConfigs.map((cfg) => ({
    num: cfg.lessonNum,
    code: `KT5.${cfg.lessonNum}`,
    title: cfg.title.replace(/^KT5\.\d+:\s*/, ''),
    enquiryQuestion: cfg.enquiryQuestion,
    doNowMarks: 10,
    q1Marks: 4,
    q2Type: [1, 3, 5].includes(cfg.lessonNum) ? 'Q2(a) Utility' : 'Q2(b) Follow-up',
    q2Marks: [1, 3, 5].includes(cfg.lessonNum) ? 8 : 4,
    totalMarks: [1, 3, 5].includes(cfg.lessonNum) ? 22 : 18,
  }));

  const wfQrLessons = wfConfigs.map((cfg) => ({
    label: `KT 5.${cfg.lessonNum}`,
    url: `https://the-history-revision-hub.netlify.app/?view=reading&unit=edexcel_medicine&lesson=5.${cfg.lessonNum}`,
  }));

  html += renderStandardBackCover({
    unitId: 'edexcel_medicine',
    paperTitle: 'EDEXCEL GCSE (9–1) HISTORY • PAPER 1 SECTION A: HISTORIC ENVIRONMENT',
    keyTopicNum: 5,
    trackerTitle: 'Student Assessment Record &bull; Key Topic 5 Tracker',
    trackerSubtitle: 'The British Sector of the Western Front, 1914–1918: Injuries, Treatment and the Trenches',
    enquiries: wfEnquiries,
    qrLessons: wfQrLessons,
    footerQuip: 'Retain this student assessment record for parent consultations and GCSE revision monitoring.',
    totalPageCount: 28,
    renderFooterStrip,
  });

  html += `
</body>
</html>
`;

  return html;
}

module.exports = {
  buildWesternFrontTwoPageWorkbook,
};

async function main() {
  console.log(
    'Rendering 28-Page A4 Pupil Workbook (Dual QR & Assessment Portfolio): Key Topic 5: Western Front (1914–1918)...',
  );
  const puppeteer = require('puppeteer');
  const { pathToFileURL } = require('url');
  global.window = global;
  const mod = await import(
    pathToFileURL(path.resolve(__dirname, '../units/edexcel_medicine/data.js')).href
  );
  const unitData = mod.default || mod.unitData || global.unitData;
  const customHtml = buildWesternFrontTwoPageWorkbook(unitData, { name: 'western_front' });

  const unitDir = path.resolve(__dirname, '../units/edexcel_medicine');
  const publicUnitDir = path.resolve(__dirname, '../public/units/edexcel_medicine');
  const pdfsDir = path.resolve(__dirname, '../public/pdfs');

  const unitHtmlPath = path.join(unitDir, 'pupil_workbook_western_front.html');
  const pubHtmlPath = path.join(publicUnitDir, 'pupil_workbook_western_front.html');
  const outPdfPath = path.join(pdfsDir, 'edexcel_medicine_pupil_workbook_western_front.pdf');
  const pubPdfCopy = path.join(publicUnitDir, 'pupil_workbook_western_front.pdf');

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
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Error compiling Western Front workbook:', err);
    process.exit(1);
  });
}
