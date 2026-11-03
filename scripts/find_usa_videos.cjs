const https = require('https');
const { searchYouTube } = require('./search_youtube_real.cjs');
const { fetchYoutubeMetadata } = require('./fetch_youtube_metadata.cjs');

async function testVideo(id) {
  const meta = await fetchYoutubeMetadata(id);
  console.log(id, meta.status, meta.valid ? `${meta.duration} | ${meta.title} (${meta.author})` : 'INVALID');
  return meta;
}

async function run() {
  console.log('Testing specific existing IDs...');
  await testVideo('Fym2q-Jajnc');
  await testVideo('_dZ8zKbP2r0');
  await testVideo('8yLKMhCjHyE');

  console.log('\nSearching for replacements...');
  // 1. Freedom Riders Anniston replacement
  console.log('--- Freedom Riders Anniston ---');
  const anniston = await searchYouTube('PBS American Experience Freedom Riders Anniston bus attack');
  anniston.slice(0, 3).forEach(v => console.log('  ', v.id, v.title, v.duration, v.author));

  // 2. Civil Rights Act 1964 LBJ signing
  console.log('--- Civil Rights Act 1964 ---');
  const cra1964 = await searchYouTube('Civil Rights Act of 1964 Lyndon B Johnson signing');
  cra1964.slice(0, 3).forEach(v => console.log('  ', v.id, v.title, v.duration, v.author));

  // 3. White Citizens Councils / Massive Resistance
  console.log('--- White Resistance 1950s ---');
  const massive = await searchYouTube('Massive Resistance White Citizens Councils Civil Rights 1950s');
  massive.slice(0, 3).forEach(v => console.log('  ', v.id, v.title, v.duration, v.author));

  // 4. Nixon Silent Majority full speech / analysis
  console.log('--- Nixon Silent Majority ---');
  const silent = await searchYouTube('Richard Nixon Silent Majority speech 1969 Vietnam War');
  silent.slice(0, 3).forEach(v => console.log('  ', v.id, v.title, v.duration, v.author));

  // 5. Operation Rolling Thunder
  console.log('--- Operation Rolling Thunder ---');
  const rolling = await searchYouTube('Operation Rolling Thunder Simple History Vietnam');
  rolling.slice(0, 3).forEach(v => console.log('  ', v.id, v.title, v.duration, v.author));
}

run();

