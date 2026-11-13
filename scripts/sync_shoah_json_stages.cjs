const fs = require('fs');
const path = require('path');

const dataFilePath = path.resolve('c:/Projects/the-history-revision-hub/data/the_shoah.json');
const publicDataFilePath = path.resolve('c:/Projects/the-history-revision-hub/public/data/the_shoah.json');

const raw = fs.readFileSync(dataFilePath, 'utf8');
const data = JSON.parse(raw);

const accessibleQuestions = [
  // Lesson 1
  [
    { step: 1, date: 'c. 1930s', questionHeading: "Where did most of Europe's 9.5 million Jewish people live before 1939?" },
    { step: 2, date: 'c. 1930s', questionHeading: "What was daily life and culture like in the Jewish towns (shtetls) of Eastern Europe?" },
    { step: 3, date: '1871–1933', questionHeading: "How did German Jews show their loyalty to Germany during the First World War?" },
    { step: 4, date: 'c. 1930s', questionHeading: "What made the Sephardic Jewish community in Thessaloniki unique?" },
    { step: 5, date: '19th–20th C.', questionHeading: "Why was Nazi hatred based on 'blood' and race far deadlier than older religious hatred?" }
  ],
  // Lesson 2
  [
    { step: 1, date: '1933–1934', questionHeading: "Why did the Nazis start their persecution by boycotting Jewish shops and firing workers?" },
    { step: 2, date: '1935–1936', questionHeading: "How did the 1935 Nuremberg Laws take away German citizenship from Jewish people?" },
    { step: 3, date: '1935–1938', questionHeading: "How did daily Nazi bans and rules cut Jewish people off from their neighbours?" },
    { step: 4, date: 'Nov 1938', questionHeading: "Why was the violence of Kristallnacht (the November Pogrom) a major turning point?" },
    { step: 5, date: '1938–1939', questionHeading: "What was the Kindertransport, and why were borders closed to adult Jewish refugees?" }
  ],
  // Lesson 3
  [
    { step: 1, date: 'Sept 1939', questionHeading: "How did the invasion of Poland bring two million more Jewish people under Nazi rule?" },
    { step: 2, date: '1939–1940', questionHeading: "Why did the Nazis force Jewish people to wear the Yellow Star badge and do slave labour?" },
    { step: 3, date: '1940–1941', questionHeading: "How were the Warsaw and Łódź ghettos created, and how were they cut off from the world?" },
    { step: 4, date: '1940–1942', questionHeading: "What hardships did families face inside the ghettos, and how did children smuggle food?" },
    { step: 5, date: '1940–1943', questionHeading: "How did Emanuel Ringelblum and the Oneg Shabbat archive secretly preserve the truth?" }
  ],
  // Lesson 4
  [
    { step: 1, date: 'June 1941', questionHeading: "Why was the German invasion of the Soviet Union treated as a war of total destruction?" },
    { step: 2, date: 'Summer 1941', questionHeading: "How did the Einsatzgruppen mobile death squads carry out the 'Holocaust by Bullets'?" },
    { step: 3, date: 'Sept 1941', questionHeading: "What happened during the mass shooting at Babi Yar ravine outside Kyiv?" },
    { step: 4, date: 'Autumn 1941', questionHeading: "How did local helpers in the Baltic states and Ukraine assist Nazi death squads?" },
    { step: 5, date: 'Late 1941', questionHeading: "Why did Nazi leaders switch from face-to-face shootings to using poison gas vans at Chełmno?" }
  ],
  // Lesson 5
  [
    { step: 1, date: 'Jan 1942', questionHeading: "What was the purpose of the 1942 Wannsee Conference, and what did leaders coordinate?" },
    { step: 2, date: '1942–1943', questionHeading: "What made the three Operation Reinhard camps (Belzec, Sobibor, Treblinka) pure death camps?" },
    { step: 3, date: '1942–1944', questionHeading: "How did Auschwitz-Birkenau combine slave labour with industrial gas chambers?" },
    { step: 4, date: 'April–May 1943', questionHeading: "How did young Jewish fighters resist Nazi forces in the 1943 Warsaw Ghetto Uprising?" },
    { step: 5, date: '1943–1944', questionHeading: "How did revolts at Treblinka, Sobibór, and Auschwitz prove that prisoners fought back?" }
  ],
  // Lesson 6
  [
    { step: 1, date: '1941–1945', questionHeading: "How did railway planners, clerks, and civil servants help make the Holocaust happen?" },
    { step: 2, date: '1940–1944', questionHeading: "How did foreign police and governments (like Vichy France and Hungary) help the Nazis?" },
    { step: 3, date: '1940–1945', questionHeading: "Why did so many ordinary people across Europe remain silent bystanders?" },
    { step: 4, date: '1940–1945', questionHeading: "How did rescuers in Denmark and the village of Le Chambon risk their lives to save Jewish people?" },
    { step: 5, date: '1942–1944', questionHeading: "What did Allied leaders know about the death camps, and why did they not bomb the railway tracks?" }
  ],
  // Lesson 7
  [
    { step: 1, date: 'Winter 1944–45', questionHeading: "Why did the SS force starving prisoners onto freezing death marches at the end of the war?" },
    { step: 2, date: 'Spring 1945', questionHeading: "What terrible conditions did British and Allied soldiers find when liberating Bergen-Belsen?" },
    { step: 3, date: '1945–1948', questionHeading: "What challenges did survivors face in Displaced Persons (DP) camps after liberation?" },
    { step: 4, date: '1945–1948', questionHeading: "How did the Nuremberg Trials and Raphael Lemkin establish new laws against genocide?" },
    { step: 5, date: 'Post-1945', questionHeading: "What human and cultural life was destroyed in the Shoah, and why must we remember?" }
  ]
];

data.lessons.forEach((l, lIdx) => {
  if (l.workbook_stages && accessibleQuestions[lIdx]) {
    l.workbook_stages.forEach((st, sIdx) => {
      if (accessibleQuestions[lIdx][sIdx]) {
        st.focus_clue = accessibleQuestions[lIdx][sIdx].questionHeading;
      }
    });
  }
});

fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicDataFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated data/the_shoah.json and public/data/the_shoah.json!');

