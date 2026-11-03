const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function updateJsonAndJs(unitId, updater) {
  const jsonPath = path.join(ROOT_DIR, 'data', `${unitId}.json`);
  const jsPath = path.join(ROOT_DIR, 'units', unitId, 'data.js');
  const pubJsPath = path.join(ROOT_DIR, 'public', 'units', unitId, 'data.js');

  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  updater(jsonData);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`✅ Updated ${jsonPath}`);

  const jsContent = `export default ${JSON.stringify(jsonData, null, 2)};\n`;
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log(`✅ Updated ${jsPath}`);

  if (fs.existsSync(pubJsPath)) {
    fs.writeFileSync(pubJsPath, jsContent, 'utf8');
    console.log(`✅ Updated ${pubJsPath}`);
  }
}

// 1. UPDATE EDEXCEL MEDICINE
console.log('\n--- REALIGNING EDEXCEL MEDICINE ---');
updateJsonAndJs('edexcel_medicine', (data) => {
  // Lesson 4.2
  const l42 = data.lessons.find(l => l.id === 'lesson_4_2');
  if (l42 && l42.narrative_blocks) {
    console.log('Found lesson_4_2, updating blocks...');
    // Act 1: Add Röntgen plate
    l42.narrative_blocks[0].image = '/images/rontgen_first_xray.jpg';
    l42.narrative_blocks[0].image_alt = "First medical radiograph taken by Wilhelm Röntgen on 22 December 1895, showing the bones of his wife Bertha's hand and her wedding ring";
    l42.narrative_blocks[0].caption = "The First Clinical X-Ray (1895): Wilhelm Conrad Röntgen's historic radiograph of his wife Bertha's hand, revealing internal skeletal anatomy non-invasively for the first time without surgical incision.";
    l42.narrative_blocks[0].isReversed = false;

    // Act 2: Clear plate
    delete l42.narrative_blocks[1].image;
    delete l42.narrative_blocks[1].image_alt;
    delete l42.narrative_blocks[1].caption;
    delete l42.narrative_blocks[1].isReversed;

    // Act 3: Add MRI plate
    l42.narrative_blocks[2].image = '/images/banner_mri_hospital.jpg';
    l42.narrative_blocks[2].image_alt = 'Modern hospital magnetic resonance imaging (MRI) scanner suite with circular superconducting magnet bore';
    l42.narrative_blocks[2].caption = 'Advanced MRI Diagnostic Scanner: Developed in the late 1970s, MRI uses strong magnetic fields and radio waves to generate cross-sectional images of soft tissues, brain structures, and internal organs without ionizing radiation.';
    l42.narrative_blocks[2].isReversed = true;

    // Act 4: Clear plate
    delete l42.narrative_blocks[3].image;
    delete l42.narrative_blocks[3].image_alt;
    delete l42.narrative_blocks[3].caption;
    delete l42.narrative_blocks[3].isReversed;
  }

  // Lesson 5.6
  const l56 = data.lessons.find(l => l.id === 'lesson_5_6');
  if (l56 && l56.narrative_blocks) {
    console.log('Found lesson_5_6, updating blocks...');
    // Act 4: Clear Gillies plate
    delete l56.narrative_blocks[3].image;
    delete l56.narrative_blocks[3].image_alt;
    delete l56.narrative_blocks[3].caption;
    delete l56.narrative_blocks[3].isReversed;

    // Act 5: Add Gillies plate
    l56.narrative_blocks[4].image = '/images/gillies_tubed_pedicle.jpg';
    l56.narrative_blocks[4].image_alt = "Medical diagrams of Sir Harold Gillies' tubed pedicle skin grafting technique at Queen's Hospital Sidcup";
    l56.narrative_blocks[4].caption = "Sir Harold Gillies' 'Tubed Pedicle' Technique (Queen's Hospital, Sidcup): By rolling flap tissue into a sterile skin tube with its own vascular blood supply, Gillies bridged severe facial wounds caused by shell splinters, pioneering modern reconstructive plastic surgery.";
    l56.narrative_blocks[4].isReversed = true;
  }
});

// 2. UPDATE USA
console.log('\n--- REALIGNING USA ---');
updateJsonAndJs('usa', (data) => {
  // Lesson 2.1 (Lesson 5)
  const l21 = data.lessons.find(l => l.id === 'lesson_2_1');
  if (l21 && l21.narrative_blocks) {
    console.log('Found lesson_2_1, updating blocks...');
    // Act 1: Add Greensboro Four plate
    l21.narrative_blocks[0].image = '/units/usa/assets/sources/greensboro_four_1960.jpg';
    l21.narrative_blocks[0].image_alt = 'The Greensboro Four walking together after the Woolworth lunch counter sit-in, 1960';
    l21.narrative_blocks[0].caption = 'The Greensboro Four (1 February 1960): Ezell Blair Jr., Franklin McCain, Joseph McNeil, and David Richmond walking away from the Woolworth store in Greensboro, North Carolina, after launching the non-violent lunch counter sit-in movement.';
    l21.narrative_blocks[0].isReversed = false;

    // Act 3: Clear erroneous plate
    delete l21.narrative_blocks[2].image;
    delete l21.narrative_blocks[2].image_alt;
    delete l21.narrative_blocks[2].caption;
    delete l21.narrative_blocks[2].isReversed;

    // Act 4: Add James Meredith at Ole Miss plate
    l21.narrative_blocks[3].image = '/units/usa/assets/sources/james-meredith-walking.jpg';
    l21.narrative_blocks[3].image_alt = 'James Meredith walking on campus at the University of Mississippi flanked by federal marshals, October 1962';
    l21.narrative_blocks[3].caption = 'James Meredith at the University of Mississippi (October 1962): Flanked by federal marshals, Air Force veteran James Meredith walks to class as the first Black student admitted to Ole Miss, following violent segregationist riots that required 31,000 federal troops to suppress.';
    l21.narrative_blocks[3].isReversed = true;
  }

  // Lesson 2.4 (Lesson 8)
  const l24 = data.lessons.find(l => l.id === 'lesson_2_4');
  if (l24 && l24.narrative_blocks) {
    console.log('Found lesson_2_4, updating Act 5...');
    const act5 = l24.narrative_blocks[4];
    if (act5.content) {
      act5.content = act5.content.replace(
        'Congress rushed to pass the Civil Rights Act of 1968',
        'President Lyndon B. Johnson signed the Civil Rights Act of 1968'
      );
    }
    if (act5.text) {
      act5.text = act5.text.replace(
        'Congress rushed to pass the Civil Rights Act of 1968',
        'President Lyndon B. Johnson signed the Civil Rights Act of 1968'
      );
    }
    act5.caption = "President Lyndon B. Johnson with Dr Martin Luther King Jr.: Throughout their legislative partnership, Johnson relied on King's moral leadership to pass civil rights statutes. One week after King's assassination in April 1968, Johnson signed the Civil Rights Act of 1968 (Fair Housing Act) into federal law.";
    act5.image_alt = 'President Lyndon B. Johnson conferring with Dr Martin Luther King Jr.';
  }

  // Lesson 3.1 (Lesson 9)
  const l31 = data.lessons.find(l => l.id === 'lesson_3_1');
  if (l31 && l31.narrative_blocks) {
    console.log('Found lesson_3_1, updating blocks...');
    // Act 1: Clear Diem plate
    delete l31.narrative_blocks[0].image;
    delete l31.narrative_blocks[0].image_alt;
    delete l31.narrative_blocks[0].caption;
    delete l31.narrative_blocks[0].isReversed;

    // Act 2: Add Diem plate
    l31.narrative_blocks[1].image = '/units/usa/assets/sources/ngo-dinh-diem-parade.jpg';
    l31.narrative_blocks[1].image_alt = 'President Ngo Dinh Diem of South Vietnam reviewing troops in Saigon';
    l31.narrative_blocks[1].caption = 'President Ngo Dinh Diem of the Republic of Vietnam reviewing military forces in Saigon (c. 1957), heavily funded by US foreign aid.';
    l31.narrative_blocks[1].isReversed = false;

    // Act 3: Clear Buddhist protests plate
    delete l31.narrative_blocks[2].image;
    delete l31.narrative_blocks[2].image_alt;
    delete l31.narrative_blocks[2].caption;
    delete l31.narrative_blocks[2].isReversed;

    // Act 4: Add Buddhist protests plate
    l31.narrative_blocks[3].image = '/units/usa/assets/sources/buddhist-protests-1963.jpg';
    l31.narrative_blocks[3].image_alt = 'South Vietnamese police deploying tear gas outside a Buddhist pagoda gate in Saigon, 1963';
    l31.narrative_blocks[3].caption = 'South Vietnamese Security Forces Raiding a Buddhist Pagoda (Saigon, August 1963): Special Forces under Ngo Dinh Nhu deployed tear gas and automatic weapons against Buddhist shrines, arresting over 1,400 monks and sparking international outrage that convinced the Kennedy administration Diem had to be replaced.';
    l31.narrative_blocks[3].isReversed = true;
  }

  // Lesson 3.4 (Lesson 12)
  const l34 = data.lessons.find(l => l.id === 'lesson_3_4');
  if (l34 && l34.narrative_blocks) {
    console.log('Found lesson_3_4, updating blocks...');
    // Act 1: Correct Westmoreland caption
    l34.narrative_blocks[0].image = '/units/usa/assets/sources/general-westmoreland.jpg';
    l34.narrative_blocks[0].image_alt = 'General William Westmoreland in US Army military uniform';
    l34.narrative_blocks[0].caption = "General William Westmoreland (1914–2005): Commander of US Military Assistance Command, Vietnam (MACV). Despite assuring the American public in late 1967 that the war was being won, the sudden 1968 Tet Offensive shattered official optimism and triggered his controversial request for 206,000 additional troops.";
    l34.narrative_blocks[0].isReversed = false;

    // Act 2: Add Tet Offensive Strategic Map
    l34.narrative_blocks[1].image = '/units/usa/assets/vietnam_war_tet_offensive_theater_map.png';
    l34.narrative_blocks[1].image_alt = 'Military map showing simultaneous Tet Offensive attacks across South Vietnam in 1968';
    l34.narrative_blocks[1].caption = 'Military Map of the 1968 Tet Offensive: Illustrating the nationwide scope of the simultaneous attacks launched across South Vietnam between 29 January and 25 February 1968, targeting Khe Sanh, Hue, Da Nang, Pleiku, and Saigon, shattering American claims that the Vietcong were on the verge of defeat.';
    l34.narrative_blocks[1].isReversed = true;

    // Act 3: Clear erroneous Saigon evacuation plate
    delete l34.narrative_blocks[2].image;
    delete l34.narrative_blocks[2].image_alt;
    delete l34.narrative_blocks[2].caption;
    delete l34.narrative_blocks[2].isReversed;
  }
});

// 3. UPDATE MASTER RIGHTS DATABASE
console.log('\n--- SYNCHRONIZING MASTER RIGHTS DATABASE ---');
const dbPath = path.join(ROOT_DIR, 'scripts', 'master_rights_database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (db.units && db.units.usa && db.units.usa.sources) {
  // Update Lesson 5 (KT 2.1) plates
  const l5Sources = db.units.usa.sources.filter(s => s.lesson_num === 5);
  const npL5 = l5Sources.find(s => s.source_id.includes('Narrative Plate'));
  if (npL5) {
    npL5.source_id = 'Narrative Plate 1';
    npL5.artifact_title = 'The Greensboro Four Outside F.W. Woolworth Store (1960)';
    npL5.asset_path = '/units/usa/assets/sources/greensboro_four_1960.jpg';
    npL5.creator = 'Associated Press / Library of Congress';
    npL5.date = '1960';
  }
  // Add James Meredith plate if not present
  const meredithEntry = l5Sources.find(s => s.asset_path && s.asset_path.includes('james-meredith-walking'));
  if (!meredithEntry) {
    db.units.usa.sources.push({
      lesson_num: 5,
      lesson_title: 'KT 2.1: How did peaceful protests (like sit-ins and Freedom Rides) force the government to act?',
      source_id: 'Narrative Plate 4',
      artifact_title: 'James Meredith Walking on Campus at University of Mississippi Flanked by US Marshals',
      date: 'October 1962',
      creator: 'Marion S. Trikosko / Library of Congress Prints and Photographs Division',
      repository: 'Library of Congress',
      accession_id: 'LC-DIG-ppmsca-04294',
      rights_status: 'Public Domain (Works of US Federal Government / Library of Congress)',
      commercial_use_permitted: true,
      source_url: 'https://www.loc.gov/item/2003688164/',
      asset_path: '/units/usa/assets/sources/james-meredith-walking.jpg'
    });
  }

  // Update Lesson 12 sources
  const l12Sources = db.units.usa.sources.filter(s => s.lesson_num === 12);
  const np1 = l12Sources.find(s => s.source_id === 'Narrative Plate 1');
  if (np1) {
    np1.artifact_title = 'General William Westmoreland in Fatigue Uniform (1968)';
    np1.creator = 'US Army Visual Information Center / National Archives';
    np1.date = '1968';
  }
  const np3 = l12Sources.find(s => s.source_id === 'Narrative Plate 3');
  if (np3) {
    np3.source_id = 'Narrative Plate 2';
    np3.artifact_title = 'Military Theater Map of the 1968 Tet Offensive';
    np3.asset_path = '/units/usa/assets/vietnam_war_tet_offensive_theater_map.png';
    np3.date = '1968';
    np3.creator = 'Department of History, United States Military Academy';
  }
  console.log('✅ USA Lesson 5 and 12 plates updated in master rights database.');
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ Master Rights Database synchronized.');
