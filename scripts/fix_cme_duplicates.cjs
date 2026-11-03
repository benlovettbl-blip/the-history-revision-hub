const fs = require('fs');
const path = require('path');

function updateCME(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix L7 Video [3]: replace IhfysdHgGh8 with I0lLtFDthLw
  content = content.replace(
    /("url":\s*"https:\/\/www\.youtube\.com\/watch\?v=)IhfysdHgGh8("[\s\S]*?"title":\s*"BBC \/ PBS: The 50 Years War - Six Days in June and the Occupation"[\s\S]*?"duration":\s*")[^"]*(")/,
    '$1I0lLtFDthLw$247 mins 17 secs$3'
  );

  // 2. Fix L10 Video [2]: replace LYhJOjv0Yc8 with DFKaFgDwLi8 in L10
  // Target specifically the L10 block containing Sadat / Arab World Reaction
  const l10Target = /("url":\s*"https:\/\/www\.youtube\.com\/watch\?v=)LYhJOjv0Yc8("[\s\S]*?"title":\s*")Middle East Eye \/ Archival: The Arab World Reaction & The Price of Peace("[\s\S]*?"duration":\s*")[^"]*(")/;
  content = content.replace(
    l10Target,
    '$1DFKaFgDwLi8$2Al Jazeera English: Cold Peace – The Arab World Backlash & The Price of Peace$312 mins 13 secs$4'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated CME in', filePath);
}

updateCME(path.join(__dirname, '..', 'units', 'cme_new', 'data.js'));
updateCME(path.join(__dirname, '..', 'public', 'units', 'cme_new', 'data.js'));

