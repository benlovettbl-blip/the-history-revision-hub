const fs = require('fs');
const path = require('path');

const curationShoah = {
  1: {
    5: {
      words: [
        { term: "religious anti-Judaism", clue: "Centuries-old Christian theology blaming Jews for the death of Christ, restricting guild membership and land ownership." },
        { term: "racial antisemitism", clue: "The 19th-century pseudo-scientific doctrine treating Jewish identity as an unchangeable biological infection carried in the blood." },
        { term: "pseudo-scientific biological racism", clue: "The Social Darwinist theory that human races were locked in an existential biological struggle for survival and supremacy." }
      ],
      model_sentence: "While medieval Church hatred was rooted in <strong>religious anti-Judaism</strong>, late nineteenth-century nationalists embraced <strong>racial antisemitism</strong> grounded in <strong>pseudo-scientific biological racism</strong>."
    }
  },
  2: {
    2: {
      words: [
        { term: "Nuremberg Laws", clue: "The September 1935 legal statutes that formally stripped German Jews of citizenship, political rights, and marital freedom." },
        { term: "Reich Citizenship Law", clue: "The decree stripping Jews of German citizenship and reducing them to 'subjects of the state' without basic constitutional rights." },
        { term: "Law for Protection of German Blood", clue: "The statute criminalizing marriage and sexual relations between Jewish citizens and Germans of 'Aryan' blood." }
      ],
      model_sentence: "Announced at the September 1935 Nuremberg Party Rally, the <strong>Nuremberg Laws</strong> enacted the <strong>Reich Citizenship Law</strong> alongside the <strong>Law for Protection of German Blood</strong>."
    },
    3: {
      words: [
        { term: "400 separate anti-Jewish decrees", clue: "The pervasive web of bureaucratic regulations passed between 1933 and 1938 barring Jews from medicine, law, parks, and universities." },
        { term: "'social death' exclusion", clue: "The complete, systematic isolation of Jews from ordinary German society and public spaces through legal segregation." },
        { term: "Aryanization of businesses", clue: "The forced transfer of Jewish-owned shops, factories, and property to non-Jewish German buyers at rock-bottom prices." }
      ],
      model_sentence: "Enforced through more than <strong>400 separate anti-Jewish decrees</strong>, the systematic <strong>Aryanization of businesses</strong> inflicted catastrophic <strong>'social death' exclusion</strong> upon German Jews."
    }
  },
  3: {
    2: {
      words: [
        { term: "Hans Frank (General Government)", clue: "Nazi Governor-General of occupied central Poland who oversaw forced labor, ghettoization, and plunder from Wawel Castle." },
        { term: "compulsory Yellow Star badge", clue: "The yellow Star of David badge that all Polish Jews aged ten and over were forced to wear on their clothing under pain of death." },
        { term: "forced labour decree", clue: "The October 1939 decree conscripting all Jewish men aged 14 to 60 into brutal manual labor battalions without pay or rights." }
      ],
      model_sentence: "Under the authority of <strong>Hans Frank (General Government)</strong>, occupation officials enacted a draconian <strong>forced labour decree</strong> and mandated the <strong>compulsory Yellow Star badge</strong>."
    },
    4: {
      words: [
        { term: "180 to 220 calories a day", clue: "The deliberate starvation rations allotted to Polish Jews in sealed ghettoes, barely eight percent of adult daily nutritional needs." },
        { term: "deliberate starvation policy", clue: "Nazi economic planning designed to exterminate urban ghetto populations through famine, hypothermia, and typhus epidemics." },
        { term: "Warsaw child smugglers", clue: "Heroic children who squeezed through drainage gutters and holes in the brick wall to bring food into the starving Warsaw Ghetto." }
      ],
      model_sentence: "Confronting a ruthless <strong>deliberate starvation policy</strong> providing only <strong>180 to 220 calories a day</strong>, heroic <strong>Warsaw child smugglers</strong> risked execution to smuggle food past guards."
    }
  },
  4: {
    2: {
      words: [
        { term: "SS Einsatzgruppen", clue: "Four mobile paramilitary death squads (A, B, C, and D) assigned to follow Wehrmacht armies and execute Soviet Jews and commissars." },
        { term: "Order Police battalions", clue: "Militarized German police battalions, such as Reserve Police Battalion 101, who carried out mass roundups and shooting executions." },
        { term: "'Holocaust by Bullets'", clue: "The phase of the genocide where over 1.5 million Jewish civilians were murdered in face-to-face mass shootings across the USSR." }
      ],
      model_sentence: "Following the invasion of the Soviet Union, <strong>SS Einsatzgruppen</strong> mobile death squads cooperated with <strong>Order Police battalions</strong> to conduct the horrific <strong>'Holocaust by Bullets'</strong>."
    },
    3: {
      words: [
        { term: "Babyn Yar ravine massacre", clue: "The ravine outside Kyiv, Ukraine, where 33,771 Jewish men, women, and children were methodically shot over two days in September 1941." },
        { term: "33,771 shot in 36 hours", clue: "The exact execution count recorded in SS Operational Situation Report No. 101 documenting the slaughter at Babyn Yar." },
        { term: "Sonderkommando 4a & Order Police", clue: "The specialized SS execution unit led by Paul Blobel and assisted by Police Battalion 45 that organized the Babyn Yar massacre." }
      ],
      model_sentence: "During the horrific <strong>Babyn Yar ravine massacre</strong> outside Kyiv, <strong>Sonderkommando 4a & Order Police</strong> murdered <strong>33,771 shot in 36 hours</strong> into mass burial trenches."
    },
    4: {
      words: [
        { term: "Ponary Forest massacres", clue: "The wooded pits outside Vilnius, Lithuania, where over 70,000 Jewish victims were shot by Einsatzgruppen and local collaborators." },
        { term: "Einsatzgruppe A killing squads", clue: "The SS unit operating in the Baltic states responsible for murdering nearly 250,000 Jews within six months of the invasion." },
        { term: "local Baltic collaboration", clue: "Auxiliary militia units from Lithuania and Latvia who actively carried out pogroms and mass shootings alongside SS commanders." }
      ],
      model_sentence: "At the <strong>Ponary Forest massacres</strong>, the genocidal operations of <strong>Einsatzgruppe A killing squads</strong> were facilitated by extensive <strong>local Baltic collaboration</strong>."
    }
  },
  6: {
    3: {
      words: [
        { term: "bystander complicity", clue: "The widespread passivity, indifference, and tacit acceptance of anti-Jewish persecution by ordinary citizens across occupied Europe." },
        { term: "ordinary European citizens", clue: "The general populace who witnessed arrests, deportations, and public humiliation of neighbors but chose not to intervene." },
        { term: "pervasive culture of silence", clue: "The climate of fear, censorship, and social conformity that allowed Nazi authorities to execute genocide without public outcry." }
      ],
      model_sentence: "Across Nazi-occupied territories, <strong>bystander complicity</strong> and a <strong>pervasive culture of silence</strong> enabled deportation trains to roll while <strong>ordinary European citizens</strong> looked away."
    },
    4: {
      words: [
        { term: "Rescue of the Danish Jews", clue: "The heroic underground evacuation in October 1943 where Danish citizens ferried over 7,200 Jews across the sea to neutral Sweden." },
        { term: "Le Chambon-sur-Lignon sanctuary", clue: "The French Protestant mountain village led by Pastor André Trocmé that sheltered and saved 3,500 Jewish refugees." },
        { term: "Righteous Among the Nations", clue: "The official honour conferred by Yad Vashem upon non-Jewish rescuers who risked their lives to save Jewish people from the Holocaust." }
      ],
      model_sentence: "Extraordinary rescue operations like the <strong>Rescue of the Danish Jews</strong> and the <strong>Le Chambon-sur-Lignon sanctuary</strong> earned courageous protectors the title of <strong>Righteous Among the Nations</strong>."
    },
    5: {
      words: [
        { term: "Allied inaction dilemmas", clue: "The controversial refusal of Britain and the US to modify immigration quotas or bomb Auschwitz railway lines to halt mass murder." },
        { term: "Jan Karski courier reports", clue: "The eyewitness intelligence smuggled out of the Warsaw Ghetto by Polish underground courier Jan Karski to Churchill and Roosevelt." },
        { term: "refusal to bomb Auschwitz rail lines", clue: "The deliberate military decision by Allied commanders prioritizing frontline military victory over humanitarian bombing missions." }
      ],
      model_sentence: "Despite compelling eyewitness testimonies delivered through <strong>Jan Karski courier reports</strong>, <strong>Allied inaction dilemmas</strong> culminated in the tragic <strong>refusal to bomb Auschwitz rail lines</strong>."
    }
  },
  7: {
    1: {
      words: [
        { term: "evacuation death marches (1944–45)", clue: "The forced winter transfers of over 250,000 starving concentration camp inmates into Germany as Soviet armies approached." },
        { term: "SS camp guard brutality", clue: "The routine execution of any prisoner who collapsed or faltered on the frozen roads during death marches." },
        { term: "winter forced evacuation", clue: "The freezing, chaotic marches in January 1945 from Auschwitz, Stutthof, and Gross-Rosen where tens of thousands perished." }
      ],
      model_sentence: "During the desperate <strong>winter forced evacuation</strong> of camps, rampant <strong>SS camp guard brutality</strong> turned the <strong>evacuation death marches (1944–45)</strong> into mass death traps."
    },
    3: {
      words: [
        { term: "Displaced Persons (DP) camps", clue: "Temporary refugee camps in Germany, Austria, and Italy housing over 250,000 surviving European Jews with nowhere else to go." },
        { term: "Windermere child survivors", clue: "A group of 300 traumatized orphan children brought from liberated camps to the Lake District in 1945 to begin rehabilitation." },
        { term: "psychological trauma of liberation", clue: "The devastating grief experienced by survivors upon discovering that their families, homes, and entire communities were annihilated." }
      ],
      model_sentence: "While hundreds of thousands languished in <strong>Displaced Persons (DP) camps</strong>, three hundred <strong>Windermere child survivors</strong> arrived in Britain seeking recovery from the <strong>psychological trauma of liberation</strong>."
    },
    5: {
      words: [
        { term: "Shoah historical memory", clue: "The collective preservation of the facts, victims, and lessons of the Holocaust through monuments, archives, and education." },
        { term: "survivor oral testimony", clue: "Recorded first-person accounts by witnesses like Elie Wiesel and Primo Levi that provide irreplaceable human truth about the genocide." },
        { term: "imperative of remembrance", clue: "The ethical duty of future generations to remember the Shoah and vigorously resist antisemitism and hate in all forms." }
      ],
      model_sentence: "Anchored in authentic <strong>survivor oral testimony</strong>, preserving <strong>Shoah historical memory</strong> fulfills an urgent moral <strong>imperative of remembrance</strong> for the civilized world."
    }
  }
};

const shoahPath = path.join(__dirname, '../data/the_shoah.json');
const publicShoahPath = path.join(__dirname, '../public/data/the_shoah.json');
const dbPath = path.join(__dirname, '../database.json');
const publicDbPath = path.join(__dirname, '../public/database.json');

const shoahData = JSON.parse(fs.readFileSync(shoahPath, 'utf8'));

let stagesUpdated = 0;
let errors = [];

shoahData.lessons.forEach((lesson, lIdx) => {
  const lessonNum = lIdx + 1;
  const stages = lesson.workbook_stages || lesson.stages || [];

  stages.forEach((stage, sIdx) => {
    const stageNum = sIdx + 1;
    const curated = curationShoah[lessonNum] && curationShoah[lessonNum][stageNum];

    if (curated) {
      stage.words = curated.words;
      stage.key_terms = curated.words;
      stage.model_sentence = curated.model_sentence;

      curated.words.forEach(w => {
        if (w.term.endsWith(':')) errors.push(`Trailing colon in Shoah L${lessonNum}S${stageNum}: ${w.term}`);
        if (!curated.model_sentence.includes(`<strong>${w.term}</strong>`)) {
          errors.push(`Missing term in model: Shoah L${lessonNum}S${stageNum} -> ${w.term}`);
        }
      });
      stagesUpdated++;
    }
  });
});

if (errors.length > 0) {
  console.error(`Validation errors (${errors.length}):`, errors);
  process.exit(1);
}

fs.writeFileSync(shoahPath, JSON.stringify(shoahData, null, 2), 'utf8');
console.log(`Updated ${shoahPath}`);

if (fs.existsSync(publicShoahPath)) {
  fs.writeFileSync(publicShoahPath, JSON.stringify(shoahData, null, 2), 'utf8');
  console.log(`Updated ${publicShoahPath}`);
}

if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  db.the_shoah = shoahData;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('Updated database.json (the_shoah key)');
}

if (fs.existsSync(publicDbPath)) {
  const pdb = JSON.parse(fs.readFileSync(publicDbPath, 'utf8'));
  pdb.the_shoah = shoahData;
  fs.writeFileSync(publicDbPath, JSON.stringify(pdb, null, 2), 'utf8');
  console.log('Updated public/database.json (the_shoah key)');
}

console.log(`Successfully healed all ${stagesUpdated} flagged stages of The Shoah!`);

