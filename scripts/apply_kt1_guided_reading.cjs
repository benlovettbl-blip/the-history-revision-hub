const fs = require('fs');
const path = require('path');

const kt1GuidedReading = {
  lesson_1_1: [
    {
      question: "According to paragraph [1.1], why did the medieval Catholic Church teach that disease was sent by God?",
      answer: "As a divine punishment for personal sins or a test of faith from God."
    },
    {
      question: "Using paragraph [2.1], how were lepers treated in medieval society?",
      answer: "They were cast out of towns into leper houses (lazar houses) and had to ring a bell to warn people away."
    },
    {
      question: "According to paragraph [3.1], how did medieval physicians use the Zodiac Man diagram?",
      answer: "To check the alignment of stars and planets before performing operations or bloodletting."
    },
    {
      question: "Using paragraph [5.1], why did the medieval Church ban dissection and oppose scientific challenge?",
      answer: "To protect Galen's teachings and Christian doctrine, which held that the human body was created by God and must remain intact."
    }
  ],
  lesson_1_2: [
    {
      question: "According to paragraph [1.1], why was Hippocrates important for medical history?",
      answer: "He developed the first natural, rational explanations for disease rather than blaming gods or spirits."
    },
    {
      question: "Using paragraph [2.1], what were the Four Humours that medieval doctors believed controlled health?",
      answer: "Blood, phlegm, yellow bile (choler), and black bile."
    },
    {
      question: "According to paragraph [3.1], how did Galen’s Theory of Opposites treat an excess of cold, wet phlegm?",
      answer: "By prescribing hot and dry remedies, such as eating hot peppers or warm broths."
    },
    {
      question: "Using paragraph [4.1], what was uroscopy and how did doctors use it to diagnose illness?",
      answer: "Examining the colour, smell, and taste of a patient’s urine using a urine chart to determine humoural balance."
    }
  ],
  lesson_1_3: [
    {
      question: "According to paragraph [1.1], what spiritual treatments did medieval people use to seek healing?",
      answer: "Praying, fasting, going on pilgrimages to holy shrines, and touching holy relics."
    },
    {
      question: "Using paragraph [2.1], what was phlebotomy (bloodletting) and why was it performed?",
      answer: "Removing blood using cupping, leeches, or opening a vein to restore the balance of the Four Humours."
    },
    {
      question: "According to paragraph [3.1], why did medieval physicians prescribe emetics and laxatives?",
      answer: "To purge toxic humours from the stomach and bowels through vomiting and emptying the bowels."
    },
    {
      question: "Using paragraph [4.1], what was theriac and why was it popular in the Middle Ages?",
      answer: "A complex herbal remedy containing up to seventy ingredients used as a universal cure against poison and plague."
    }
  ],
  lesson_1_4: [
    {
      question: "According to paragraph [1.1], why did university-trained physicians rarely touch their patients?",
      answer: "They focused on book learning of Galen and Hippocrates, leaving manual surgical procedures to barber-surgeons."
    },
    {
      question: "Using paragraph [2.1], what did apothecaries sell to medieval customers?",
      answer: "Herbal medicines, ointments, spices, and simples mixed according to traditional recipes."
    },
    {
      question: "According to paragraph [3.1], what operations were barber-surgeons qualified to perform?",
      answer: "Bloodletting, tooth pulling, lancing boils, setting broken bones, and amputating limbs."
    },
    {
      question: "Using paragraph [4.1], what was the primary purpose of medieval monastic hospitals?",
      answer: "To provide spiritual care, shelter, and warmth (\"care not cure\"), rather than treating or curing disease."
    }
  ],
  lesson_1_5: [
    {
      question: "According to paragraph [1.1], in what year and at which Dorset port did the Black Death arrive in England?",
      answer: "1348 at Melcombe Regis (Weymouth), carried by flea-infested black rats on merchant trading ships."
    },
    {
      question: "Using paragraph [2.1], what were the two main forms of plague and their terrifying symptoms?",
      answer: "Bubonic plague (foul-smelling black buboes in groin and armpits) and pneumonic plague (fatal lung infection)."
    },
    {
      question: "According to paragraph [3.1], what desperate treatments did medieval people try against the plague?",
      answer: "Strapping live toads or chickens to buboes, drinking vinegar, bleeding, and whipping themselves (flagellants)."
    },
    {
      question: "Using paragraph [5.1], what proportion of England’s population was killed by the Black Death?",
      answer: "Between one-third and one-half (roughly 30% to 50%) of England's entire population."
    }
  ]
};

function applyUpdates(lessons) {
  let count = 0;
  Object.keys(kt1GuidedReading).forEach(id => {
    const l = lessons.find(x => x.id === id);
    if (!l) return;
    l.guided_reading = kt1GuidedReading[id];
    count++;
  });
  return count;
}

// 1. Update data/edexcel_medicine.json and public/data/edexcel_medicine.json
['data/edexcel_medicine.json', 'public/data/edexcel_medicine.json'].forEach(rel => {
  const p = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(p)) return;
  const json = JSON.parse(fs.readFileSync(p, 'utf8'));
  const updated = applyUpdates(json.lessons);
  fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Updated ${updated} lessons in ${rel}`);
});

// 2. Update units/edexcel_medicine/data.js
const unitJs = path.resolve(__dirname, '../units/edexcel_medicine/data.js');
if (fs.existsSync(unitJs)) {
  let content = fs.readFileSync(unitJs, 'utf8');
  let clean = content;
  if (clean.startsWith('export default ')) clean = clean.substring('export default '.length);
  if (clean.endsWith(';\n')) clean = clean.substring(0, clean.length - 2);
  else if (clean.endsWith(';')) clean = clean.substring(0, clean.length - 1);
  const parsed = JSON.parse(clean);
  const updated = applyUpdates(parsed.lessons);
  fs.writeFileSync(unitJs, `export default ${JSON.stringify(parsed, null, 2)};\n`, 'utf8');
  console.log(`Updated ${updated} lessons in units/edexcel_medicine/data.js`);
}

// 3. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(rel => {
  const p = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(p)) return;
  const db = JSON.parse(fs.readFileSync(p, 'utf8'));
  const med = db.edexcel_medicine?.data || db.edexcel_medicine || (db.units ? db.units.find(u => u.id === 'edexcel_medicine') : null);
  if (med && med.lessons) {
    const updated = applyUpdates(med.lessons);
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${updated} lessons in ${rel}`);
  }
});

console.log('Key Topic 1 Guided Reading successfully populated!');
