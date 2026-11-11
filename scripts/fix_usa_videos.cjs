const fs = require('fs');

function overhaulUsaVideos(usaObj) {
  // 1. Fix lesson_2_1 (Freedom Rides and Sit-ins)
  const l21 = usaObj.lessons.find(l => l.id === 'lesson_2_1');
  if (l21) {
    l21.video = [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=1zBY6gkpbTg",
        "id": "1zBY6gkpbTg",
        "title": "The Freedom Riders History | Smithsonian Magazine",
        "duration": "2 mins 13 secs",
        "pathway": "Starter Hook",
        "teacher_guidance": "Archival newsreels and survivor testimony from the May 1961 CORE and SNCC Freedom Rides, testing Supreme Court desegregation of interstate bus terminals. Recommended Watch Window: 00:00–02:10 • Lesson Phase: Quick Starter Check (0–3m). Tone Alert: Fast, dramatic archival footage showing white supremacist mob violence.",
        "viewing_task": "<ol><li><strong>[00:40] Quick Check:</strong> In which Alabama town was a Greyhound bus carrying integrated Freedom Riders firebombed by a Ku Klux Klan mob on Mother's Day, 14 May 1961?</li><li><strong>[01:30] Hinge Question:</strong> Why did the Freedom Riders deliberately provoke arrests and endure violent beatings across the Deep South rather than relying solely on gradual courtroom litigation?</li></ol>",
        "model_answer": "<ol><li><strong>Quick Check:</strong> Anniston, Alabama.</li><li><strong>Hinge Question:</strong> The riders (led by James Farmer and John Lewis) understood that Southern state authorities were openly flouting the 1960 <em>Boynton v. Virginia</em> Supreme Court ruling banning terminal segregation. By physically placing their bodies in harm's way and filling Southern jails, they forced national television networks to broadcast white police and mob brutality into Northern living rooms, compelling Attorney General Robert F. Kennedy and the Interstate Commerce Commission (ICC) to strictly enforce federal desegregation.</li></ol>"
      },
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=F624q1jBd0Y",
        "id": "F624q1jBd0Y",
        "title": "Student Civil Rights Activism: Crash Course Black American History #37 | CrashCourse",
        "duration": "11 mins 53 secs",
        "pathway": "Enquiry Evidence",
        "teacher_guidance": "Clint Smith analyzes the transition from legalism to mass direct-action youth protest: the Greensboro Four, Diane Nash, the Nashville workshops on non-violent direct action, and the founding of SNCC. Recommended Watch Window: 01:10–07:45 • Lesson Phase: Guided Instruction & Archival Investigation. Tone Alert: Engaging, analytically deep examination of non-violent tactical discipline.",
        "viewing_task": "<ol><li><strong>[02:00] Recall:</strong> Name the department store lunch counter in Greensboro, North Carolina where four Black college students staged the first famous sit-in on 1 February 1960.</li><li><strong>[04:30] Explain:</strong> Describe the rigorous non-violent direct-action training developed by James Lawson in Nashville: why were students trained to endure physical assault and insults without retaliating?</li><li><strong>[07:15] Challenge:</strong> Evaluate how the creation of the Student Nonviolent Coordinating Committee (SNCC) in April 1960 marked a decisive generational shift away from the traditional NAACP and SCLC leadership styles.</li></ol>",
        "model_answer": "<ol><li><strong>Recall:</strong> F.W. Woolworth store in Greensboro.</li><li><strong>Explain:</strong> Rev. James Lawson organized workshops where students role-played being spat upon, shoved, having hot coffee poured on them, and hearing racial slurs. This psychological hardening ensured that during actual sit-ins, students remained totally peaceful, dignified, and silent. Televised contrasts between well-dressed, polite Black students studying at counters and vicious white mobs beating them stripped segregation of any moral defense.</li><li><strong>Challenge:</strong> Under the guidance of Ella Baker, SNCC rejected the hierarchical, preacher-dominated top-down model of Martin Luther King Jr.'s SCLC and the slow legalism of Roy Wilkins' NAACP. SNCC championed grassroots \"group-centered leadership\", empowering youth and local rural Southern communities to organize their own voter registration drives, despite extreme danger.</li></ol>"
      },
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=dJqA6PQRh3U",
        "id": "dJqA6PQRh3U",
        "title": "Sound Smart: The Freedom Rides | HISTORY",
        "duration": "2 mins 30 secs",
        "pathway": "Cinematic",
        "teacher_guidance": "Concise archival summary from The HISTORY Channel of the May 1961 integrated bus journeys through the Deep South, the violent attacks in Anniston and Montgomery, and the federal Interstate Commerce Commission desegregation order.",
        "viewing_task": "<ol><li><strong>[00:45] Quick Check:</strong> What was the specific objective of the Congress of Racial Equality (CORE) when organizing the Freedom Rides in 1961?</li><li><strong>[01:50] Hinge Question:</strong> How did televised images of burned buses and beaten riders force Attorney General Robert F. Kennedy and the Interstate Commerce Commission (ICC) to enforce desegregation?</li></ol>",
        "model_answer": "<ol><li><strong>Quick Check:</strong> To test whether Southern states were obeying the Supreme Court's ruling (Boynton v. Virginia) banning segregation in interstate bus terminals, waiting rooms, and lunch counters.</li><li><strong>Hinge Question:</strong> The riders anticipated white violent retaliation; when national television broadcast local police complicity and mob brutality, the Kennedy administration was internationally humiliated on the Cold War stage, compelling the ICC to ban all segregation in interstate travel by November 1961.</li></ol>"
      }
    ];
    l21.extra_videos = [];
  }

  // 2. Fix lesson_2_2 (Birmingham & Selma, Civil Rights Act & Voting Rights Act)
  const l22 = usaObj.lessons.find(l => l.id === 'lesson_2_2');
  if (l22) {
    l22.video = [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=TLberHUJgHY",
        "id": "TLberHUJgHY",
        "title": "The Children's Crusade: How 1963 Birmingham Kids Changed America | History",
        "duration": "4 mins 30 secs",
        "pathway": "Starter Hook",
        "teacher_guidance": "High-impact archival overview of the May 1963 Birmingham Campaign (\"Project C\"), SCLC's deployment of student marchers, Police Commissioner Bull Connor's police dogs and firehoses, and JFK's federal intervention. Recommended Watch Window: 00:00–04:15 • Lesson Phase: Quick Starter Check (0–3m). Tone Alert: Powerful, emotive archival footage showing the moral courage of child marchers.",
        "viewing_task": "<ol><li><strong>[01:10] Quick Check:</strong> Which Birmingham Commissioner of Public Safety directed police to unleash attack dogs and high-pressure firehoses on peaceful student marchers in Kelly Ingram Park in May 1963?</li><li><strong>[03:20] Hinge Question:</strong> How did televised imagery of Bull Connor's brutality directly compel President John F. Kennedy to introduce the landmark Civil Rights Act on national television in June 1963?</li></ol>",
        "model_answer": "<ol><li><strong>Quick Check:</strong> Eugene \"Bull\" Connor.</li><li><strong>Hinge Question:</strong> The international broadcast of 100-pound water pressure tearing the clothes off Black teenagers and German Shepherds biting children sickened the American public and deeply embarrassed the Kennedy administration on the Cold War world stage (Soviet propaganda weaponized Birmingham to mock US claims of leading the \"free world\"). JFK delivered a historic address stating that civil rights was a moral issue as old as the scriptures, committing his presidency to a comprehensive federal civil rights bill.</li></ol>"
      },
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=Vd6D64Ai49I",
        "id": "Vd6D64Ai49I",
        "title": "The Story of Bloody Sunday | Black American Heroes | HISTORY",
        "duration": "4 mins 14 secs",
        "pathway": "Enquiry Evidence",
        "teacher_guidance": "Archival analysis of the 7 March 1965 \"Bloody Sunday\" march across the Edmund Pettus Bridge in Selma, Alabama, Alabama State Troopers' tear gas attack, and the passage of the Voting Rights Act. Recommended Watch Window: 00:30–03:50 • Lesson Phase: Guided Instruction & Archival Investigation. Tone Alert: Compelling archival narrative detailing the brutal repression of non-violent voting rights marchers.",
        "viewing_task": "<ol><li><strong>[01:10] Recall:</strong> What was the bridge named in Selma, Alabama, where 600 civil rights marchers led by John Lewis and Hosea Williams were ambushed by mounted state troopers on 7 March 1965?</li><li><strong>[02:30] Explain:</strong> Explain the key enforcement mechanisms introduced by the Voting Rights Act of 1965 that permanently dismantled Southern voter suppression.</li><li><strong>[03:30] Challenge:</strong> Evaluate why Selma was the political catalyst for the Voting Rights Act: why was legislative action on voting rights impossible to delay after ABC interrupted its movie broadcast to show the footage?</li></ol>",
        "model_answer": "<ol><li><strong>Recall:</strong> The Edmund Pettus Bridge (named after a Confederate general and Grand Dragon of the Alabama Ku Klux Klan).</li><li><strong>Explain:</strong> The 1965 Act outlawed all discriminatory literacy tests and voter comprehension devices across the United States. Crucially, Section 5 empowered federal examiners to travel into Southern counties where registration was below 50% to directly register Black voters under federal protection, while requiring Southern states with histories of discrimination to obtain federal \"preclearance\" before changing any voting laws.</li><li><strong>Challenge:</strong> ABC interrupted its prime-time national broadcast of the film <em>Judgment at Nuremberg</em> (about Nazi war crimes) to air raw footage of Alabama troopers beating peaceful American citizens with nightsticks and tear gas. The moral shock of seeing Nazi atrocities juxtaposed with American state violence sparked nationwide protests, giving President Lyndon B. Johnson the political capital to address a joint session of Congress with the words \"And we shall overcome\", passing the act within five months.</li></ol>"
      },
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=6x0l_vkjozc",
        "id": "6x0l_vkjozc",
        "title": "The Civil Rights Act Of 1964 Explained | This Day Forward | MSNBC",
        "duration": "4 mins 20 secs",
        "pathway": "Documentary Depth",
        "teacher_guidance": "Concise legislative and historical breakdown of the 1964 Civil Rights Act signed by President Lyndon B. Johnson, outlawing segregation in public accommodations and banning employment discrimination.",
        "viewing_task": "<ol><li><strong>[01:10] Recall:</strong> What major legislative breakthrough did President Lyndon B. Johnson sign into law on 2 July 1964 following the Birmingham campaign and the March on Washington?</li><li><strong>[02:30] Explain:</strong> Explain how Title II and Title VII of the 1964 Civil Rights Act dismantled Jim Crow segregation in private businesses and public employment.</li><li><strong>[03:40] Challenge:</strong> Why was the Civil Rights Act of 1964 alone insufficient to guarantee full democratic equality for African Americans in the Deep South, necessitating the Selma campaign and the 1965 Voting Rights Act?</li></ol>",
        "model_answer": "<ol><li><strong>Recall:</strong> The Civil Rights Act of 1964.</li><li><strong>Explain:</strong> Title II outlawed racial discrimination in hotels, restaurants, theatres, and public accommodations, while Title VII banned employment discrimination and established the Equal Employment Opportunity Commission (EEOC).</li><li><strong>Challenge:</strong> While the 1964 Act desegregated public spaces, Southern sheriffs and registrars still used discriminatory literacy tests, poll taxes, and white violence to prevent over 95% of Black citizens from registering to vote in counties like Dallas County (Selma), Alabama; true political power required federal voting rights protection.</li></ol>"
      }
    ];
    l22.extra_videos = [];
  }

  // 3. Decouple k_O7bD8Swxk from lessons where it was copy-pasted as a duplicate
  // Keep it ONLY in lesson_3_2 where it is legitimately The Fog of War (Errol Morris / McNamara / Tonkin)
  const lessonsToClean = [
    'lesson_3_1',
    'lesson_3_3',
    'lesson_3_4',
    'lesson_4_1',
    'lesson_4_2',
    'lesson_4_3',
    'lesson_4_4'
  ];

  lessonsToClean.forEach(lid => {
    const l = usaObj.lessons.find(lesson => lesson.id === lid);
    if (l) {
      if (Array.isArray(l.video)) {
        l.video = l.video.filter(v => (v.id || v.url) !== 'k_O7bD8Swxk');
      }
      if (Array.isArray(l.extra_videos)) {
        l.extra_videos = l.extra_videos.filter(v => (v.id || v.url) !== 'k_O7bD8Swxk');
      }
    }
  });

  return usaObj;
}

// 1. Update data/usa.json
console.log('Updating data/usa.json...');
const dataFile = 'data/usa.json';
const dataObj = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
overhaulUsaVideos(dataObj);
fs.writeFileSync(dataFile, JSON.stringify(dataObj, null, 2), 'utf8');

// 2. Update public/data/usa.json
console.log('Updating public/data/usa.json...');
const pubDataFile = 'public/data/usa.json';
fs.writeFileSync(pubDataFile, JSON.stringify(dataObj, null, 2), 'utf8');

// 3. Update units/usa/data.js
console.log('Updating units/usa/data.js...');
const unitsDataFile = 'units/usa/data.js';
fs.writeFileSync(unitsDataFile, 'window.unitData = ' + JSON.stringify(dataObj, null, 2) + ';\n', 'utf8');

// 4. Update public/units/usa/data.js
console.log('Updating public/units/usa/data.js...');
const pubUnitsDataFile = 'public/units/usa/data.js';
fs.writeFileSync(pubUnitsDataFile, 'window.unitData = ' + JSON.stringify(dataObj, null, 2) + ';\n', 'utf8');

// 5. Update database.json
console.log('Updating database.json...');
const dbFile = 'database.json';
const dbObj = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
dbObj.usa = dataObj;
fs.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2), 'utf8');

// 6. Update public/database.json
console.log('Updating public/database.json...');
const pubDbFile = 'public/database.json';
fs.writeFileSync(pubDbFile, JSON.stringify(dbObj, null, 2), 'utf8');

console.log('✅ Successfully updated USA (1954-1975) video shelves across all 6 data stores!');

