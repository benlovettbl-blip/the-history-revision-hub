const fs = require('fs');
const path = require('path');

const medicinePath = path.join(__dirname, '..', 'data', 'edexcel_medicine.json');
const pubMedicinePath = path.join(__dirname, '..', 'public', 'data', 'edexcel_medicine.json');
const dbPath = path.join(__dirname, '..', 'database.json');
const pubDbPath = path.join(__dirname, '..', 'public', 'database.json');

const data = JSON.parse(fs.readFileSync(medicinePath, 'utf8'));

// The remaining 47 terms curated with authoritative GCSE Edexcel history explanations
const remainingClues = {
  "Facing resistance from the Royal College of Physicians": "Established London physicians in the Royal College defended ancient Galenic theory, dismissing Thomas Sydenham's focus on clinical bedside observations as unscholarly.",
  "Stepping down from the elevated university pulpit": "In 1537 at the University of Padua, Vesalius broke centuries of tradition by stepping down from the elevated lecturer's pulpit to dissect human cadavers with his own hands.",
  "Facing furious resistance from traditional Galenists": "Conservative professors fiercely attacked Vesalius, claiming that human anatomy had physically degenerated since ancient times rather than admitting Galen had been mistaken.",
  "Lacking anaesthetics, antiseptics, and germ theory": "Although Vesalius dramatically improved anatomical knowledge, surgery remained crude and lethal because doctors still lacked effective anaesthetics, antiseptics, or an understanding of infection.",
  "Observing the slow-beating hearts of frogs and snakes": "William Harvey dissected cold-blooded reptiles and amphibians because their slow heart rates allowed him to observe how individual chambers pumped blood.",
  "Challenging Galen’s two separate blood systems": "Harvey overturned Galen's theory of two separate blood systems—nutritive blood from the liver and vital blood from the heart—proving blood circulated continuously in one closed loop.",
  "Lacking microscopes to show artery-vein connections": "Because 17th-century microscopes could not resolve microscopic capillaries connecting arteries to veins, many doctors rejected Harvey's theory until Marcello Malpighi observed capillaries in 1661.",
  "Spreading through poor crowded London parishes": "The Great Plague of 1665 ravaged crowded, unsanitary suburban parishes like St Giles, where poor families lived in damp tenements infested with black rats and fleas.",
  "Foul airborne damp blamed for illness": "Before Pasteur, most doctors adhered to the miasma theory, believing that damp, foul-smelling air from rotting waste spontaneously generated disease within human bodies.",
  "Microscopes seeing tiny swimming creatures": "Early 19th-century microscopists observed microorganisms in rotting food and diseased tissue, but believed these microbes were the byproduct, rather than the cause, of decay.",
  "Shining light beams through dusty boxes": "Physicist John Tyndall designed sealed, dust-free glass boxes and used light beams to demonstrate that sterile broth remained pure until exposed to airborne bacterial particles.",
  "Spraying smelly carbolic acid on cut flesh": "Joseph Lister's success spraying carbolic acid antiseptic onto open surgical wounds provided practical clinical proof that airborne microbes caused gangrene and sepsis.",
  "Taking crisp black-and-white photos of germs": "Robert Koch attached cameras to microscopes, producing unambiguous photomicrographs of distinct bacteria that convinced sceptical British doctors that specific germs caused specific diseases.",
  "Injecting farm animals to test poisons": "Koch tested his experimental postulates by injecting pure bacterial cultures into healthy laboratory mice and sheep to observe whether they developed the exact symptoms of disease.",
  "Scabbing sores blinding young children": "Smallpox was a terrifying epidemic disease that killed roughly one-third of victims, leaving survivors permanently scarred with pockmarks or blinded by facial lesions.",
  "Milking cows with clear smooth skin": "Edward Jenner investigated Gloucestershire folklore that milkmaids who contracted mild cowpox sores from udders possessed clear skin and seemed immune to deadly smallpox.",
  "Dosing boy with deadly pox without illness": "In July 1796, Jenner tested his vaccine by deliberately inoculating eight-year-old James Phipps with virulent smallpox matter, proving the boy was completely immune.",
  "Voting thirty thousand pounds in gold coins": "In 1802 and 1807, the British Parliament voted generous parliamentary grants totalling £30,000 to fund Jenner's vaccination research and establish national supply clinics.",
  "Giving free scratches to village babies": "Charitable organizations like the Royal Jennerian Society provided free cowpox vaccinations to hundreds of poor infants across Britain to eradicate smallpox.",
  "Fining poor parents for refusing jabs": "The 1853 Compulsory Vaccination Act imposed harsh fines and prison sentences on parents who failed to vaccinate infants within three months of birth.",
  "Angry street protests marching with banners": "The Anti-Vaccination League organised mass public protests, arguing that compulsory injections infringed on personal liberty and injected animal filth into human blood.",
  "Crowded dark rooms smelling of festering wounds": "Early 19th-century hospital wards were unventilated, squalid death traps where unwashed nurses shared dirty bandages between gangrenous surgical patients.",
  "Drawing colourful polar pie charts for MPs": "Florence Nightingale pioneered statistical data visualization, using colorful 'polar area' coxcomb diagrams to prove to politicians that poor sanitation killed far more soldiers than combat.",
  "Building long narrow brick ward pavilions": "Nightingale championed the pavilion hospital design, featuring separate, well-ventilated wings with large cross-windows to disperse infectious air and prevent hospital fever.",
  "Uniformed women learning medical rules at St Thomas'": "Founded in 1860, the Nightingale Training School at St Thomas' Hospital trained disciplined, educated nurses in anatomy, hygiene, and clinical care.",
  "Stern matrons inspecting spotless bedside tables": "Nightingale matrons established strict ward hierarchies, inspecting bedside cleanliness, white aprons, and fresh bedding daily to eliminate infection.",
  "Fusing clean hands with microbe science": "By the late 19th century, Nightingale's empirical emphasis on hygiene merged with Pasteur and Lister's germ science to create modern aseptic hospital care.",
  "Breathing sweet laughing gas at fairgrounds": "Before modern surgical anaesthesia, dentists and travelling showmen demonstrated nitrous oxide (laughing gas) at public exhibitions for amusement.",
  "Sniffing heavy liquid vapour under dinner table": "In November 1847, Edinburgh obstetrician James Simpson and his colleagues tested chloroform vapors in his dining room, quickly collapsing unconscious onto the floor.",
  "Treating green sewage water with smelly chemicals": "Joseph Lister was inspired by reports that carbolic acid disinfectant stopped foul fermentation and disease in cattle exposed to municipal sewage in Carlisle.",
  "Piles of human excrement rotting near houses": "In rapidly expanding industrial towns, overflowing privy cesspools and uncollected dung heaps seeped raw sewage into shallow groundwater wells.",
  "Doctors burning pitch barrels in foggy streets": "During the 1854 cholera epidemic, public health officials still believed bad smells spread disease, ordering barrels of tar and pitch burned to purify city air.",
  "Boiling brown river mud halting Parliament debates": "During the Great Stink of 1858, parliamentarians abandoned work as the boiling, untreated sewage in the River Thames produced an overwhelming, sickening stench.",
  "Growing wrinkled green garden peas": "In the 1860s, Austrian monk Gregor Mendel cross-bred garden pea plants to discover fundamental mathematical laws of genetic inheritance and dominant-recessive traits.",
  "Spotting dark rod shapes inside cells": "In the late 19th century, microscopists using aniline dyes identified dark, rod-like thread structures inside cell nuclei, naming them chromosomes.",
  "Assuming heavy protein chains hold secrets": "Until the 1940s, most biochemists assumed that complex hereditary information had to be stored in intricate proteins rather than simple nucleic acids.",
  "Revealing clear fuzzy X-shaped shadow marks": "In 1952, Rosalind Franklin and Raymond Gosling captured 'Photograph 51', an X-ray diffraction image whose distinct cross pattern proved DNA had a double helix structure.",
  "Locking four chemical pairs like puzzle pieces": "James Watson and Francis Crick built their 1953 DNA model around complementary base pairing: adenine always bonding with thymine, and cytosine with guanine.",
  "Linking laboratory supercomputers across six nations": "Launched in 1990, the international Human Genome Project coordinated laboratories and supercomputers across six countries to map all 3 billion chemical base pairs in human DNA.",
  "Matching targeted pills to personal body code": "Mapping the human genome enabled pharmacogenomics, allowing modern doctors to design tailored therapies matching a patient's specific genetic profile.",
  "Counting abnormal white cells on glass slides": "Modern clinical laboratories use automated electronic counters and stained blood smears to detect abnormal white blood cells and diagnose leukemia.",
  "Banishing deadly childhood fevers with wonder drugs": "The introduction of penicillin, sulfonamides, and routine vaccines in the mid-20th century eradicated deadly infectious diseases like scarlet fever and diphtheria.",
  "Rising chest tumours and clogged heart arteries": "As people lived longer and smoking and fatty diets became widespread, chronic lifestyle conditions like cardiovascular disease and lung cancer became Britain's leading killers.",
  "Extinguishing glowing cigarettes outside pub doors": "To combat deadly passive smoking, England introduced legislation on 1 July 2007 banning smoking in all enclosed workplaces, restaurants, and pubs.",
  "Taxing sugary fizzy cans and advertising fruit": "Modern government health campaigns use fiscal sugar taxes and television junk food advertising bans to combat escalating rates of childhood obesity and type-2 diabetes.",
  "Testing hundreds of toxic yellow arsenic mixtures": "In 1909, Paul Ehrlich's assistant Sahachiro Hata tested hundreds of synthetic chemical compounds, discovering compound 606 (Salvarsan) cured syphilis without killing the host.",
  "Saving sick daughter from arm-amputation death": "In 1935, Gerhard Domagk injected his own daughter Hildegard with red Prontosil dye, successfully curing a severe streptococcal blood infection and saving her arm from amputation."
};

let applied = 0;
data.lessons.forEach(l => {
  if (!l.workbook_stages) return;
  l.workbook_stages.forEach(ws => {
    ws.words.forEach(w => {
      if (typeof w === 'object' && remainingClues[w.term]) {
        w.clue = remainingClues[w.term];
        applied++;
      }
    });
  });
});

console.log(`Applied ${applied} remaining curated clues to Edexcel Medicine.`);

fs.writeFileSync(medicinePath, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(pubMedicinePath, JSON.stringify(data, null, 2), 'utf8');

[dbPath, pubDbPath].forEach(dbp => {
  if (fs.existsSync(dbp)) {
    const db = JSON.parse(fs.readFileSync(dbp, 'utf8'));
    if (db.units && db.units.edexcel_medicine) {
      db.units.edexcel_medicine = data;
      fs.writeFileSync(dbp, JSON.stringify(db, null, 2), 'utf8');
    }
  }
});
console.log('Synchronised all medicine files and databases successfully!');

