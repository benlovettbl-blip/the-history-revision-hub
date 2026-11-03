const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'units', 'usa', 'data.js');
const content = fs.readFileSync(filePath, 'utf8');
const jsonText = content.replace(/^export default\s+/, '').replace(/;\s*$/, '');
const data = JSON.parse(jsonText);

const l44 = data.lessons.find(l => l.id === 'lesson_4_4');
if (!l44) {
  console.error('Lesson 4.4 not found in usa/data.js!');
  process.exit(1);
}

const newSourceA = {
  id: "usa_lesson_4_4_a",
  letter: "A",
  type: "written_speech",
  title: "Source A: President Nguyen Van Thieu's Televised Resignation Address (21 April 1975)",
  author: "President Nguyen Van Thieu (Republic of Vietnam)",
  date: "21 April 1975",
  text: "\"The United States has not respected its promises. It is an inhumane act by an ally. You ran away and left us to do the job that you could not do... You asked us to do an impossible thing, like a man who is given only three bullets to shoot an elephant... You sold South Vietnam to the communists.\"",
  attribution: "National Television Broadcast, Saigon / Vietnam Center and Sam Johnson Vietnam Archive, Texas Tech University.",
  question_badge: "Ally Betrayal & Military Collapse",
  question: "What does Source A reveal about the immediate causes of the collapse of South Vietnam in April 1975?",
  model_answer: "Source A reveals that South Vietnamese leaders blamed their total collapse on the United States abandoning its military and financial commitments. Thieu argued that after the US withdrawal under Vietnamization and Congressional cuts to military aid, ARVN forces were left desperately outgunned by Soviet-equipped North Vietnamese divisions.",
  provenance_clues: {
    author: "President Nguyen Van Thieu, Head of State of South Vietnam.",
    audience: "The South Vietnamese public, military commanders, and the international diplomatic community.",
    motive: "To deflect blame for ARVN's military catastrophe onto American abandonment and Congressional betrayal.",
    hinge_question: "Was the collapse of South Vietnam inevitable once US ground forces withdrew, or did Congressional aid cuts seal its doom?"
  },
  teacher_notes: {
    source_context: "Delivered by South Vietnamese President Nguyen Van Thieu in an emotional two-hour televised farewell address on 21 April 1975, just days before Saigon fell. Thieu bitterly accused Washington of breaking the secret written pledges made by President Nixon to intervene with airpower if Hanoi violated the 1973 Paris Peace Accords. **Hinge Question:** Was the collapse of South Vietnam inevitable once US ground forces withdrew, or did Congressional aid cuts seal its doom?"
  },
  hinge_question: "Was the collapse of South Vietnam inevitable once US ground forces withdrew, or did Congressional aid cuts seal its doom?",
  source_context: "Delivered by South Vietnamese President Nguyen Van Thieu in an emotional two-hour televised farewell address on 21 April 1975, just days before Saigon fell. Thieu bitterly accused Washington of breaking the secret written pledges made by President Nixon to intervene with airpower if Hanoi violated the 1973 Paris Peace Accords. **Hinge Question:** Was the collapse of South Vietnam inevitable once US ground forces withdrew, or did Congressional aid cuts seal its doom?"
};

const newSourceB = {
  id: "usa_lesson_4_4_b",
  letter: "B",
  type: "photograph",
  title: "Source B: Rooftop Helicopter Evacuation of Saigon During Operation Frequent Wind (29 April 1975)",
  date: "29 April 1975",
  image: "/units/usa/assets/sources/saigon-embassy-evacuation.jpg",
  image_url: "/units/usa/assets/sources/saigon-embassy-evacuation.jpg",
  src: "/units/usa/assets/sources/saigon-embassy-evacuation.jpg",
  source: "/units/usa/assets/sources/saigon-embassy-evacuation.jpg",
  attribution: "Hubert van Es / Corbis-Bettmann Archive, Saigon (22 Gia Long Street)",
  caption: "A CIA employee helps evacuees climb a rooftop ladder to board an Air America Bell UH-1 helicopter during Operation Frequent Wind, hours before communist forces entered Saigon.",
  question_badge: "The Fall of Saigon",
  question: "What can you infer from Source B about the desperation and final collapse of American involvement in Vietnam?",
  model_answer: "Source B illustrates the frantic, chaotic end of America's twenty-year intervention. With North Vietnamese artillery shelling the airport and roads blocked, the desperate rooftop scramble to board fleeing helicopters symbolized total defeat and the impossibility of an orderly American exit.",
  provenance_clues: {
    author: "Hubert van Es, independent photojournalist for United Press International (UPI).",
    audience: "Global news readers and television audiences.",
    motive: "To document the dramatic, panicked final hours of the American presence in Saigon.",
    hinge_question: "Why did the rooftop helicopter evacuation become the defining visual symbol of American failure in Southeast Asia?"
  },
  teacher_notes: {
    source_context: "Captured by Dutch photojournalist Hubert van Es from the roof of the UPI bureau in Saigon on 29 April 1975. The image shows South Vietnamese civilians and officials desperately ascending a ladder to board an evacuation helicopter on the roof of a CIA apartment building at 22 Gia Long Street. **Hinge Question:** Why did the rooftop helicopter evacuation become the defining visual symbol of American failure in Southeast Asia?"
  },
  hinge_question: "Why did the rooftop helicopter evacuation become the defining visual symbol of American failure in Southeast Asia?",
  source_context: "Captured by Dutch photojournalist Hubert van Es from the roof of the UPI bureau in Saigon on 29 April 1975. The image shows South Vietnamese civilians and officials desperately ascending a ladder to board an evacuation helicopter on the roof of a CIA apartment building at 22 Gia Long Street. **Hinge Question:** Why did the rooftop helicopter evacuation become the defining visual symbol of American failure in Southeast Asia?"
};

// Existing Source B becomes Source C (Ho Chi Minh Trail)
const existingB = l44.sources.find(s => s.image && s.image.includes('ho-chi-minh-trail-bicycles')) || l44.sources[1];
const newSourceC = JSON.parse(JSON.stringify(existingB));
newSourceC.id = "usa_lesson_4_4_c";
newSourceC.letter = "C";
newSourceC.title = newSourceC.title.replace(/^Source B:/, 'Source C:');

// Existing Source A becomes Source D (Exhausted Soldier in Mekong Delta)
const existingA = l44.sources.find(s => s.image && s.image.includes('us-soldier-patrolling-swamp')) || l44.sources[0];
const newSourceD = JSON.parse(JSON.stringify(existingA));
newSourceD.id = "usa_lesson_4_4_d";
newSourceD.letter = "D";
newSourceD.title = newSourceD.title.replace(/^Source A:/, 'Source D:');

// Existing Source C becomes Source E (War Powers Resolution)
const existingC = l44.sources.find(s => s.image && s.image.includes('war_powers_resolution')) || l44.sources[2];
const newSourceE = JSON.parse(JSON.stringify(existingC));
newSourceE.id = "usa_lesson_4_4_e";
newSourceE.letter = "E";
newSourceE.title = newSourceE.title.replace(/^Source C:/, 'Source E:');

// Update narrative blocks
// Block 1
l44.narrative_blocks[0].image = undefined;
l44.narrative_blocks[0].image_url = undefined;
l44.narrative_blocks[0].caption = undefined;
l44.narrative_blocks[0].sources = [ newSourceA ];

// Block 2
l44.narrative_blocks[1].image = "/units/usa/assets/sources/saigon-embassy-evacuation.jpg";
l44.narrative_blocks[1].image_url = "/units/usa/assets/sources/saigon-embassy-evacuation.jpg";
l44.narrative_blocks[1].caption = "A CIA employee helps evacuees climb a rooftop ladder to board an Air America Bell UH-1 helicopter during Operation Frequent Wind, hours before communist forces entered Saigon (29 April 1975).";
l44.narrative_blocks[1].sources = [ newSourceB ];

// Block 3
l44.narrative_blocks[2].sources = [ newSourceC ];

// Block 4
l44.narrative_blocks[3].sources = [ newSourceD ];

// Block 5
l44.narrative_blocks[4].sources = [ newSourceE ];

// Update root sources array
l44.sources = [ newSourceA, newSourceB, newSourceC, newSourceD, newSourceE ];

const outputContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(filePath, outputContent, 'utf8');
console.log('Successfully updated units/usa/data.js');

const publicFilePath = path.join(__dirname, '..', 'public', 'units', 'usa', 'data.js');
fs.writeFileSync(publicFilePath, outputContent, 'utf8');
console.log('Successfully updated public/units/usa/data.js');

