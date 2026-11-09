const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Projects/the-history-revision-hub';

const weimarGuidedReading = {
  lesson_1_1: [
    {
      question: "According to paragraph [1.1], why did German sailors mutiny at Wilhelmshaven and Kiel in October–November 1918?",
      answer: "Naval commanders ordered a suicidal final attack against the British Royal Navy after the war was already lost."
    },
    {
      question: "Using paragraph [2.1], what forced Kaiser Wilhelm II to abdicate on 9 November 1918?",
      answer: "Striking workers surrounded Berlin government buildings, and Field Marshal Hindenburg warned that the army would no longer fight for him."
    },
    {
      question: "According to paragraph [3.1], why did right-wing nationalists label civilian politicians the 'November Criminals'?",
      answer: "Because civilian politicians like Matthias Erzberger signed the armistice ending the war, which nationalists claimed stabbed the undefeated army in the back."
    },
    {
      question: "Using paragraph [5.2], what fatal flaw in the Weimar Constitution allowed future chancellors to bypass democracy?",
      answer: "Article 48, which empowered the President to suspend civil rights and rule by emergency decree without parliamentary approval."
    }
  ],
  lesson_1_2: [
    {
      question: "According to paragraph [1.1], who led the January 1919 Spartacist Uprising and what was their aim?",
      answer: "Karl Liebknecht and Rosa Luxemburg, who sought to overthrow Ebert's government and establish a communist workers' republic."
    },
    {
      question: "Using paragraph [2.1], why did Germans view the Treaty of Versailles as a humiliating 'Diktat'?",
      answer: "Germany was forbidden from participating in peace negotiations and was forced to accept War Guilt (Article 231) and £6.6 billion in reparations under threat of invasion."
    },
    {
      question: "According to paragraph [3.1], how did the German working class defeat the right-wing Kapp Putsch in March 1920?",
      answer: "By launching a massive general strike that paralyzed Berlin's electricity, water, and transport, forcing Wolfgang Kapp to flee."
    },
    {
      question: "Using paragraph [5.1], what triggered the catastrophic hyperinflation crisis in Germany in 1923?",
      answer: "The government printed vast quantities of paper money to pay striking workers during the French and Belgian military occupation of the Ruhr."
    }
  ],
  lesson_1_3: [
    {
      question: "According to paragraph [1.1], how did Gustav Stresemann end the 1923 hyperinflation crisis?",
      answer: "He burned the old worthless marks and introduced the Rentenmark, a temporary currency backed by agricultural land and industrial gold mortgages."
    },
    {
      question: "Using paragraph [2.1], how did the 1924 Dawes Plan stimulate the German economy?",
      answer: "American banks loaned Germany 800 million gold marks and restructured annual reparation payments into manageable instalments."
    },
    {
      question: "According to paragraph [3.1], what did Germany agree to in the 1925 Locarno Treaties?",
      answer: "Germany accepted its western borders with France and Belgium, and agreed to keep the Rhineland permanently demilitarised."
    },
    {
      question: "Using paragraph [5.1], why did the German economic boom of the 1920s remain vulnerable ('dancing on a volcano')?",
      answer: "Economic recovery depended almost entirely on short-term American loans that could be recalled at any moment."
    }
  ],
  lesson_1_4: [
    {
      question: "According to paragraph [1.1], how did real wages and housing change for German workers between 1924 and 1928?",
      answer: "Real wages rose by over 10% and the state financed the construction of modern municipal apartment blocks."
    },
    {
      question: "Using paragraph [2.1], what characterized the Weimar 'New Woman' of the Golden Twenties?",
      answer: "Short 'Bubikopf' bobbed hair, financial independence through employment, cigarette smoking, and greater personal freedom."
    },
    {
      question: "According to paragraph [3.1], what was the core design philosophy of Walter Gropius and the Bauhaus movement?",
      answer: "Functionalism—clean, unadorned designs using steel, glass, and concrete where 'form follows function'."
    },
    {
      question: "Using paragraph [5.1], why did conservative Germans condemn Weimar culture?",
      answer: "They viewed experimental art, American jazz, and female emancipation as decadent, immoral, and destructive of traditional family values."
    }
  ],
  lesson_2_1: [
    {
      question: "According to paragraph [1.1], what was Adolf Hitler's initial mission when he attended the German Workers' Party (DAP) in 1919?",
      answer: "He was sent by the army as an undercover intelligence agent to spy on political extremist groups in Munich beer halls."
    },
    {
      question: "Using paragraph [2.1], what were two key demands of the NSDAP's 1920 25-Point Programme?",
      answer: "Scrapping the Treaty of Versailles, uniting all Germans into a Greater Germany, and stripping Jews of German citizenship."
    },
    {
      question: "According to paragraph [4.1], what was the Führerprinzip established by Hitler in July 1921?",
      answer: "The principle of total, unquestioned dictatorial leadership, placing Hitler in absolute command of the Nazi party."
    },
    {
      question: "Using paragraph [5.1], what role did Ernst Röhm's SA (Brownshirts) play in the early Nazi party?",
      answer: "They protected Nazi speakers at rallies and violently attacked communist and socialist political opponents in the streets."
    }
  ],
  lesson_2_2: [
    {
      question: "According to paragraph [1.1], why did Hitler launch the Munich Putsch in November 1923?",
      answer: "He sought to exploit public fury over hyperinflation and the Ruhr crisis to overthrow the Bavarian government and march on Berlin."
    },
    {
      question: "Using paragraph [2.1], what happened when Hitler and the SA marched towards the Munich War Ministry on 9 November 1923?",
      answer: "Bavarian state police opened fire at the Feldherrnhalle, killing sixteen Nazis and instantly collapsing the coup."
    },
    {
      question: "According to paragraph [3.1], how did Hitler exploit his 1924 treason trial for national political gain?",
      answer: "He used the courtroom as a propaganda stage to attack the Weimar Republic and dictate Mein Kampf during his comfortable imprisonment at Landsberg."
    },
    {
      question: "Using paragraph [5.1], why did the Nazi party struggle to win votes during the 'Lean Years' (1924–1929)?",
      answer: "Stresemann's economic recovery, rising employment, and American loans made extremist politics unpopular, leaving the Nazis with just 2.6% of votes in 1928."
    }
  ],
  lesson_2_3: [
    {
      question: "According to paragraph [1.1], what global catastrophe struck Germany in October 1929?",
      answer: "The Wall Street Crash in the US, which forced American banks to recall the loans propping up German industry."
    },
    {
      question: "Using paragraph [2.1], how many Germans were unemployed by 1932 and how did Chancellor Brüning respond?",
      answer: "Over 6 million were unemployed; Chancellor Brüning cut unemployment benefits and raised taxes using Article 48 decrees."
    },
    {
      question: "According to paragraph [3.1], why did wealthy industrialists and middle-class Germans begin funding the Nazi party after 1929?",
      answer: "They feared a violent communist revolution as the KPD vote surged, and saw Hitler's SA as the only force capable of crushing the left."
    },
    {
      question: "Using paragraph [4.1], what modern propaganda techniques did Joseph Goebbels use to promote Hitler between 1930 and 1932?",
      answer: "Chartered airplanes ('Hitler over Germany'), mass radio broadcasts, loudspeaker vans, and dramatic torchlit parades."
    }
  ],
  lesson_2_4: [
    {
      question: "According to paragraph [1.1], how did the Nazi party perform in the July 1932 Reichstag elections?",
      answer: "They won 230 seats (37.3% of the vote), becoming the largest single political party in the Reichstag."
    },
    {
      question: "Using paragraph [2.1], why did President Hindenburg initially refuse to appoint Hitler as Chancellor in 1932?",
      answer: "Hindenburg despised Hitler as an uncouth, lower-class 'Bohemian corporal' and refused to hand power to an extremist party."
    },
    {
      question: "According to paragraph [3.1], why did Chancellor Franz von Papen conspire to bring Hitler into government in January 1933?",
      answer: "Papen wanted to replace Chancellor Schleicher and believed he could control Hitler by surrounding him with conservative ministers."
    },
    {
      question: "Using paragraph [4.1], what famous boast did Papen make to convince Hindenburg to appoint Hitler Chancellor on 30 January 1933?",
      answer: "He boasted that they had 'hired' Hitler and would 'push him into a corner until he squeaks' within two months."
    }
  ],
  lesson_3_1: [
    {
      question: "According to paragraph [1.1], who was blamed for the Reichstag Fire on 27 February 1933 and what decree resulted?",
      answer: "Dutch communist Marinus van der Lubbe; Hitler used it to pass the Reichstag Fire Decree, suspending all civil liberties and freedom of speech."
    },
    {
      question: "Using paragraph [2.1], what dictatorial powers did the Enabling Act (March 1933) grant to Adolf Hitler?",
      answer: "It allowed Hitler to make and pass laws for four years without the approval of either the Reichstag or the President."
    },
    {
      question: "According to paragraph [3.1], what was Gleichschaltung and how did it destroy German democracy in 1933?",
      answer: "The policy of 'co-ordination' (nazification), which abolished independent trade unions and banned all rival political parties."
    },
    {
      question: "Using paragraph [4.1], why did Hitler murder Ernst Röhm and the SA leadership during the Night of the Long Knives in June 1934?",
      answer: "To eliminate the SA as a threat to the regular army and secure the military's absolute loyalty to Hitler."
    }
  ],
  lesson_3_2: [
    {
      question: "According to paragraph [1.1], what was the Schutzstaffel (SS) and who commanded it?",
      answer: "Hitler's fanatical blackshirt bodyguard unit, commanded by Heinrich Himmler, which ran the concentration camps."
    },
    {
      question: "Using paragraph [2.1], how did the Gestapo maintain terror despite having relatively few officers?",
      answer: "By relying on voluntary denunciations from ordinary German citizens reporting their neighbours, colleagues, and rivals."
    },
    {
      question: "According to paragraph [3.1], how did Roland Freisler's People’s Court ensure judicial compliance with Nazi policy?",
      answer: "It abolished judicial independence, held show trials with no right of appeal, and handed down thousands of death sentences for 'treason'."
    },
    {
      question: "Using paragraph [4.1], what agreement did Hitler sign with the Catholic Church in 1933 and how was it broken?",
      answer: "The Reichskonkordat with the Vatican; Hitler promised religious freedom but soon shut down Catholic schools and harassed priests."
    }
  ],
  lesson_3_3: [
    {
      question: "According to paragraph [1.1], what was the purpose of Joseph Goebbels' Reich Chamber of Culture?",
      answer: "To censor all German art, music, literature, and theatre, requiring all cultural creators to be Nazi-approved members."
    },
    {
      question: "Using paragraph [2.1], why was the cheap Volksempfänger (People's Receiver) radio so important to Nazi propaganda?",
      answer: "It brought Hitler's speeches directly into ordinary homes and lacked shortwave reception, preventing Germans from hearing foreign broadcasts."
    },
    {
      question: "According to paragraph [3.1], what were Albert Speer's 'Cathedrals of Light' at the annual Nuremberg Rallies?",
      answer: "Massive nocturnal light displays using 130 anti-aircraft searchlights pointing into the night sky to create an aura of religious majesty around Hitler."
    },
    {
      question: "Using paragraph [5.1], what was 'Degenerate Art' and what happened to modernist paintings in 1937?",
      answer: "Modernist, abstract, or expressionist art condemned by Nazis as Jewish or mentally ill, displayed in a mocking Munich exhibition and banned."
    }
  ],
  lesson_3_4: [
    {
      question: "According to paragraph [1.1], why did the majority of ordinary Germans conform to Nazi rule in the 1930s?",
      answer: "A combination of economic recovery (jobs and social stability), genuine patriotism, and terror of the Gestapo."
    },
    {
      question: "Using paragraph [2.1], how did underground socialist and communist cells resist the Nazi regime?",
      answer: "By distributing illegal anti-Nazi leaflets, organizing factory slowdowns, and operating secret courier networks."
    },
    {
      question: "According to paragraph [3.1], how did the Edelweiss Pirates express working-class youth rebellion?",
      answer: "They refused to join the Hitler Youth, wore check shirts and edelweiss flower pins, sang banned songs, and ambushed Hitler Youth patrols."
    },
    {
      question: "Using paragraph [5.1], why did Cardinal von Galen deliver public sermons against the Nazi regime in 1941?",
      answer: "He openly condemned the secret Nazi Action T4 euthanasia programme that murdered physically and mentally disabled patients."
    }
  ],
  lesson_4_1: [
    {
      question: "According to paragraph [1.1], what was the Nazi slogan for the traditional role of German women?",
      answer: "Kinder, Küche, Kirche (Children, Kitchen, Church)."
    },
    {
      question: "Using paragraph [2.1], how did the Law for the Encouragement of Marriage (1933) financially incentivize having children?",
      answer: "Couples received a 1,000-mark marriage loan, and for each child born, 25% of the loan was permanently forgiven."
    },
    {
      question: "According to paragraph [3.1], what was the Honour Cross of the German Mother?",
      answer: "A state medal awarded to mothers: bronze for 4 children, silver for 6, and gold for 8 or more children."
    },
    {
      question: "Using paragraph [5.1], why did Nazi policy towards women's employment reverse after 1936?",
      answer: "Rearmament and the Four-Year Plan created a severe labour shortage, forcing the regime to recruit millions of women back into factories."
    }
  ],
  lesson_4_2: [
    {
      question: "According to paragraph [1.1], what military training was emphasized for boys in the Hitler Youth (Hitlerjugend)?",
      answer: "Marching, rifle shooting, map reading, obstacle courses, and unquestioning obedience to prepare them as soldiers."
    },
    {
      question: "Using paragraph [2.1], what skills were girls taught in the League of German Girls (Bund Deutscher Mädel)?",
      answer: "Physical fitness, cooking, cleaning, child care, and racial eugenics to prepare them for motherhood."
    },
    {
      question: "According to paragraph [3.1], when was membership of the Hitler Youth made compulsory for all eligible German youth?",
      answer: "March 1939, under the Hitler Youth Law."
    },
    {
      question: "Using paragraph [4.1], what was required of schoolteachers under the Nazi Teachers' League (NSLB)?",
      answer: "They had to swear a personal oath of loyalty to Adolf Hitler and teach racial biology, rewriting history to praise German military triumphs."
    }
  ],
  lesson_4_3: [
    {
      question: "According to paragraph [1.1], what was the Reich Labour Service (RAD) and who was required to join?",
      answer: "A compulsory scheme requiring all young men aged 18–25 to complete six months of manual labour on public projects."
    },
    {
      question: "Using paragraph [2.1], how did public works and Autobahn construction reduce unemployment in the 1930s?",
      answer: "They created over 100,000 construction jobs, modernized national infrastructure, and stimulated heavy industry."
    },
    {
      question: "According to paragraph [3.1], what was 'invisible unemployment' in official Nazi economic statistics?",
      answer: "Unemployed women, Jewish citizens, and young men in the RAD or army who were deliberately excluded from official unemployment counts."
    },
    {
      question: "Using paragraph [4.1], what organization replaced independent trade unions and what did the 'Strength Through Joy' (KdF) scheme offer workers?",
      answer: "The German Labour Front (DAF); KdF offered subsidized theatre visits, sports events, beach holidays, and cruise trips."
    }
  ],
  lesson_4_4: [
    {
      question: "According to paragraph [1.1], what was the first national anti-Jewish action organized by the Nazis on 1 April 1933?",
      answer: "A nationwide boycott of Jewish-owned shops, department stores, doctors, and lawyers, with the SA painting Stars of David on shopfronts."
    },
    {
      question: "Using paragraph [2.1], what did the two Nuremberg Laws of September 1935 decree?",
      answer: "The Reich Citizenship Law stripped Jews of German citizenship, and the Blood Protection Law banned marriages and sexual relations between Jews and Aryans."
    },
    {
      question: "According to paragraph [3.1], what other minority groups were targeted by Nazi racial hygiene policies?",
      answer: "Romani people, homosexuals, Jehovah's Witnesses, and mentally or physically disabled citizens subjected to forced sterilization."
    },
    {
      question: "Using paragraph [4.1], what occurred during the Kristallnacht pogrom on 9–10 November 1938?",
      answer: "Nazi mobs and the SA destroyed over 1,000 synagogues, ransacked 7,000 Jewish businesses, murdered 91 Jews, and sent 30,000 Jewish men to concentration camps."
    }
  ]
};

function cleanAndUpgradeLessons(lessons) {
  lessons.forEach(l => {
    // 1. Strip dangling tails from narrative blocks
    (l.narrative_blocks || []).forEach(b => {
      if (b.text) {
        b.text = b.text.replace(/(<\/p>)\s*[^<]+$/, '$1').trim();
      }
      if (b.content) {
        b.content = b.content.replace(/(<\/p>)\s*[^<]+$/, '$1').trim();
      }
    });

    // 2. Attach Guided Reading
    if (weimarGuidedReading[l.id]) {
      l.guided_reading = weimarGuidedReading[l.id];
    }
  });
}

// 1. Update data/weimar_nazi_germany.json
const jsonPath = path.join(ROOT, 'data/weimar_nazi_germany.json');
const weimarData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
cleanAndUpgradeLessons(weimarData.lessons);
fs.writeFileSync(jsonPath, JSON.stringify(weimarData, null, 2), 'utf8');
console.log('Updated data/weimar_nazi_germany.json');

// 2. Update public/data/weimar_nazi_germany.json
const pubJsonPath = path.join(ROOT, 'public/data/weimar_nazi_germany.json');
if (fs.existsSync(pubJsonPath)) {
  fs.writeFileSync(pubJsonPath, JSON.stringify(weimarData, null, 2), 'utf8');
  console.log('Updated public/data/weimar_nazi_germany.json');
}

// 3. Update units/weimar_nazi_germany/data.js
const unitJsPath = path.join(ROOT, 'units/weimar_nazi_germany/data.js');
if (fs.existsSync(unitJsPath)) {
  fs.writeFileSync(unitJsPath, 'window.unitData = ' + JSON.stringify(weimarData, null, 2) + ';\nif (typeof module !== "undefined") { module.exports = window.unitData; }\n', 'utf8');
  console.log('Updated units/weimar_nazi_germany/data.js');
}

// 4. Update public/units/weimar_nazi_germany/data.js
const pubUnitJsPath = path.join(ROOT, 'public/units/weimar_nazi_germany/data.js');
if (fs.existsSync(pubUnitJsPath)) {
  fs.writeFileSync(pubUnitJsPath, 'window.unitData = ' + JSON.stringify(weimarData, null, 2) + ';\nif (typeof module !== "undefined") { module.exports = window.unitData; }\n', 'utf8');
  console.log('Updated public/units/weimar_nazi_germany/data.js');
}

// 5. Update database.json and public/database.json
function updateDbFile(p) {
  if (!fs.existsSync(p)) return;
  const db = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (db.weimar_nazi_germany && db.weimar_nazi_germany.data && db.weimar_nazi_germany.data.lessons) {
    cleanAndUpgradeLessons(db.weimar_nazi_germany.data.lessons);
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${path.basename(p)} via db.weimar_nazi_germany.data.lessons`);
  } else if (db.weimar_nazi_germany && db.weimar_nazi_germany.lessons) {
    cleanAndUpgradeLessons(db.weimar_nazi_germany.lessons);
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${path.basename(p)} via db.weimar_nazi_germany.lessons`);
  }
}

updateDbFile(path.join(ROOT, 'database.json'));
updateDbFile(path.join(ROOT, 'public/database.json'));

console.log('ALL 5 WEIMAR STORES SYNCHRONIZED SUCCESSFULLY!');
