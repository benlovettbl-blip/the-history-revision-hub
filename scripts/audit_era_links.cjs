const fs = require('fs');
const path = require('path');

const allVideos = require('./all_videos_manifest.json');
const eraVideos = allVideos.filter(v => v.url && v.url.includes('era.org.uk'));

console.log(`Total ERA links across platform: ${eraVideos.length}`);

const eraByUnit = {};
eraVideos.forEach(v => {
  eraByUnit[v.unitId] = (eraByUnit[v.unitId] || 0) + 1;
});
console.log('ERA links by unit:', eraByUnit);

fs.writeFileSync(path.join(__dirname, 'era_videos_list.json'), JSON.stringify(eraVideos, null, 2), 'utf8');

