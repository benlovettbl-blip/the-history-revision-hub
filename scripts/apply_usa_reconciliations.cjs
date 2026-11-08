const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, '..', 'data', 'usa.json');
const d = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('--- RECONCILING USA DISCREPANCIES ---\n');

// 1. Lesson 1.4: Fix Act 1 and Act 3 images, and synchronize l.sources[1]
const l14 = d.lessons.find(l => l.id === 'lesson_1_4');
if (l14) {
  // Act 1: Formation of White Citizens' Councils -> Little Rock Segregationist Protest
  const act1 = l14.narrative_blocks.find(b => b.act === 1);
  if (act1) {
    console.log('Fixing L1.4 Act 1 image from', act1.image, 'to /units/usa/assets/sources/little-rock-protest-1957.jpg');
    act1.image = '/units/usa/assets/sources/little-rock-protest-1957.jpg';
  }

  // Act 3: All-White Jury Acquittal -> Emmett Till portrait
  const act3 = l14.narrative_blocks.find(b => b.act === 3);
  if (act3) {
    console.log('Fixing L1.4 Act 3 image from', act3.image, 'to /units/usa/assets/sources/portraits/emmett_till.jpg');
    act3.image = '/units/usa/assets/sources/portraits/emmett_till.jpg';
    act3.caption = 'Fourteen-year-old Emmett Till (1941–1955), whose brutal murder in Mississippi and the subsequent 67-minute acquittal of his confessed killers shocked the nation and galvanized the civil rights movement.';
  }

  // Synchronize l14.sources[1] with corrected title and caption
  const srcB = l14.sources.find(s => s.id === 'usa_lesson_1_4_a');
  if (srcB) {
    console.log('Syncing L1.4 Source B in l.sources...');
    srcB.title = 'Source B (Photograph & Press Report): Mamie Till-Mobley at the Open Casket of Emmett Till and Chicago Defender Report (September 1955)';
    srcB.src = '/units/usa/assets/sources/emmett_till_open_casket_mamie_1955.jpg';
    srcB.source = '/units/usa/assets/sources/emmett_till_open_casket_mamie_1955.jpg';
    srcB.caption = 'Mamie Till-Mobley and Gene Mobley standing beside the open casket of her murdered 14-year-old son, Emmett Till, at Roberts Temple Church of God in Christ in Chicago (September 1955). Her courageous decision to allow an open casket and permit press photography exposed the brutal reality of southern lynching to the world.';
  }
}

// 2. Lesson 4.2: Fix Act 1, Act 2, Act 3 images
const l42 = d.lessons.find(l => l.id === 'lesson_4_2');
if (l42) {
  // Act 1: Cold War Patriotism & The Red Threat
  const act1 = l42.narrative_blocks.find(b => b.act === 1);
  if (act1) {
    console.log('Fixing L4.2 Act 1 image to /units/usa/assets/sources/pro-war-rally-nyc.jpg');
    act1.image = '/units/usa/assets/sources/pro-war-rally-nyc.jpg';
    act1.caption = 'Thousands of patriotic counter-demonstrators and blue-collar workers marching through lower Manhattan in support of US troops and President Nixon (May 1970).';
  }

  // Act 2: Nixon's 'Silent Majority' Address
  const act2 = l42.narrative_blocks.find(b => b.act === 2);
  if (act2) {
    console.log('Setting L4.2 Act 2 image to /units/usa/assets/sources/nixon-television-address.jpg');
    act2.image = '/units/usa/assets/sources/nixon-television-address.jpg';
    act2.caption = 'President Richard Nixon delivering his televised \'Silent Majority\' address from the Oval Office on 3 November 1969, appealing to patriotic Americans to support his Vietnam strategy.';
  }

  // Act 3: The Hard Hat Riots in New York City
  const act3 = l42.narrative_blocks.find(b => b.act === 3);
  if (act3) {
    console.log('Setting L4.2 Act 3 image to /units/usa/assets/sources/hard-hat-riot-1970.jpg');
    act3.image = '/units/usa/assets/sources/hard-hat-riot-1970.jpg';
    act3.caption = 'Pro-war construction workers wearing hard hats clashing with anti-war student demonstrators near Wall Street during the \'Hard Hat Riot\' in New York City (8 May 1970).';
  }
}

// 3. Lesson 4.4: Fix Act 1, Act 2, Act 4, and Source D
const l44 = d.lessons.find(l => l.id === 'lesson_4_4');
if (l44) {
  // Act 1: The North Vietnamese Spring Offensive
  const act1 = l44.narrative_blocks.find(b => b.act === 1);
  if (act1) {
    console.log('Fixing L4.4 Act 1 image to /units/usa/assets/sources/arvn-troops-combat.jpg');
    act1.image = '/units/usa/assets/sources/arvn-troops-combat.jpg';
    act1.caption = 'South Vietnamese ARVN troops retreating under heavy artillery bombardment during the North Vietnamese Spring Offensive (1975).';
  }

  // Act 2: Operation Frequent Wind & The Fall of Saigon
  const act2 = l44.narrative_blocks.find(b => b.act === 2);
  if (act2) {
    console.log('Setting L4.4 Act 2 image to /units/usa/assets/sources/saigon-embassy-evacuation.jpg');
    act2.image = '/units/usa/assets/sources/saigon-embassy-evacuation.jpg';
    act2.caption = 'Desperate American personnel and South Vietnamese evacuees climbing to a rooftop helicopter during the frantic final evacuation of Saigon in Operation Frequent Wind (April 1975).';
  }

  // Act 4: Failure of Industrial Military Tactics
  const act4 = l44.narrative_blocks.find(b => b.act === 4);
  if (act4) {
    console.log('Setting L4.4 Act 4 image to /units/usa/assets/sources/us-soldier-patrolling-swamp.jpg');
    act4.image = '/units/usa/assets/sources/us-soldier-patrolling-swamp.jpg';
    act4.caption = 'An exhausted American soldier wading through swamp water and dense vegetation during a search-and-destroy patrol in the Mekong Delta (1968).';
  }

  // Source D: Add the missing statistics document image
  const srcD = l44.sources.find(s => s.id === 'usa_lesson_4_4_d');
  if (srcD) {
    console.log('Adding missing image to L4.4 Source D...');
    srcD.image = '/units/usa/assets/sources/vietnam_war_dod_casualties_statistics_1975.jpg';
    srcD.image_url = '/units/usa/assets/sources/vietnam_war_dod_casualties_statistics_1975.jpg';
    srcD.src = '/units/usa/assets/sources/vietnam_war_dod_casualties_statistics_1975.jpg';
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(d, null, 2), 'utf8');
console.log('\n✅ Successfully updated data/usa.json with all reconciled visual sources!');

