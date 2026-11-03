const { fetchYoutubeMetadata } = require('./fetch_youtube_metadata.cjs');

const candidateList = [
  // KT1
  { lesson: 1, id: 'nVJV8iEAm88', pathway: 'Starter Hook', title: 'Medieval Medicine | Secondary History – Medicine Through Time (BBC Teach)' },
  { lesson: 1, id: 'IOj-Pn5WJkw', pathway: 'Cinematic', title: 'The Physician (2013) | Official Movie Trailer (Ben Kingsley as Ibn Sina / Avicenna)' },
  { lesson: 2, id: '2Nl7a3ORYvw', pathway: 'Documentary Depth', title: 'Blood and Guts: A History of Surgery – Bloody Beginnings (BBC / Michael Mosley)' },
  { lesson: 3, id: 'MvDJMKLEd9o', pathway: 'Case Study', title: 'Weird Plague "Cures" & Medieval Medical Beliefs (Simple History)' },
  { lesson: 5, id: 'Hre4Oaqu1D8', pathway: 'Starter Hook', title: 'How Did People Try to "Cure" the Plague? Flagellants & Miasma (Simple History)' },
  { lesson: 5, id: 'YhsPPBGtquo', pathway: 'Documentary Depth', title: 'The Black Death (1348) – Causes, Miasma & Social Impact (Timelines.tv)' },

  // KT2
  { lesson: 6, id: '80ih_8tFbu0', pathway: 'Starter Hook', title: 'The Royal Society & The Scientific Revolution – GCSE History' },
  { lesson: 6, id: 'Bhbl0eDGmsA', pathway: 'Enquiry Evidence', title: 'The Invention of the Printing Press & Spread of Medical Knowledge' },
  { lesson: 7, id: 'YN8BC9BzLYY', pathway: 'Starter Hook', title: 'Who Was Thomas Sydenham? Bedside Observation & Clinical Classification' },
  { lesson: 7, id: 'KIkIM34fVK8', pathway: 'Documentary Depth', title: 'Thomas Sydenham: The English Hippocrates & The Observation Revolution' },
  { lesson: 8, id: 'f_QuDvhOc7Q', pathway: 'Starter Hook', title: 'Who Was Andreas Vesalius? Correcting Galen & The Anatomical Revolution' },
  { lesson: 8, id: 'walfj2dpU-E', pathway: 'Documentary Depth', title: 'Vesalius, Paré and Harvey | Secondary History – Medicine Through Time (BBC Teach)' },
  { lesson: 9, id: 'z-MUnRsOGEc', pathway: 'Starter Hook', title: 'Who Was William Harvey? The Heart as a Pump & Circulation of Blood' },
  { lesson: 10, id: 'LBvOZO1gmOE', pathway: 'Starter Hook', title: 'The Great Plague of London (1665–1666) | Simple History' },
  { lesson: 10, id: '6cMhO7JpaYE', pathway: 'Cinematic', title: 'Restoration (1995) | 17th-Century Medicine, Quackery & The Great Plague' },

  // KT3
  { lesson: 11, id: 'ZmaoHB5fKB4', pathway: 'Starter Hook', title: 'Pasteur and Koch | Secondary History – Medicine Through Time (BBC Teach)' },
  { lesson: 11, id: 'N9LC-3ZKiok', pathway: 'Scientific Breakthrough', title: 'How a Few Scientists Transformed Germ Theory – Microbe Hunters (TED-Ed)' },
  { lesson: 12, id: 'yqUFy-t4MlQ', pathway: 'Starter Hook', title: 'How We Conquered the Deadly Smallpox Virus: Edward Jenner (TED-Ed)' },
  { lesson: 12, id: 'sJRJeOxX6no', pathway: 'Documentary Depth', title: 'The Life and Work of Edward Jenner | History – True Stories (BBC Teach)' },
  { lesson: 13, id: '0BYWu5Ax0Wk', pathway: 'Starter Hook', title: 'Florence Nightingale and Mary Seacole: Crimean War Military Nursing' },
  { lesson: 13, id: 'FZDfibPtBlI', pathway: 'Case Study', title: 'The Life of Mary Seacole: The British Hotel & Battlefield Care (BBC Teach)' },
  { lesson: 13, id: 'jONlz7vaMnU', pathway: 'Documentary Depth', title: 'The Life and Work of Florence Nightingale | Notes on Nursing & Hospital Reform (BBC Teach)' },
  { lesson: 14, id: 'Vg1hqZanDa0', pathway: 'Starter Hook', title: 'Lister and Simpson | Secondary History – Medicine Through Time (BBC Teach)' },
  { lesson: 14, id: 'z9rKY8MLWTU', pathway: 'Cinematic', title: 'The Knick | Surgery in the Era of Discovery (Cinemax / HBO)' },
  { lesson: 14, id: '2hTZNDyLPLk', pathway: 'Documentary Depth', title: 'Pain, Pus and Poison: Episode 1 (Pain & The Chloroform Revolution) | BBC' },
  { lesson: 15, id: 'TT4Z1Ikf36w', pathway: 'Starter Hook', title: 'Chadwick and Snow | Secondary History – Medicine Through Time (BBC Teach)' },
  { lesson: 15, id: 'MdNXDqCGv3M', pathway: 'Documentary Depth', title: '19th Century Public Health & The 1875 Act | Secondary History (BBC Teach)' },

  // KT4
  { lesson: 16, id: 'BIP0lYrdirI', pathway: 'Starter Hook', title: 'Rosalind Franklin: DNA’s Unsung Hero & Photograph 51 (TED-Ed)' },
  { lesson: 16, id: 'AhsIF-cmoQQ', pathway: 'Scientific Breakthrough', title: 'The Race to Sequence the Human Genome (TED-Ed)' },
  { lesson: 16, id: '1vm3od_UmFg', pathway: 'Documentary Depth', title: 'The DNA Double Helix Discovery | HHMI BioInteractive' },
  { lesson: 17, id: 'REq1ywT0XfQ', pathway: 'Starter Hook', title: 'Magic Bullets: Paul Ehrlich, Salvarsan 606 & Domagk’s Prontosil' },
  { lesson: 17, id: 'bSDCMhxw-zw', pathway: 'Scientific Breakthrough', title: 'The First Magic Bullet: Salvarsan 606 & Chemical Cures' },
  { lesson: 18, id: 'N2-7UQWrYPY', pathway: 'Starter Hook', title: 'Fleming, Florey and Chain | Secondary History – Medicine Through Time (BBC Teach)' },
  { lesson: 18, id: 'CNbnLgetqHs', pathway: 'Documentary Depth', title: 'The Accident That Changed the World: The Discovery of Penicillin (TED-Ed)' },
  { lesson: 19, id: 'CLUmwaff4a8', pathway: 'Starter Hook', title: 'The Dangers of Smoking from Doll to Peto | Medical Research Council' },
  { lesson: 19, id: 'VBWGM630zG0', pathway: 'Documentary Depth', title: 'Sir Richard Doll: The Epidemiologist Who Linked Smoking to Lung Cancer (BMJ)' },
  { lesson: 20, id: '0pnEMBgEG24', pathway: 'Starter Hook', title: 'The Foundation of the National Health Service (1948) | BBC Teach' },
  { lesson: 20, id: 'xUI-7Qluf18', pathway: 'Primary Evidence', title: 'Aneurin Bevan & The Creation of the NHS (1948 Archive) | BBC News' },

  // KT5
  { lesson: 21, id: '9E7xYLv8N2E', pathway: 'Starter Hook', title: 'Life in the Trenches WW1 | Trench Warfare Explained (Imperial War Museums)' },
  { lesson: 21, id: 'YqNYrYUiMfg', pathway: 'Cinematic', title: '1917 (2019) | Frontline Trenches, Traverses & No Man’s Land (Universal Pictures)' },
  { lesson: 22, id: 'zyyx91SomjU', pathway: 'Starter Hook', title: 'Living in the Trenches: Trench Foot, Mud & Squalor (Imperial War Museums)' },
  { lesson: 22, id: 'VTzfD9oY9Xc', pathway: 'Primary Evidence', title: 'Everyday Life in the Trenches: Rations, Sickness & Routine (Imperial War Museums)' },
  { lesson: 23, id: 'H9dgQTM28pM', pathway: 'Starter Hook', title: 'How Poison Gas Became WW1’s Most Feared Weapon (History Hit)' },
  { lesson: 23, id: 'Ghdeo5S_FEo', pathway: 'Documentary Depth', title: 'Gas Attacks & Artillery Trauma in WW1 (The Soldier’s War)' },
  { lesson: 24, id: 'YfxRhLsAAk8', pathway: 'Documentary Depth', title: 'Medicine in the First World War: The Chain of Evacuation (Imperial War Museums)' },
  { lesson: 25, id: 'ZVELfv81Py0', pathway: 'Starter Hook', title: 'WWI Medical Breakthroughs: The Thomas Splint & Mobile X-Rays' },
  { lesson: 25, id: 'Q_Eg6Vh1tZ8', pathway: 'Scientific Breakthrough', title: 'Medical History: The Thomas Splint & Compound Femur Survival' },
  { lesson: 26, id: 'I2O4hsESBLA', pathway: 'Starter Hook', title: 'Blood Transfusions on the Western Front: Sodium Citrate & The 1917 Cambrai Depot' },
  { lesson: 26, id: '94O25548Co0', pathway: 'Documentary Depth', title: 'Harold Gillies & Facial Reconstruction Surgery at Queen’s Hospital Sidcup (The Royal Society)' }
];

async function verifyAllCandidates() {
  console.log(`Verifying ${candidateList.length} candidate videos with YouTube...`);
  let validCount = 0;
  let invalidCount = 0;

  for (const c of candidateList) {
    const meta = await fetchYoutubeMetadata(c.id);
    if (meta.valid) {
      validCount++;
      c.verifiedDuration = meta.duration;
      c.verifiedTitle = meta.title;
      c.author = meta.author;
      console.log(`✅ L${c.lesson} [${c.id}] ${meta.duration} | "${meta.title}" (${meta.author})`);
    } else {
      invalidCount++;
      console.error(`❌ INVALID L${c.lesson} [${c.id}] Status: ${meta.status}`);
    }
  }

  console.log(`\nCandidate verification complete: ${validCount} valid, ${invalidCount} invalid.`);
  if (invalidCount === 0) {
    console.log('🎉 100% of candidate videos are LIVE and VERIFIED!');
  }
}

verifyAllCandidates();

