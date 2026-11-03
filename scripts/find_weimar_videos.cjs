const { searchYouTube } = require('./search_youtube_real.cjs');
const { fetchYoutubeMetadata } = require('./fetch_youtube_metadata.cjs');
const fs = require('fs');
const path = require('path');

const queries = [
  // L1
  { lesson: 1, q: "Simple History Weimar Republic 1918 1919" },
  { lesson: 1, q: "Imperial War Museums The Treaty of Versailles 1919" },
  { lesson: 1, q: "Weimar Constitution proportional representation Article 48" },

  // L2
  { lesson: 2, q: "Simple History German Hyperinflation 1923" },
  { lesson: 2, q: "British Pathe Kapp Putsch 1920 Berlin" },
  { lesson: 2, q: "Simple History Spartacist Uprising 1919" },

  // L3
  { lesson: 3, q: "Simple History Gustav Stresemann Dawes Plan" },
  { lesson: 3, q: "Weimar Golden Twenties economic recovery Stresemann" },

  // L4
  { lesson: 4, q: "Weimar Republic Women 1920s culture Bauhaus" },
  { lesson: 4, q: "Weimar Culture Golden Twenties cabaret art Otto Dix" },

  // L5
  { lesson: 5, q: "Simple History The Early Nazi Party 1919 1920" },
  { lesson: 5, q: "Hitler 25 point programme DAP NSDAP Drexler" },

  // L6
  { lesson: 6, q: "Simple History Munich Putsch 1923 Beer Hall" },
  { lesson: 6, q: "Hitler Landsberg prison Mein Kampf Bamberg conference" },

  // L7
  { lesson: 7, q: "Simple History Wall Street Crash 1929 Great Depression Germany" },
  { lesson: 7, q: "How Hitler Rose to Power 1929 1932 Wall Street Crash" },

  // L8
  { lesson: 8, q: "Simple History How Hitler became Chancellor 1933" },
  { lesson: 8, q: "Hitler Chancellor January 1933 Papen Hindenburg" },

  // L9
  { lesson: 9, q: "Simple History Reichstag Fire 1933 Enabling Act" },
  { lesson: 9, q: "Simple History Night of the Long Knives 1934" },

  // L10
  { lesson: 10, q: "Simple History The Gestapo Nazi Police State" },
  { lesson: 10, q: "Hitler and the Church Reich Church Concordat Niemoller" },

  // L11
  { lesson: 11, q: "Simple History Nazi Propaganda Joseph Goebbels" },
  { lesson: 11, q: "1936 Berlin Olympic Games Nazi propaganda" },

  // L12
  { lesson: 12, q: "Simple History Edelweiss Pirates Swing Youth resistance" },
  { lesson: 12, q: "Resistance in Nazi Germany Martin Niemoller Galen" },

  // L13
  { lesson: 13, q: "Simple History Women in Nazi Germany Kinder Kuche Kirche" },
  { lesson: 13, q: "Nazi policies towards women Mothers Cross Lebensborn" },

  // L14
  { lesson: 14, q: "Simple History The Hitler Youth League of German Girls" },
  { lesson: 14, q: "Nazi education indoctrination schools Hitler Youth" },

  // L15
  { lesson: 15, q: "Simple History The Nazi Economy RAD Autobahns" },
  { lesson: 15, q: "Strength Through Joy KdF Volkswagen German Labour Front" },

  // L16
  { lesson: 16, q: "Simple History The Nuremberg Laws 1935" },
  { lesson: 16, q: "Simple History Kristallnacht 1938 Night of Broken Glass" }
];

async function run() {
  console.log(`Searching real YouTube videos for ${queries.length} queries...`);
  const results = [];

  for (const item of queries) {
    console.log(`\nSearching for L${item.lesson}: "${item.q}"...`);
    const found = await searchYouTube(item.q);
    console.log(`  Found ${found.length} verified candidates.`);
    if (found.length > 0) {
      results.push({
        lesson: item.lesson,
        query: item.q,
        topVideo: found[0],
        allVideos: found.slice(0, 3)
      });
      console.log(`  -> Selected: [${found[0].id}] ${found[0].duration} | "${found[0].title}" (${found[0].author})`);
    }
    await new Promise(r => setTimeout(r, 400));
  }

  fs.writeFileSync(path.join(__dirname, 'weimar_discovered_videos.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nDiscovered videos saved to scripts/weimar_discovered_videos.json!`);
}

run();

