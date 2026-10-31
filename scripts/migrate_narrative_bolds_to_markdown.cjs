const fs = require('fs');
const path = require('path');
const vm = require('vm');

const { execSync } = require('child_process');

function convertNarrativeProseBolds(fileContent) {
  let result = '';
  let i = 0;
  let count = 0;

  while (i < fileContent.length) {
    const sub = fileContent.slice(i, i + 10);
    const isTextProp = sub.startsWith('text:') || sub.startsWith('text :');
    const isContentProp = sub.startsWith('content:') || sub.startsWith('content :');

    if (isTextProp || isContentProp) {
      const colonIdx = fileContent.indexOf(':', i);
      result += fileContent.slice(i, colonIdx + 1);
      i = colonIdx + 1;

      while (i < fileContent.length && /\s/.test(fileContent[i])) {
        result += fileContent[i];
        i++;
      }

      const quote = fileContent[i];
      if (quote === "'" || quote === '"' || quote === '`') {
        result += quote;
        i++;
        let strBody = '';
        while (i < fileContent.length) {
          const char = fileContent[i];
          if (char === '\\') {
            strBody += char + (fileContent[i + 1] || '');
            i += 2;
            continue;
          }
          if (char === quote) {
            break;
          }
          strBody += char;
          i++;
        }

        const converted = strBody
          .replace(
            /<strong(?:\s+class=["']vocab-highlight["'])?>([^<>\n\r]+)<\/strong>/g,
            (m, term) => {
              count++;
              return `**${term}**`;
            },
          )
          .replace(/<b>([^<>\n\r]+)<\/b>/g, (m, term) => {
            count++;
            return `**${term}**`;
          });

        result += converted + quote;
        i++;
        continue;
      }
    }

    result += fileContent[i];
    i++;
  }

  return { newContent: result, count };
}

const unitsDir = path.resolve(__dirname, '..', 'units');
const unitsToProcess = [
  'australia',
  'cold_war',
  'edexcel_medicine',
  'eee',
  'first_british_empire',
  'great_war',
  'ks2_ww2',
  'medieval_england',
  'monarchy_religion_power',
  'post_war_britain',
  'second_british_empire',
  'the_shoah',
  'weimar_nazi_germany',
];

let totalReplaced = 0;

unitsToProcess.forEach((uId) => {
  const p = path.join(unitsDir, uId, 'data.js');
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf8');
  const res = convertNarrativeProseBolds(content);

  // Validate syntax by creating a temporary file and running node -c
  const tempPath = path.join(__dirname, `temp_check_${uId}.js`);
  fs.writeFileSync(tempPath, res.newContent, 'utf8');

  try {
    execSync(`node -c "${tempPath}"`, { stdio: 'pipe' });
    // Syntax is valid! Write back to original file
    fs.writeFileSync(p, res.newContent, 'utf8');
    console.log(`✅ ${uId.padEnd(25)}: Converted ${res.count} tags. Syntax 100% valid.`);
    totalReplaced += res.count;
  } catch (err) {
    console.error(`❌ ${uId} FAILED syntax check:`, err.message);
  } finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
});

console.log(`\n🎉 Total narrative tags converted across all units: ${totalReplaced}`);
