const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const wfHomeworkData = [
  {
    lesson_index: 20,
    lesson_id: 'lesson_5_1',
    lesson_key: '5.1',
    cover_image: '/images/arras_underground_hospital_tonks_1918.jpg',
    cover_caption: 'An Underground Casualty Clearing Station, Arras (1918) by Henry Tonks • Imperial War Museums (IWM ART 1653). Depicts British medical staff and stretcher-bearers treating casualties deep inside the ancient underground chalk quarries of Arras.',
    parent_discussion: [
      {
        question: 'What acoustic instrument did Jack Firebrace use, and what terrifying sound did he hear through the living rock?',
        answer: 'He used a geophone (listening cups against the rock). He heard a rhythmic metallic tapping (tink, tink, tink), which meant German counter-miners were digging less than ten yards away and preparing to blow up the tunnel.'
      },
      {
        question: 'How did fighting sixty feet underground differ from the battlefield on the surface?',
        answer: 'Surface trenches at Ypres were churned liquid mud and whistling artillery shrapnel. Underground tunnels were pitch black, cramped (only four feet high), silent, and freezing cold—with the constant terror of being buried alive by an explosive mine.'
      },
      {
        question: 'Why was the soft chalk rock at Arras so vital for British medical care?',
        answer: 'Miners carved out miles of ancient chalk quarries into an immense underground city. Deep safe from German artillery shells, they built a 700-bed hospital with running water, electric lights, and operating theatres.'
      }
    ],
    do_now_preview: [
      {
        num: 1,
        tag: 'Last Lesson',
        question: 'Why did the zig-zag layout of trenches on the Western Front protect British soldiers?',
        answer: 'It prevented enemy artillery shrapnel and blast waves from travelling down straight lines, and stopped enemy trench-raiders firing down the whole line.'
      },
      {
        num: 2,
        tag: 'Last Lesson',
        question: 'Why was casualty evacuation particularly agonizing and slow in the Ypres Salient?',
        answer: 'The low-lying waterlogged clay, destroyed drainage systems, and constant shell-craters turned the ground into a deep sea of mud.'
      },
      {
        num: 3,
        tag: 'Last Lesson',
        question: 'What strategic battle between July and November 1916 resulted in 57,000 British casualties on its very first day?',
        answer: 'The Battle of the Somme (1 July 1916).'
      },
      {
        num: 4,
        tag: 'Last Lesson',
        question: 'What underground chalk tunnel network in 1917 sheltered 25,000 British troops and contained a complete underground hospital?',
        answer: 'The Arras cave network (built by New Zealand and British tunnelers).'
      },
      {
        num: 5,
        tag: 'Last Week',
        question: 'What diagnostic imaging discovered in 1895 by Röntgen was used to locate shrapnel in wounded soldiers?',
        answer: 'X-rays.'
      },
      {
        num: 6,
        tag: 'Last Week',
        question: 'Who discovered the ABO blood groups in 1901?',
        answer: 'Karl Landsteiner.'
      },
      {
        num: 7,
        tag: 'Prior Topic',
        question: 'What miracle antibiotic was discovered by Fleming in 1928?',
        answer: 'Penicillin.'
      },
      {
        num: 8,
        tag: 'Prior Topic',
        question: 'What chemical did Joseph Lister introduce in 1865 to kill surgical microbes?',
        answer: 'Carbolic acid.'
      },
      {
        num: 9,
        tag: 'Prior Topic',
        question: 'Who published the Germ Theory in 1861?',
        answer: 'Louis Pasteur.'
      },
      {
        num: 10,
        tag: 'Prior Topic',
        question: 'Who proved the circulation of the blood in 1628?',
        answer: 'William Harvey.'
      }
    ]
  },
  {
    lesson_index: 21,
    lesson_id: 'lesson_5_2',
    lesson_key: '5.2',
    parent_discussion: [
      {
        question: 'How did frontline soldiers try to kill the swarms of lice nesting in their uniform seams?',
        answer: 'They sat stripped to the waist in warm dugouts and ran candle flames along the seams of their trousers and tunics, popping the lice eggs with heat.'
      },
      {
        question: 'What illness did body lice transmit, and what did it feel like for an infected soldier?',
        answer: 'Trench fever. It caused sudden 103°F fevers and severe, splitting bone aches, especially agonizing pain in the shins.'
      },
      {
        question: 'Why was the thick Flanders mud so dangerous for soldiers\' feet?',
        answer: 'Standing in freezing, waterlogged mud for hours cut off blood circulation, turning toes white, then purple. This caused trench foot, tissue necrosis (gangrene), and often amputation with a bone saw.'
      }
    ],
    do_now_preview: [
      {
        num: 1,
        tag: 'Last Lesson',
        question: 'What parasite transmitted trench fever to British soldiers on the Western Front?',
        answer: 'Body lice (Pediculus humanus) living in uniform seams.'
      },
      {
        num: 2,
        tag: 'Last Lesson',
        question: 'What two mandatory preventative measures did the British Army introduce to conquer trench foot?',
        answer: 'Whale oil rubdowns and mandatory clean dry sock inspections under the buddy system.'
      },
      {
        num: 3,
        tag: 'Last Lesson',
        question: 'What psychological trauma caused by relentless artillery bombardment led to tremors, mutism, and mental breakdown?',
        answer: 'Shell shock (Neurasthenia / combat fatigue).'
      },
      {
        num: 4,
        tag: 'Last Lesson',
        question: 'What lethal poison gas, first used by Germany at Second Ypres in April 1915, caused suffocation and death by fluid in the lungs?',
        answer: 'Chlorine gas.'
      },
      {
        num: 5,
        tag: 'Last Week',
        question: 'Why were trenches designed with a zig-zag pattern rather than straight lines?',
        answer: 'To contain artillery blast waves and prevent enemy raiders from firing down the entire trench.'
      },
      {
        num: 6,
        tag: 'Last Week',
        question: 'In which Belgian salient did deep clay mud make casualty evacuation an agonizing struggle?',
        answer: 'The Ypres Salient.'
      },
      {
        num: 7,
        tag: 'Prior Topic',
        question: 'What machine invented in 1895 allowed surgeons to locate bullets and shrapnel before operating?',
        answer: 'X-ray machines (Wilhelm Röntgen).'
      },
      {
        num: 8,
        tag: 'Prior Topic',
        question: 'What did Karl Landsteiner discover in 1901 that made blood transfusions safe and effective?',
        answer: 'The ABO blood groups.'
      },
      {
        num: 9,
        tag: 'Prior Topic',
        question: 'What was the first magic bullet, discovered by Paul Ehrlich in 1909 to treat syphilis?',
        answer: 'Salvarsan 606.'
      },
      {
        num: 10,
        tag: 'Prior Topic',
        question: 'Who developed the antiseptic carbolic spray in 1865 to prevent wound sepsis?',
        answer: 'Joseph Lister.'
      }
    ]
  },
  {
    lesson_index: 22,
    lesson_id: 'lesson_5_3',
    lesson_key: '5.3',
    parent_discussion: [
      {
        question: 'What horrific injuries arrived at Mary Borden’s field hospital after an artillery bombardment?',
        answer: 'Shattered limbs, fractured skulls, torn flesh from jagged steel shrapnel, and open wounds contaminated with frontline dirt and torn cloth.'
      },
      {
        question: 'How did medical staff use "triage" to sort incoming casualties under intense pressure?',
        answer: 'They divided wounded men into three groups: the walking wounded, those needing immediate emergency surgery to survive, and hopeless/dying cases who were given palliative morphine.'
      },
      {
        question: 'Why was the heavily manured soil of northern France so dangerous for wounded flesh?',
        answer: 'Centuries of intense farming left the soil saturated with manure containing tetanus and gas gangrene bacteria. When shrapnel drove dirty uniform cloth deep into tissue, gas gangrene rotted the flesh within hours.'
      }
    ],
    do_now_preview: [
      {
        num: 1,
        tag: 'Last Lesson',
        question: 'Why did the introduction of the steel Brodie helmet in 1915 reduce fatal head injuries by 80%?',
        answer: 'It deflected downwards-falling high-explosive shrapnel and flying debris.'
      },
      {
        num: 2,
        tag: 'Last Lesson',
        question: 'What lethal anaerobic infection flourished in deep shrapnel wounds contaminated with manured soil?',
        answer: 'Gas gangrene (caused by Clostridium bacteria).'
      },
      {
        num: 3,
        tag: 'Last Lesson',
        question: 'What oily blistering gas introduced in 1917 burned skin and caused internal fluid in the lungs?',
        answer: 'Mustard gas.'
      },
      {
        num: 4,
        tag: 'Last Lesson',
        question: 'What parasite spread trench fever causing severe joint and leg pain?',
        answer: 'Body lice.'
      },
      {
        num: 5,
        tag: 'Last Week',
        question: 'What preventative measures stopped trench foot among British soldiers?',
        answer: 'Whale oil rubdowns, regular dry sock changes, and raised duckboards.'
      },
      {
        num: 6,
        tag: 'Last Week',
        question: 'Why did the zig-zag layout of trenches save lives during artillery bombardments?',
        answer: 'It localized shell bursts and prevented shrapnel sweeping down the line.'
      },
      {
        num: 7,
        tag: 'Prior Topic',
        question: 'What imaging technology discovered in 1895 located shrapnel in wounded soldiers?',
        answer: 'X-rays.'
      },
      {
        num: 8,
        tag: 'Prior Topic',
        question: 'Who discovered ABO blood groups in 1901?',
        answer: 'Karl Landsteiner.'
      },
      {
        num: 9,
        tag: 'Prior Topic',
        question: 'What miracle antibiotic discovered in 1928 was NOT available on the Western Front?',
        answer: 'Penicillin.'
      },
      {
        num: 10,
        tag: 'Prior Topic',
        question: 'What chemical did Joseph Lister use in 1865 to prevent wound sepsis?',
        answer: 'Carbolic acid.'
      }
    ]
  },
  {
    lesson_index: 23,
    lesson_id: 'lesson_5_4',
    lesson_key: '5.4',
    parent_discussion: [
      {
        question: 'What physical agony did mustard gas inflict upon incoming casualties at the base hospital?',
        answer: 'Huge burning blisters on their skin, eyes swollen completely shut causing temporary blindness, and coughing up burnt lung membranes as they slowly choked.'
      },
      {
        question: 'What duties did Voluntary Aid Detachment (VAD) nurses like Vera Brittain perform for wounded soldiers?',
        answer: 'Cleaning mud and blood from agonizing wounds, applying soothing saline compresses, bathing blinded eyes, and staying by dying men through the night.'
      },
      {
        question: 'Why was mustard gas far more terrifying to infantrymen than standard artillery shells?',
        answer: 'It was nearly invisible and odorless, soaked into clothes and trench mud for days, burned skin through uniforms, and inflicted a lingering, agonizing death.'
      }
    ],
    do_now_preview: [
      {
        num: 1,
        tag: 'Last Lesson',
        question: 'In the RAMC Chain of Evacuation, which frontline medical post was located within 200 yards of the trenches?',
        answer: 'The Regimental Aid Post (RAP).'
      },
      {
        num: 2,
        tag: 'Last Lesson',
        question: 'In the Chain of Evacuation, which vital station performed immediate life-saving emergency surgery?',
        answer: 'The Casualty Clearing Station (CCS).'
      },
      {
        num: 3,
        tag: 'Last Lesson',
        question: 'What volunteer organization of female motor ambulance drivers drove wounded soldiers under shellfire?',
        answer: 'The FANY (First Aid Nursing Yeomanry).'
      },
      {
        num: 4,
        tag: 'Last Lesson',
        question: 'What large medical facility located near French coastal ports provided long-term convalescent care?',
        answer: 'The Base Hospital.'
      },
      {
        num: 5,
        tag: 'Last Week',
        question: 'What protective equipment introduced in 1915 reduced fatal head wounds from artillery?',
        answer: 'The steel Brodie helmet.'
      },
      {
        num: 6,
        tag: 'Last Week',
        question: 'What lethal soil bacterium caused deep flesh wounds to rot and emit foul gas?',
        answer: 'Gas gangrene.'
      },
      {
        num: 7,
        tag: 'Last Week',
        question: 'What parasite carried trench fever between frontline soldiers?',
        answer: 'Body lice.'
      },
      {
        num: 8,
        tag: 'Prior Topic',
        question: 'What 1895 discovery allowed military doctors to photograph shrapnel inside the human body?',
        answer: 'X-rays (Wilhelm Röntgen).'
      },
      {
        num: 9,
        tag: 'Prior Topic',
        question: 'What 1901 discovery allowed blood transfusions to match compatible donors and patients?',
        answer: 'ABO blood groups (Karl Landsteiner).'
      },
      {
        num: 10,
        tag: 'Prior Topic',
        question: 'Who proved the Germ Theory in 1861?',
        answer: 'Louis Pasteur.'
      }
    ]
  },
  {
    lesson_index: 24,
    lesson_id: 'lesson_5_5',
    lesson_key: '5.5',
    parent_discussion: [
      {
        question: 'How did Marie Curie’s mobile X-ray cars ("petites Curies") revolutionize battlefield surgery?',
        answer: 'They carried portable X-ray generators directly to frontline field hospitals, allowing surgeons to locate jagged metal shrapnel and bone fractures before operating.'
      },
      {
        question: 'Why did fractured thigh bones (femurs) kill 80% of casualties at the start of the war?',
        answer: 'Broken leg bones shifted violently during bumpy transport on rough roads, tearing femoral blood vessels, causing massive internal haemorrhage and fatal surgical shock.'
      },
      {
        question: 'How did the Thomas Splint transform survival rates for compound fractures?',
        answer: 'It held the broken leg in rigid traction and proper alignment, stopping bone ends from grinding and severing arteries, dropping the death rate from 80% down to under 20%.'
      }
    ],
    do_now_preview: [
      {
        num: 1,
        tag: 'Last Lesson',
        question: 'Why did the Thomas Splint reduce compound femur fracture mortality from 80% to under 20%?',
        answer: 'It stabilized the broken leg and exerted continuous traction, preventing severed arteries and fatal shock.'
      },
      {
        num: 2,
        tag: 'Last Lesson',
        question: 'What surgical procedure involved cutting away all dead, infected, and contaminated tissue from a wound?',
        answer: 'Wound debridement.'
      },
      {
        num: 3,
        tag: 'Last Lesson',
        question: 'What antiseptic chemical solution did Alexis Carrel and Henry Dakin introduce to irrigate deep wounds?',
        answer: 'The Carrel-Dakin solution (sterilised buffered sodium hypochlorite).'
      },
      {
        num: 4,
        tag: 'Last Lesson',
        question: 'Why were Marie Curie\'s mobile X-ray vans ("petites Curies") so critical at the front?',
        answer: 'They could drive directly to Casualty Clearing Stations to locate shrapnel before surgeons operated.'
      },
      {
        num: 5,
        tag: 'Last Week',
        question: 'In the RAMC Chain of Evacuation, what facility performed emergency surgical operations before evacuation to ports?',
        answer: 'The Casualty Clearing Station (CCS).'
      },
      {
        num: 6,
        tag: 'Last Week',
        question: 'What volunteer female ambulance corps transported wounded soldiers from clearing stations to hospital trains?',
        answer: 'The FANY (First Aid Nursing Yeomanry).'
      },
      {
        num: 7,
        tag: 'Last Week',
        question: 'What steel helmet was introduced in 1915 to protect soldiers from overhead shrapnel?',
        answer: 'The Brodie helmet.'
      },
      {
        num: 8,
        tag: 'Prior Topic',
        question: 'What imaging technology was discovered by Wilhelm Röntgen in 1895?',
        answer: 'X-rays.'
      },
      {
        num: 9,
        tag: 'Prior Topic',
        question: 'What blood group discovery in 1901 by Karl Landsteiner made transfusions safe?',
        answer: 'The ABO blood group system.'
      },
      {
        num: 10,
        tag: 'Prior Topic',
        question: 'Who was the pioneering antiseptic surgeon who introduced carbolic acid in 1865?',
        answer: 'Joseph Lister.'
      }
    ]
  },
  {
    lesson_index: 25,
    lesson_id: 'lesson_5_6',
    lesson_key: '5.6',
    parent_discussion: [
      {
        question: 'Why did trench warfare produce such horrifying facial mutilations?',
        answer: 'Soldiers had to peek over trench parapets, exposing their faces directly to high-velocity bullet fire and jagged artillery shrapnel that ripped away jaws, noses, and cheeks.'
      },
      {
        question: 'What pioneering surgical technique did Harold Gillies invent to rebuild shattered faces?',
        answer: 'The pedicle tube: rolling a flap of living skin into a tube to preserve blood flow while grafting tissue step-by-step from the chest or forehead to reconstruct a face.'
      },
      {
        question: 'Why were blue benches placed in the town around Queen’s Hospital in Sidcup?',
        answer: 'They warned local residents that the men resting there had severe facial disfigurements, helping shield the recovering veterans from public staring and distress.'
      }
    ],
    do_now_preview: [
      {
        num: 1,
        tag: 'Last Lesson',
        question: 'What innovative surgical technique did Harold Gillies develop to maintain blood supply during facial reconstruction?',
        answer: 'The pedicle tube (tubed pedicle graft).'
      },
      {
        num: 2,
        tag: 'Last Lesson',
        question: 'What anticoagulant chemical did Richard Lewisohn add in 1915 to prevent donor blood clotting?',
        answer: 'Sodium citrate (0.2%).'
      },
      {
        num: 3,
        tag: 'Last Lesson',
        question: 'What chemical did Rous and Turner add in 1916 that allowed blood to be stored on ice for up to 28 days?',
        answer: 'Citrate glucose.'
      },
      {
        num: 4,
        tag: 'Last Lesson',
        question: 'Who established the world\'s first mobile blood bank at the Battle of Cambrai in 1917?',
        answer: 'Captain Oswald Robertson.'
      },
      {
        num: 5,
        tag: 'Last Lesson',
        question: 'What pioneering American surgeon operated under local anaesthetic to reduce brain swelling and brain trauma mortality?',
        answer: 'Harvey Cushing.'
      },
      {
        num: 6,
        tag: 'Last Week',
        question: 'How did the Thomas Splint reduce femur fracture death rates from 80% to under 20%?',
        answer: 'It held the leg in traction and stopped broken bones grinding or severing femoral blood vessels.'
      },
      {
        num: 7,
        tag: 'Last Week',
        question: 'What was the function of the Casualty Clearing Station (CCS) in the Chain of Evacuation?',
        answer: 'Emergency life-saving surgery, triage, and stabilization before transport to Base Hospitals.'
      },
      {
        num: 8,
        tag: 'Prior Topic',
        question: 'What 1895 discovery allowed military doctors to photograph shrapnel embedded in muscle and bone?',
        answer: 'X-rays (Wilhelm Röntgen).'
      },
      {
        num: 9,
        tag: 'Prior Topic',
        question: 'What 1901 discovery allowed blood transfusions to match compatible donors and patients?',
        answer: 'ABO blood groups (Karl Landsteiner).'
      },
      {
        num: 10,
        tag: 'Prior Topic',
        question: 'Who proved the Germ Theory in 1861?',
        answer: 'Louis Pasteur.'
      }
    ]
  }
];

function updateUnitObject(unitObj) {
  if (!unitObj.guided_reading) return;
  wfHomeworkData.forEach((hw) => {
    const entry = unitObj.guided_reading.find(
      (gr) => gr.lesson_id === hw.lesson_id || gr.lesson_index === hw.lesson_index
    );
    if (entry) {
      if (hw.cover_image) entry.cover_image = hw.cover_image;
      if (hw.cover_caption) entry.cover_caption = hw.cover_caption;
      entry.parent_discussion = hw.parent_discussion;
      entry.do_now_preview = hw.do_now_preview;
    }
  });
}

// 1. data/edexcel_medicine.json
const dataPath = path.join(ROOT_DIR, 'data', 'edexcel_medicine.json');
const medData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
updateUnitObject(medData);
fs.writeFileSync(dataPath, JSON.stringify(medData, null, 2), 'utf8');
console.log('Updated data/edexcel_medicine.json');

// 2. public/data/edexcel_medicine.json
const pubDataPath = path.join(ROOT_DIR, 'public', 'data', 'edexcel_medicine.json');
if (fs.existsSync(pubDataPath)) {
  fs.writeFileSync(pubDataPath, JSON.stringify(medData, null, 2), 'utf8');
  console.log('Updated public/data/edexcel_medicine.json');
}

// 3. dist/data/edexcel_medicine.json
const distDataPath = path.join(ROOT_DIR, 'dist', 'data', 'edexcel_medicine.json');
if (fs.existsSync(distDataPath)) {
  fs.writeFileSync(distDataPath, JSON.stringify(medData, null, 2), 'utf8');
  console.log('Updated dist/data/edexcel_medicine.json');
}

// 4. database.json
const dbPath = path.join(ROOT_DIR, 'database.json');
if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const unit = db.edexcel_medicine ? (db.edexcel_medicine.data || db.edexcel_medicine) : null;
  if (unit) {
    updateUnitObject(unit);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Updated database.json');
  }
}

// 5. public/database.json
const pubDbPath = path.join(ROOT_DIR, 'public', 'database.json');
if (fs.existsSync(pubDbPath)) {
  const pubDb = JSON.parse(fs.readFileSync(pubDbPath, 'utf8'));
  const unit = pubDb.edexcel_medicine ? (pubDb.edexcel_medicine.data || pubDb.edexcel_medicine) : null;
  if (unit) {
    updateUnitObject(unit);
    fs.writeFileSync(pubDbPath, JSON.stringify(pubDb, null, 2), 'utf8');
    console.log('Updated public/database.json');
  }
}

// 6. units/edexcel_medicine/data.js
const unitJsPath = path.join(ROOT_DIR, 'units', 'edexcel_medicine', 'data.js');
if (fs.existsSync(unitJsPath)) {
  const content = `window.EDEXCEL_MEDICINE_DATA = ${JSON.stringify(medData, null, 2)};\n`;
  fs.writeFileSync(unitJsPath, content, 'utf8');
  console.log('Updated units/edexcel_medicine/data.js');
}

// 7. public/units/edexcel_medicine/data.js
const pubUnitJsPath = path.join(ROOT_DIR, 'public', 'units', 'edexcel_medicine', 'data.js');
if (fs.existsSync(pubUnitJsPath)) {
  const content = `window.EDEXCEL_MEDICINE_DATA = ${JSON.stringify(medData, null, 2)};\n`;
  fs.writeFileSync(pubUnitJsPath, content, 'utf8');
  console.log('Updated public/units/edexcel_medicine/data.js');
}

console.log('All data stores synchronized successfully!');
