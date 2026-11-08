const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

// Complete Edexcel-standard configuration for all 5 interpretation tasks
const edexcelInterpretationConfigs = {
  // 1. Post-War Britain (Lesson 3: Windrush Generation)
  post_war_britain: {
    lessonIndex: 2,
    taskId: 'pwb_l3_contrasting_interpretations',
    source_b: {
      label: 'Source B',
      title: 'Source B: Ministry of Labour Official Statement (June 1948)',
      badge: 'Official Government Record • 1948',
      author: 'Ministry of Labour & National Service Press Release (June 1948)',
      text: 'The arrival of citizens from Jamaica and the West Indies is a welcome event for our recovering economy. British industry faces severe manpower shortages in vital sectors. There are thousands of unfilled vacancies in British Railways, London transport, and our newly founded National Health Service. These British subjects are stepping forward with patriotism and skill to assist the mother country.'
    },
    source_c: {
      label: 'Source C',
      title: 'Source C: Eyewitness Account of the Housing "Colour Bar" (1950s)',
      badge: 'Firsthand Immigrant Testimony • 1950s',
      author: 'Firsthand Testimony of a Jamaican arrival in Notting Hill (1952)',
      text: 'When we walked down the streets seeking a place to live, every door was slammed in our faces. Windows of boarding houses openly displayed handwritten notices saying: "No Coloureds, No Irish, No Dogs". Even when rooms were advertised as vacant, the moment landlords saw our dark skin, they lied and said the room was taken. We were forced into overcrowded, unheated basements and charged extortionate rents.'
    },
    sub_question_b: {
      prompt: "3(b). Study Interpretations 1 and 2. They give different views about the reception faced by the Windrush Generation in post-war Britain. What is the main difference between these views? Explain your answer, using details from both interpretations. [4 marks]",
      model: "The main difference between Interpretations 1 and 2 is that Interpretation 1 gives a positive view of a welcoming mother country offering employment, whereas Interpretation 2 presents the reception as defined by widespread racism, government hostility, and social discrimination.<br><br>Interpretation 1 emphasizes that Britain \"warmly welcomes these sons and daughters of the Empire\" and claims their arrival represented the \"harmonious family of the British Commonwealth\" with \"plentiful jobs in transport and healthcare\".<br><br>In contrast, Interpretation 2 argues that their arrival was met with \"government hostility and widespread racial discrimination\", stressing that migrants were \"barred from rental accommodation with signs proclaiming 'No Coloureds'\" and subjected to \"low-paid night shifts and racist violence\"."
    },
    sub_question_c: {
      prompt: "3(c). Suggest one reason why Interpretations 1 and 2 give different views about the reception faced by the Windrush Generation. You may use Sources B and C to help explain your answer. [4 marks]",
      model: "One reason why Interpretations 1 and 2 give different views is that the authors have relied on different sources of evidence.<br><br>Interpretation 1 could be based on official government records like Source B, which focuses on post-war labor recruitment, showing that Caribbean migrants were welcomed as \"British subjects stepping forward with patriotism and skill\" to fill \"thousands of unfilled vacancies in British Railways, London transport, and the NHS\".<br><br>On the other hand, Interpretation 2 is supported by firsthand testimony like Source C, which reveals the everyday reality of racial hostility and housing exclusion, where \"windows of boarding houses openly displayed notices saying 'No Coloureds, No Irish, No Dogs'\" and migrants were forced into squalid basements.<br><br>Because the two historians gave weight to contrasting types of evidence—official government labor bulletins versus personal migrant accounts of racial discrimination—they arrived at contrasting interpretations."
    }
  },

  // 2. Australia (Lesson 4: Frontier Wars)
  australia: {
    lessonIndex: 3,
    taskId: 'aus_l4_contrasting_interpretations',
    source_b: {
      label: 'Source B',
      title: 'Source B: Colonial Government Official Proclamation (1828)',
      badge: 'Official Legal Proclamation • 1828',
      author: 'Lieutenant-Governor George Arthur, Proclamation to the Settlers of Van Diemen’s Land (1828)',
      text: 'The native inhabitants of this territory are under the sovereign protection of British law. Any settler, stockman, or convict who shall commit murder, unprovoked assault, or cruelty against an Aboriginal person will be prosecuted with the same utmost rigor of the law as if the offense were committed against a white subject.'
    },
    source_c: {
      label: 'Source C',
      title: 'Source C: Frontier Squatter Deposition & Station Journal (1838)',
      badge: 'Frontier Settler Deposition • 1838',
      author: 'Sworn Deposition from the Gwydir District, New South Wales (1838)',
      text: 'The blacks have speared over twenty bullocks and cannot be tolerated on the cattle runs. Our stockmen formed an armed party of ten horsemen, pursued the tribe into the ranges at dawn, and surrounded their camp. Shots were exchanged and thirty natives were killed so that our grazing lands could be secured from further molestation.'
    },
    sub_question_b: {
      prompt: "3(b). Study Interpretations 1 and 2. They give different views about the nature of the Australian Frontier Wars. What is the main difference between these views? Explain your answer, using details from both interpretations. [4 marks]",
      model: "The main difference between Interpretations 1 and 2 is that Interpretation 1 portrays frontier conflict as minimal and isolated criminal skirmishes where British authorities upheld the rule of law, whereas Interpretation 2 portrays it as a protracted, continent-wide war of military conquest and mass dispossession.<br><br>Interpretation 1 claims that frontier conflict \"consisted mostly of isolated criminal murders and livestock theft rather than warfare\" and emphasizes that \"British authorities consistently sought to uphold the rule of law and protect Indigenous people\".<br><br>In contrast, Interpretation 2 argues that \"a protracted, bloody war of conquest was fought across the entire continent\", stressing that \"at least 20,000 Indigenous Australians died defending their ancestral lands against military forces, mounted police, and squatter vigilantes in a true war of national resistance\"."
    },
    sub_question_c: {
      prompt: "3(c). Suggest one reason why Interpretations 1 and 2 give different views about the Australian Frontier Wars. You may use Sources B and C to help explain your answer. [4 marks]",
      model: "One reason why Interpretations 1 and 2 give different views is that the authors have relied on different sources of evidence.<br><br>Interpretation 1 could be based on official government records like Source B, which reflects colonial proclamations declaring that native inhabitants were \"under the sovereign protection of British law\" and that violence against them would be \"prosecuted with utmost rigor\".<br><br>On the other hand, Interpretation 2 is supported by evidence like Source C, which contains firsthand squatter depositions and pastoral journals describing how armed horsemen \"pursued the tribe into the ranges at dawn\" and killed thirty Indigenous defenders to secure grazing land.<br><br>Because the two historians drew upon contrasting bodies of evidence—official legal proclamations versus private station records of vigilante violence—they formed opposing historical interpretations."
    }
  },

  // 3. First British Empire (Lesson 3: Enslaved Resistance)
  first_british_empire: {
    lessonIndex: 2,
    taskId: 'fbe_l3_contrasting_interpretations',
    source_b: {
      label: 'Source B',
      title: 'Source B: Jamaican Plantation Management Journal (c. 1770)',
      badge: 'Plantation Management Record • c. 1770',
      author: 'Estate Manager’s Instruction Book, St. Catherine Parish, Jamaica (c. 1770)',
      text: 'The field hands on this sugar estate are disinclined to labour unless the driver stands continually over them with the whip. When left unsupervised in the cane-pieces, they loiter, feign sickness, or spoil the cutting knives. Firm discipline and constant vigilance are necessary to maintain the production of sugar on which the colony depends.'
    },
    source_c: {
      label: 'Source C',
      title: 'Source C: British Military Despatch on the First Maroon War (1734)',
      badge: 'Military Despatch • 1734',
      author: 'Captain Stoddart’s Official Despatch to Governor Edward Trelawny (1734)',
      text: 'Our detachment engaged the rebel Maroons commanded by Queen Nanny in the Blue Mountains. The rebels fought from behind rocky parapets, employing guerrilla tactics, tactical horn-calls, and mountain ambushes that inflicted heavy casualties on our regulars. Their scouts know every defile, making it impossible to dislodge them without severe loss.'
    },
    sub_question_b: {
      prompt: "3(b). Study Interpretations 1 and 2. They give different views about the nature of enslaved African resistance. What is the main difference between these views? Explain your answer, using details from both interpretations. [4 marks]",
      model: "The main difference between Interpretations 1 and 2 is that Interpretation 1 portrays enslaved Africans as naturally passive and requiring forced discipline to perform labor, whereas Interpretation 2 presents them as determined resisters who waged an active, heroic campaign of guerrilla warfare against slavery.<br><br>Interpretation 1 states that \"plantation negroes are naturally indolent and require the perpetual surveillance and discipline of the driver’s whip to extract labour\", claiming that without European mastery order would dissolve.<br><br>In contrast, Interpretation 2 argues that \"enslaved Africans waged an unrelenting war of resistance through daily sabotage, spiritual preservation, and armed guerrilla struggle\", highlighting that \"Queen Nanny proved that African military strategy could humble the British imperial army\"."
    },
    sub_question_c: {
      prompt: "3(c). Suggest one reason why Interpretations 1 and 2 give different views about enslaved African resistance. You may use Sources B and C to help explain your answer. [4 marks]",
      model: "One reason why Interpretations 1 and 2 give different views is that the authors have relied on different sources of evidence.<br><br>Interpretation 1 could be based on pro-slavery documents like Source B, which reflects plantation overseers' biased journals claiming that enslaved workers were \"disinclined to labour unless the driver stands continually over them with the whip\".<br><br>On the other hand, Interpretation 2 is supported by evidence like Source C, which contains colonial military despatches describing how Maroon fighters under Queen Nanny used \"guerrilla tactics, tactical horn-calls, and mountain ambushes that inflicted heavy casualties on our regulars\".<br><br>Because the historians gave weight to contrasting types of evidence—plantation management logs written by slaveholders versus British military reports of armed resistance—they reached contrasting conclusions."
    }
  },

  // 4. Great War (Lesson 3: Naval Arms Race)
  great_war: {
    lessonIndex: 2,
    taskId: 'historical_interpretations',
    source_b: {
      label: 'Source B',
      title: 'Source B: British Admiralty Confidential Memorandum (1908)',
      badge: 'Admiralty Strategic Report • 1908',
      author: 'First Sea Lord Sir John Fisher, Confidential Memorandum to the Cabinet (1908)',
      text: 'The rapid expansion of the German High Seas Fleet directly opposite our shores is a menace of the gravest character. If Germany achieves naval parity or superiority in the North Sea, the British Empire ceases to exist within twenty-four hours. Our naval estimates must ensure two keels to one against any possible German combination to secure national survival.'
    },
    source_c: {
      label: 'Source C',
      title: 'Source C: German Imperial Treasury & War Ministry Report (1912)',
      badge: 'Imperial Financial Return • 1912',
      author: 'German Imperial War Ministry Memorandum to Chancellor Theobald von Bethmann-Hollweg (1912)',
      text: 'The Army Expansion Bill must take absolute priority over all naval construction. The international crisis in the Balkans proves that the decisive battle for the Reich will be fought on land against France and Russia. Battleship building under Admiral Tirpitz must be curtailed to allocate all imperial revenues to modernising infantry artillery and field corps.'
    },
    sub_question_b: {
      prompt: "3(b). Study Interpretations 1 and 2. They give different views about the causes and impact of the Anglo-German naval arms race. What is the main difference between these views? Explain your answer, using details from both interpretations. [4 marks]",
      model: "The main difference between Interpretations 1 and 2 is that Interpretation 1 views the naval arms race as the single most dangerous catalyst that made European war inevitable, whereas Interpretation 2 argues that the impact of the naval race has been exaggerated and that it was effectively over by 1912.<br><br>Interpretation 1 states that the naval race was \"the single most dangerous element in pre-1914 European diplomacy\" and that German battleships directly across the North Sea convinced Britain that Germany was an \"implacable foe seeking European hegemony\".<br><br>In contrast, Interpretation 2 contends that \"historians have greatly exaggerated the fatal impact of the naval race\", stating that \"by 1912, the battleship race was effectively over: Germany had abandoned the contest to concentrate resources on its land army\"."
    },
    sub_question_c: {
      prompt: "3(c). Suggest one reason why Interpretations 1 and 2 give different views about the naval arms race. You may use Sources B and C to help explain your answer. [4 marks]",
      model: "One reason why Interpretations 1 and 2 give different views is that the authors have relied on different sources of evidence.<br><br>Interpretation 1 could be based on British strategic documents like Source B, which reflects Admiralty alarms warning that the German fleet was \"a menace of the gravest character\" and that naval defeat would mean \"the British Empire ceases to exist within twenty-four hours\".<br><br>On the other hand, Interpretation 2 is supported by evidence like Source C, which contains German War Ministry records showing that by 1912 \"battleship building must be curtailed\" because \"the army expansion bill must take absolute priority\" for a land war in Europe.<br><br>Because the two historians gave weight to different sets of historical records—British naval panic in 1908 versus German budgetary reallocation to land armies in 1912—they reached contrasting conclusions."
    }
  },

  // 5. Great War Part 2 (Lesson 3: Colonial Troops)
  great_war_part2: {
    lessonIndex: 2,
    taskId: 'gw2_l3_q3_contrasting_interpretations',
    source_b: {
      label: 'Source B',
      title: 'Source B: British War Propaganda Bureau Press Bulletin (1915)',
      badge: 'Official Imperial Bulletin • 1915',
      author: 'Official Government Press Release, London (1915)',
      text: 'The King-Emperor sends his warmest greeting to the brave soldiers of the Indian Army and the overseas Dominions fighting in the trenches of Flanders. Their magnificent gallantry, loyalty, and unhesitating devotion prove to the civilized world the indissoluble bond of mutual brotherhood uniting all races of the British Empire in this righteous struggle.'
    },
    source_c: {
      label: 'Source C',
      title: 'Source C: Confidential War Office Report on Colonial Battalions (1918)',
      badge: 'Confidential Military Report • 1918',
      author: 'War Office Court of Inquiry into Discontent at Taranto Depot (December 1918)',
      text: 'Discontent among colonial battalions at Taranto arose from deep-seated racial grievances. Soldiers of the British West Indies Regiment were subjected to discriminatory pay, denied combat parity, barred from holding commissioned officer rank, and ordered to perform degrading physical fatigues, including cleaning latrines for white soldiers.'
    },
    sub_question_b: {
      prompt: "3(b). Study Interpretations 1 and 2. They give different views about the experiences and contributions of colonial troops in the Great War. What is the main difference between these views? Explain your answer, using details from both interpretations. [4 marks]",
      model: "The main difference between Interpretations 1 and 2 is that Interpretation 1 portrays colonial troops as voluntarily devoted to defending the Empire in a spirit of imperial brotherhood, whereas Interpretation 2 highlights that non-white troops faced systemic racism, unequal treatment, and deliberate historical erasure.<br><br>Interpretation 1 states that colonial troops \"rushed forward with magnificent devotion to defend the King-Emperor\" and claims this proved the Empire was held together by \"mutual love, loyalty, and common sacrifice\".<br><br>In contrast, Interpretation 2 argues that their treatment was \"defined by systemic racism\", pointing out that non-white soldiers were \"barred from becoming officers, paid a fraction of British wages, and subjected to brutal floggings\", with their sacrifice \"whitewashed from British national memory\"."
    },
    sub_question_c: {
      prompt: "3(c). Suggest one reason why Interpretations 1 and 2 give different views about the experiences of colonial troops. You may use Sources B and C to help explain your answer. [4 marks]",
      model: "One reason why Interpretations 1 and 2 give different views is that the authors have relied on different sources of evidence.<br><br>Interpretation 1 could be based on official wartime propaganda like Source B, which celebrated the \"magnificent gallantry, loyalty, and unhesitating devotion\" of Indian troops fighting in Flanders to project imperial unity.<br><br>On the other hand, Interpretation 2 is supported by evidence like Source C, which contains confidential War Office court records revealing that colonial soldiers were subjected to \"discriminatory pay, barred from officer rank, and ordered to perform degrading physical fatigues, including cleaning latrines for white soldiers\".<br><br>Because the historians drew upon contrasting sources—wartime public propaganda versus confidential military reports detailing racial injustice—they formed opposing historical interpretations."
    }
  }
};

// Function to update task object with sources and edexcel models
function enrichTask(task, cfg) {
  let changed = false;
  
  if (cfg.source_b) {
    task.source_b = cfg.source_b;
    task.source1 = cfg.source_b;
    changed = true;
  }
  if (cfg.source_c) {
    task.source_c = cfg.source_c;
    task.source2 = cfg.source_c;
    changed = true;
  }
  if (cfg.sub_question_b) {
    task.sub_question_b = cfg.sub_question_b;
    task.model_answer_b = cfg.sub_question_b.model;
    changed = true;
  }
  if (cfg.sub_question_c) {
    task.sub_question_c = cfg.sub_question_c;
    task.model_answer_c = cfg.sub_question_c.model;
    changed = true;
  }

  // Also construct composite model_answer
  task.model_answer = `<strong style="color: #6d28d9; display: block; margin-bottom: 6px;">Part (b) [4 marks]: ${cfg.sub_question_b.prompt}</strong><div style="line-height: 1.6;">${cfg.sub_question_b.model}</div><div style="margin: 14px 0; border-top: 1px dashed #ddd6fe;"></div><strong style="color: #6d28d9; display: block; margin-bottom: 6px;">Part (c) [4 marks]: ${cfg.sub_question_c.prompt}</strong><div style="line-height: 1.6;">${cfg.sub_question_c.model}</div>`;
  task.model = task.model_answer;

  return changed;
}

function updateUnit(uId, data) {
  const cfg = edexcelInterpretationConfigs[uId];
  if (!cfg) return false;
  let changed = false;

  const lessons = data.lessons || (data.curriculum && data.curriculum.lessons) || [];
  if (lessons[cfg.lessonIndex]) {
    const l = lessons[cfg.lessonIndex];
    (l.tasks || []).forEach(t => {
      if (t.id === cfg.taskId || t.type === 'historical_interpretations') {
        if (enrichTask(t, cfg)) changed = true;
      }
    });
  }
  return changed;
}

// 1. Update data/*.json and public/data/*.json
['data', 'public/data'].forEach(subDir => {
  const dirPath = path.join(repoRoot, subDir);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && !f.includes('package'));
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    try {
      const json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      if (file === 'database.json') {
        let dbChanged = false;
        Object.keys(edexcelInterpretationConfigs).forEach(uKey => {
          if (json[uKey] && updateUnit(uKey, json[uKey])) dbChanged = true;
        });
        if (dbChanged) {
          fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
          console.log(`Updated database file ${subDir}/${file}`);
        }
      } else {
        const uId = json.id || file.replace('.json', '');
        if (edexcelInterpretationConfigs[uId] && updateUnit(uId, json)) {
          fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
          console.log(`Updated unit file ${subDir}/${file}`);
        }
      }
    } catch (e) {
      console.error(`Error updating ${subDir}/${file}:`, e.message);
    }
  });
});

// 2. Update root database.json and public/database.json
['database.json', 'public/database.json'].forEach(relPath => {
  const dbPath = path.join(repoRoot, relPath);
  if (fs.existsSync(dbPath)) {
    const json = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    let changed = false;
    Object.keys(edexcelInterpretationConfigs).forEach(uKey => {
      if (json[uKey] && updateUnit(uKey, json[uKey])) changed = true;
    });
    if (changed) {
      fs.writeFileSync(dbPath, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Updated ${relPath}`);
    }
  }
});

// 3. Update units/*/data.js and public/units/*/data.js
['units', 'public/units'].forEach(subDir => {
  const dirPath = path.join(repoRoot, subDir);
  if (!fs.existsSync(dirPath)) return;
  Object.keys(edexcelInterpretationConfigs).forEach(uKey => {
    const dataJsPath = path.join(dirPath, uKey, 'data.js');
    if (!fs.existsSync(dataJsPath)) return;
    try {
      const content = fs.readFileSync(dataJsPath, 'utf8');
      const match = content.match(/export\s+default\s+({[\s\S]+});?\s*$/);
      if (match) {
        const obj = JSON.parse(match[1]);
        if (updateUnit(uKey, obj)) {
          fs.writeFileSync(dataJsPath, `export default ${JSON.stringify(obj, null, 2)};\n`, 'utf8');
          console.log(`Updated ${subDir}/${uKey}/data.js`);
        }
      }
    } catch (e) {
      console.error(`Error updating ${subDir}/${uKey}/data.js:`, e.message);
    }
  });
});

console.log('All interpretation tasks enriched with Edexcel Source B/C and model answers!');

