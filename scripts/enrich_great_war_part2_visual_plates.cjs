const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

// Visual plates mapping for all 25 stages of great_war_part2
const visualPlates = [
  // Lesson 1: 1914 & The Rush to the Colours
  {
    lessonIndex: 0,
    stages: [
      {
        stageIndex: 0,
        image: '/images/gw_kitchener_poster.jpg',
        caption: "Field Marshal Lord Kitchener pointing directly at the viewer: Alfred Leete’s iconic September 1914 recruitment poster that spurred over 750,000 men to enlist in the first eight weeks alone."
      },
      {
        stageIndex: 1,
        image: '/images/gw_scrap_of_paper.jpg',
        caption: "Parliamentary Recruiting Committee Poster No. 7, 'The Scrap of Paper' (1914), reproducing the 1839 Treaty of London to rally British moral outrage against Germany's invasion of neutral Belgium."
      },
      {
        stageIndex: 2,
        image: '/images/gw_recruitment_queue_1914.jpg',
        caption: "Hundreds of civilian volunteers queuing outside a London recruitment station in August 1914 to enlist together in local municipal Pals Battalions."
      },
      {
        stageIndex: 3,
        image: '/images/gw_jessie_pope.jpg',
        caption: "Popular patriotic poet Jessie Pope, whose pro-war newspaper verses portrayed soldiering as an exciting sporting adventure, encouraging young men to take the 'King's Shilling'."
      },
      {
        stageIndex: 4,
        image: '/images/gw_women_say_go.jpg',
        caption: "Parliamentary Recruiting Committee Poster No. 75, 'Women of Britain Say—GO!' (1915), leveraging domestic emotional pressure and moral coercion to compel voluntary civilian enlistment."
      }
    ]
  },

  // Lesson 2: Trench Warfare & The Haig Controversy (1915–1916)
  {
    lessonIndex: 1,
    stages: [
      {
        stageIndex: 0,
        image: '/images/cheshire_regiment_trench.png',
        caption: "British soldiers of the Cheshire Regiment in a front-line fire trench on the Western Front, showing parapet sandbags, periscope observation, and mud."
      },
      {
        stageIndex: 1,
        image: '/images/gw_trench_diagram.jpg',
        caption: "British War Office engineering profile diagram of a frontline fire trench, detailing the fire-step, sandbag breastwork, parados, drainage sump, and zig-zag traverse design."
      },
      {
        stageIndex: 2,
        image: '/images/gw_flooded_trench.jpg',
        caption: "British troops wading through a waterlogged, thigh-deep communication trench on duckboards; freezing water and filth caused trench foot, shell shock, and rampant gangrene."
      },
      {
        stageIndex: 3,
        image: '/images/gw_thiepval.jpg',
        caption: "Sir Edwin Lutyens’ Thiepval Memorial to the Missing of the Somme, inscribed with the names of over 72,000 British and South African soldiers who died with no known grave."
      },
      {
        stageIndex: 4,
        image: '/images/gw_douglas_haig.jpg',
        caption: "Field Marshal Sir Douglas Haig, Commander-in-Chief of the BEF (1915–1918), whose leadership remains fiercely debated between 'Butcher of the Somme' and modernising architect of combined-arms victory."
      }
    ]
  },

  // Lesson 3: Global Empire & The Forgotten Fronts (1914–1918)
  {
    lessonIndex: 2,
    stages: [
      {
        stageIndex: 0,
        image: '/images/gw_empire_needs_men.jpg',
        caption: "Parliamentary Recruiting Committee poster depicting the British imperial lion backed by Dominion lions: 'The Empire Needs Men! All answer the call'. Over four million non-white colonial troops and labourers served."
      },
      {
        stageIndex: 1,
        image: '/images/gw_khudadad_khan.jpg',
        caption: "Sepoy Khudadad Khan of the 129th Baluchis, the first South Asian soldier awarded the Victoria Cross, for holding his machine gun alone under intense fire at Hollebeke on 31 October 1914."
      },
      {
        stageIndex: 2,
        image: '/images/gw_bwir.jpg',
        caption: "Soldiers of the British West Indies Regiment (BWIR) assembling artillery shells; 15,600 Caribbean volunteers served with distinction across France, Egypt, and Palestine."
      },
      {
        stageIndex: 3,
        image: '/images/gw_clc.jpg',
        caption: "Workers of the Chinese Labour Corps (CLC) clearing unexploded munitions and repairing supply railways in northern France; 140,000 Chinese labourers sustained the Allied Western Front."
      },
      {
        stageIndex: 4,
        image: '/images/gw_dead_mans_penny.jpg',
        caption: "The bronze Next of Kin Memorial Plaque ('Dead Man's Penny') issued to families of fallen British soldiers, contrasting with the denied pensions and uncommemorated graves of colonial troops."
      }
    ]
  },

  // Lesson 4: The Home Front & Women’s Total War (1914–1918)
  {
    lessonIndex: 3,
    stages: [
      {
        stageIndex: 0,
        image: '/images/gw_dora_notice.jpg',
        caption: "Official public government proclamation placard posted under the Defence of the Realm Act (DORA), announcing strict wartime blackout and lighting restrictions in British cities."
      },
      {
        stageIndex: 1,
        image: '/images/gw_lloyd_george.jpg',
        caption: "David Lloyd George inspecting artillery shell production as Minister of Munitions in 1915; his state-managed factories multiplied British shell output tenfold."
      },
      {
        stageIndex: 2,
        image: '/images/gw_richmond_castle.jpg',
        caption: "The 19th-century cell block at Richmond Castle, Yorkshire, where the 'Richmond Sixteen' absolutist Conscientious Objectors were imprisoned and etched anti-war graffiti before being court-martialed in France."
      },
      {
        stageIndex: 3,
        image: '/images/gw_munitionettes.jpg',
        caption: "Female munitions workers ('Canary Girls') handling artillery shells in a British factory; exposure to toxic TNT caused jaundice, bright yellow skin, and constant risk of fatal explosions."
      },
      {
        stageIndex: 4,
        image: '/images/gw_ration_book.jpg',
        caption: "Official Ministry of Food 1918 National Ration Book with coupons for meat, butter, and sugar, introduced to prevent civilian starvation after German U-boats sank Atlantic grain ships."
      }
    ]
  },

  // Lesson 5: The Treaty of Versailles & The Flawed Peace (1918–1919)
  {
    lessonIndex: 4,
    stages: [
      {
        stageIndex: 0,
        image: '/images/gw_armistice_carriage.jpg',
        caption: "Allied Commander-in-Chief Marshal Ferdinand Foch standing outside the railway dining carriage in the Forest of Compiègne on 11 November 1918 after signing the Armistice."
      },
      {
        stageIndex: 1,
        image: '/images/gw_big_three_versailles.jpg',
        caption: "The 'Big Four' at the Paris Peace Conference (1919): David Lloyd George (Britain), Vittorio Orlando (Italy), Georges Clemenceau (France), and Woodrow Wilson (USA)."
      },
      {
        stageIndex: 2,
        image: '/images/weimar_abdication_decree_1918.jpg',
        caption: "Official Berlin proclamation announcing the abdication of Kaiser Wilhelm II in November 1918, paving the way for the signing of the Treaty of Versailles."
      },
      {
        stageIndex: 3,
        image: '/images/gw_weeping_child.jpg',
        caption: "Will Dyson’s prophetic cartoon 'Peace and Future Cannon Fodder' (Daily Herald, May 1919), showing Clemenceau leaving Versailles while a naked child weeping beneath the label '1940 Class' foretells a second world war."
      },
      {
        stageIndex: 4,
        image: '/images/gw_berlin_reichstag_protest_1919.jpg',
        caption: "Mass demonstration in front of the Reichstag in Berlin (May 1919), where thousands of Germans protested the punitive terms and War Guilt clause of the Treaty of Versailles."
      }
    ]
  }
];

function applyVisualPlates(unitObj) {
  let count = 0;
  const lessons = unitObj.lessons || (unitObj.curriculum && unitObj.curriculum.lessons) || [];

  visualPlates.forEach(vp => {
    const l = lessons[vp.lessonIndex];
    if (!l) return;
    const blocks = l.narrative_blocks || l.stages || [];

    vp.stages.forEach(s => {
      if (blocks[s.stageIndex]) {
        blocks[s.stageIndex].image = s.image;
        blocks[s.stageIndex].caption = s.caption;
        count++;
      }
    });
  });

  return count;
}

// 1. Update data/great_war_part2.json and public/data/great_war_part2.json
['data/great_war_part2.json', 'public/data/great_war_part2.json'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    const count = applyVisualPlates(json);
    fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Updated ${relPath} (${count} visual plates assigned)`);
  }
});

// 2. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (json.great_war_part2) {
      const count = applyVisualPlates(json.great_war_part2);
      fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Updated ${relPath} (${count} visual plates assigned)`);
    }
  }
});

// 3. Update units/great_war_part2/data.js and public/units/great_war_part2/data.js
['units/great_war_part2/data.js', 'public/units/great_war_part2/data.js'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/great_war_part2.json'), 'utf8'));
    const fileContent = 'export default ' + JSON.stringify(json, null, 2) + ';\n';
    fs.writeFileSync(p, fileContent, 'utf8');
    console.log(`Updated ${relPath}`);
  }
});

console.log('\nAll 25 visual plates in great_war_part2 successfully assigned across all data stores!');

