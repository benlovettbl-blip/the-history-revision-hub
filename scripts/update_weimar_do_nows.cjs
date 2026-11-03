const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../public/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const weimar = db.weimar_nazi_germany.data || db.weimar_nazi_germany;

const additions = {
  lesson_3_1: [
    {
      question: "What 1919 treaty imposed Article 231 (War Guilt) and £6.6 billion reparations on the Weimar Republic? (Prior Topic)",
      answer: "The Treaty of Versailles."
    },
    {
      question: "Who was the moderate German foreign minister who negotiated the 1924 Dawes Plan and 1925 Locarno Treaties? (Prior Topic)",
      answer: "Gustav Stresemann."
    }
  ],
  lesson_3_2: [
    {
      question: "What was the 'stab-in-the-back' myth (Dolchstoßlegende) propagated by German military leaders like Ludendorff? (Prior Topic)",
      answer: "The false conspiracy theory that the German army was undefeated in the field and betrayed from within by socialists, communists, and Jews."
    },
    {
      question: "What 1928 international pact signed by 62 nations renounced war as an instrument of national policy? (Prior Topic)",
      answer: "The Kellogg-Briand Pact."
    }
  ],
  lesson_3_3: [
    {
      question: "What paramilitary group, nicknamed the 'Brownshirts' and led by Ernst Röhm, protected Nazi meetings and attacked opponents? (Prior Topic)",
      answer: "The SA (Sturmabteilung / Stormtroopers)."
    },
    {
      question: "How did the 1923 hyperinflation crisis affect Germany's middle classes? (Prior Topic)",
      answer: "It wiped out their life savings, bank deposits, and war pensions, permanently alienating them from the Weimar democracy."
    }
  ],
  lesson_3_4: [
    {
      question: "What major financial pact in 1929 reduced German reparations to £2 billion and extended payment over 59 years? (Prior Topic)",
      answer: "The Young Plan."
    },
    {
      question: "In what city was the 1919 constitution for the new German democratic republic drafted and approved? (Prior Topic)",
      answer: "Weimar (giving the republic its popular historical name)."
    }
  ],
  lesson_4_1: [
    {
      question: "What emergency decree did Hindenburg sign after the Reichstag Fire in February 1933, suspending civil liberties? (Prior Topic)",
      answer: "The Decree for the Protection of People and State (Reichstag Fire Decree)."
    },
    {
      question: "What law passed in March 1933 gave Hitler dictatorial power to enact legislation without the Reichstag? (Prior Topic)",
      answer: "The Enabling Act (Gesetz zur Behebung der Not von Volk und Reich)."
    }
  ],
  lesson_4_2: [
    {
      question: "What violent purge took place between 30 June and 2 July 1934 to eliminate Ernst Röhm and the SA leadership? (Prior Topic)",
      answer: "The Night of the Long Knives (Operation Hummingbird)."
    },
    {
      question: "What oath did all German armed forces take on 2 August 1934 following President Hindenburg's death? (Prior Topic)",
      answer: "A personal oath of unconditional loyalty and obedience to Adolf Hitler as Führer and Supreme Commander."
    }
  ],
  lesson_4_3: [
    {
      question: "Who was appointed Minister of Public Enlightenment and Propaganda in March 1933? (Prior Topic)",
      answer: "Dr Joseph Goebbels."
    },
    {
      question: "What secret state police force, created by Hermann Göring and later commanded by Heinrich Himmler, operated above the law? (Prior Topic)",
      answer: "The Gestapo (Geheime Staatspolizei)."
    }
  ],
  lesson_4_4: [
    {
      question: "What July 1933 agreement was signed between Nazi Germany and the Vatican guaranteeing Catholic religious rights in exchange for political neutrality? (Prior Topic)",
      answer: "The Reichskonkordat (Concordat)."
    },
    {
      question: "Which Protestant pastor founded the anti-Nazi Confessing Church and was later imprisoned at Dachau? (Prior Topic)",
      answer: "Pastor Martin Niemöller."
    }
  ]
};

let modifiedCount = 0;
for (const lesson of weimar.lessons) {
  if (additions[lesson.id]) {
    if (!lesson.do_now.items) lesson.do_now.items = [];
    if (lesson.do_now.items.length === 8) {
      lesson.do_now.items.push(...additions[lesson.id]);
      modifiedCount++;
      console.log(`✅ Topped up ${lesson.id} to ${lesson.do_now.items.length} questions.`);
    }
  }
}

console.log(`Total Weimar lessons updated: ${modifiedCount}`);

// Save to public/database.json, database.json, units/weimar_nazi_germany/data.js, public/units/weimar_nazi_germany/data.js
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

const rootDbPath = path.resolve(__dirname, '../database.json');
if (fs.existsSync(rootDbPath)) {
  fs.writeFileSync(rootDbPath, JSON.stringify(db, null, 2), 'utf8');
}

const fileContent = 'export default ' + JSON.stringify(weimar, null, 2) + ';\n';
fs.writeFileSync(path.resolve(__dirname, '../units/weimar_nazi_germany/data.js'), fileContent, 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../public/units/weimar_nazi_germany/data.js'), fileContent, 'utf8');

console.log('Weimar Nazi Germany files successfully updated!');

