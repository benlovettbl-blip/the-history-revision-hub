const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 700, height: 800, deviceScaleFactor: 2 });

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    margin: 0;
    padding: 24px 30px;
    background: #fdfbf7;
    color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    width: 620px;
    box-sizing: border-box;
    border: 1px solid #dcd7cf;
  }
  .header {
    text-align: center;
    border-bottom: 2px solid #000;
    padding-bottom: 8px;
    margin-bottom: 12px;
  }
  .vol {
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 6px;
  }
  .sub {
    font-size: 11px;
    font-style: italic;
    margin-top: 4px;
    letter-spacing: 0.5px;
  }
  .doc-title {
    text-align: center;
    font-size: 15px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 14px 0 10px 0;
  }
  .prose {
    font-size: 13.5px;
    line-height: 1.5;
    text-align: justify;
    text-indent: 18px;
    margin-bottom: 8px;
  }
  .signatories {
    margin-top: 14px;
    border-top: 1px dashed #666;
    padding-top: 8px;
    font-size: 11.5px;
    line-height: 1.4;
    text-align: center;
    color: #333;
  }
</style>
</head>
<body>
  <div class="header">
    <div class="vol">
      <span>Vol. 102 — Part 4</span>
      <span>84th Congress, 2d Session</span>
      <span>March 12, 1956</span>
    </div>
    <div class="title">Congressional Record</div>
    <div class="sub">PROCEEDINGS AND DEBATES OF THE 84th CONGRESS, SECOND SESSION</div>
  </div>
  <div class="doc-title">DECLARATION OF CONSTITUTIONAL PRINCIPLES<br><span style="font-size: 11.5px; font-weight: normal; font-style: italic;">(The Southern Manifesto)</span></div>
  <div class="prose">
    The unwarranted decision of the Supreme Court in the public school cases is now bearing the fruit always produced when men substitute naked power for established law.
  </div>
  <div class="prose">
    The Founding Fathers gave us a Constitution of checks and balances because they realized the operation of such a system is the only safeguard for the maintenance of liberty.
  </div>
  <div class="prose">
    We regard this unwarranted exercise of power by the Court, contrary to the Constitution, as creating chaos and confusion in the States principally affected. It is destroying the amicable relations between the white and Negro races that have been created through 90 years of patient effort by the good people of both races. It has planted hatred and suspicion where there has been heretofore friendship and understanding.
  </div>
  <div class="prose">
    We pledge ourselves to use all lawful means to bring about a reversal of this decision which is contrary to the Constitution, and to prevent the use of force in its implementation.
  </div>
  <div class="signatories">
    <strong>Signed by 101 Members of the United States Congress:</strong><br>
    <em>Senators:</em> Walter F. George, Richard B. Russell, Strom Thurmond, Harry F. Byrd, John Stennis, J. William Fulbright, Sam J. Ervin Jr., and 12 other Senators.<br>
    <em>Representatives:</em> 82 Southern Members of the House of Representatives.
  </div>
</body>
</html>
  `;

  await page.setContent(html);
  const element = await page.$('body');
  const outPath = path.resolve('public/units/usa/assets/sources/southern_manifesto_congressional_record_1956.png');
  await element.screenshot({ path: outPath });
  console.log('Saved', outPath);

  await browser.close();
})();

