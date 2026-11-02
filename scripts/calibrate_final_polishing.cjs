const fs = require('fs');
const path = require('path');

const medicinePaths = [
  path.resolve(__dirname, '../units/edexcel_medicine/data.js'),
  path.resolve(__dirname, '../public/units/edexcel_medicine/data.js')
];

const industrialPaths = [
  path.resolve(__dirname, '../units/industrialisation_and_empire/data.js'),
  path.resolve(__dirname, '../public/units/industrialisation_and_empire/data.js')
];

// 1. Calibrate Medicine Western Front Sources and L11-15 tasks
medicinePaths.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const data = require(fp).default;

  // L11-15 tasks
  for (let i = 10; i <= 14; i++) {
    const l = data.lessons[i];
    const examModel = l.exam_practice?.questions?.[1]?.model;
    if (examModel && l.tasks && l.tasks.length > 0) {
      l.tasks[0].model_answer = examModel;
      l.tasks[0].model = examModel;
      if (l.tasks[1]) {
        l.tasks[1].model_answer = examModel;
        l.tasks[1].model = examModel;
      }
    }
  }

  // Western Front Source Models (Lessons 21-26, index 20-25)
  const wfSourceCalibs = {
    // L21
    20: {
      0: "Source A is useful because it provides an authentic aerial view of the Ypres Salient, showing how frontline trenches were zig-zagged to contain bomb blasts and surrounded by waterlogged shell craters.",
      1: "I would follow up the six-hour evacuation time by examining RAMC Field Ambulance admission books and war diaries to determine how stretcher delays affected casualty survival rates."
    },
    // L22
    21: {
      0: "Source A is useful because it photographically records the severe physical blisters and swollen tissue death of trench foot, proving how winter waterlogging incapacitated frontline soldiers.",
      1: "The purpose of Source B is to enforce mandatory whale oil rubbing and dry sock changes to prevent manpower losses from trench foot.",
      3: "I would follow up the mention of body lice by researching RAMC hygiene reports to see how effective railway steam delousing vans were in reducing trench fever admissions."
    },
    // L23
    22: {
      1: "I would follow up the failure of superficial antiseptics by consulting RAMC surgical records on the adoption of the Carrel-Dakin wound irrigation method.",
      2: "Source C demonstrates that mobile radiographs and coordinate grids allowed surgeons to precisely calculate bullet depth inside the brain before performing delicate trephining operations.",
      3: "The medical officer's purpose is to record the terrifying, suffocating symptoms of chlorine gas poisoning and alert high command to the urgent need for effective respirators."
    },
    // L24
    23: {
      0: "Source A is useful because it depicts stretcher bearers struggling through waist-deep Passchendaele mud, showing how devastated terrain made rapid evacuation almost impossible.",
      1: "Captain Dunn’s purpose is to record the desperate triage conditions at frontline Regimental Aid Posts where medical officers worked under continuous bombardment.",
      3: "I would follow up the role of FANY drivers by checking Red Cross ambulance logs to find out how many casualties they transported from frontline dressing stations."
    },
    // L25
    24: {
      0: "Source A is useful because it records the multi-table operating facilities inside a Casualty Clearing Station, proving that advanced surgical procedures like debridement were performed close to the front.",
      2: "I would follow up the Thomas Splint's introduction by consulting compound fracture survival statistics to verify how mortality rates dropped from 80% to 20%.",
      3: "Source C demonstrates how Marie Curie's mobile radiological vans ('petites Curies') brought diagnostic X-rays directly to frontline stations, allowing surgeons to locate shrapnel before operating."
    },
    // L26
    25: {
      2: "I would follow up Oswald Robertson’s Cambrai blood depot by examining CCS casualty registers to evaluate how stored Group O blood reduced fatal wound shock during battlefield surgery."
    }
  };

  Object.keys(wfSourceCalibs).forEach(lIdxStr => {
    const lIdx = parseInt(lIdxStr, 10);
    const calibs = wfSourceCalibs[lIdx];
    const l = data.lessons[lIdx];
    if (!l || !l.sources) return;
    Object.keys(calibs).forEach(sIdxStr => {
      const sIdx = parseInt(sIdxStr, 10);
      if (l.sources[sIdx]) {
        l.sources[sIdx].model_answer = calibs[sIdx];
        l.sources[sIdx].model = calibs[sIdx];
      }
    });
  });

  fs.writeFileSync(fp, `export default ${JSON.stringify(data, null, 2)};\n`, 'utf8');
  console.log(`Updated Medicine in ${fp}`);
});

// 2. Calibrate Industrialisation L4 Exam Q1
industrialPaths.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const data = require(fp).default;
  const l4 = data.lessons[3];
  if (l4.exam_practice?.questions?.[0]) {
    l4.exam_practice.questions[0].model = "One feature was the widespread destruction of agricultural machinery, where impoverished labourers smashed newly introduced threshing machines. Another feature was the delivery of threatening letters signed by the fictitious 'Captain Swing', warning landowners that their hayricks would be burned if wages were not raised.";
  }
  if (l4.tasks?.[0]) {
    l4.tasks[0].model_answer = l4.exam_practice.questions[0].model;
    l4.tasks[0].model = l4.exam_practice.questions[0].model;
  }
  fs.writeFileSync(fp, `export default ${JSON.stringify(data, null, 2)};\n`, 'utf8');
  console.log(`Updated Industrialisation in ${fp}`);
});

// 3. Ensure all two_features tasks have model_answer at root
const allUnits = fs.readdirSync(path.resolve(__dirname, '../units'));
allUnits.forEach(u => {
  const p1 = path.resolve(__dirname, `../units/${u}/data.js`);
  const p2 = path.resolve(__dirname, `../public/units/${u}/data.js`);
  [p1, p2].forEach(fp => {
    if (!fs.existsSync(fp)) return;
    const data = require(fp).default;
    let modified = false;
    (data.lessons || []).forEach(l => {
      (l.tasks || []).forEach(t => {
        if (t.type === 'two_features' && (!t.model_answer || t.model_answer === '')) {
          if (t.feature_1?.model && t.feature_2?.model) {
            t.model_answer = `${t.feature_1.model} ${t.feature_2.model}`;
            t.model = t.model_answer;
            modified = true;
          }
        }
      });
    });
    if (modified) {
      fs.writeFileSync(fp, `export default ${JSON.stringify(data, null, 2)};\n`, 'utf8');
      console.log(`Populated two_features root models in ${fp}`);
    }
  });
});
