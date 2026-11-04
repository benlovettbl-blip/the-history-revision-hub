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

  const targetDir = path.join(__dirname, '..', 'public', 'units', 'usa', 'assets', 'sources');

  const docs = [
    {
      filename: 'state_dept_cable_243_1963.png',
      width: 720,
      height: 550,
      html: `
        <div style="background: #fbf7ee; padding: 28px 32px; font-family: 'Courier New', monospace; color: #1c1917; border: 2px solid #a8a29e; box-sizing: border-box; height: 100%;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #b91c1c; padding-bottom: 6px; margin-bottom: 12px;">
            <span style="color: #b91c1c; font-weight: 900; font-size: 16px; letter-spacing: 2px;">TOP SECRET</span>
            <span style="border: 1px solid #78716c; padding: 2px 6px; font-size: 11px; font-weight: bold; background: #e7e5e4;">DECLASSIFIED - E.O. 12958</span>
            <span style="color: #b91c1c; font-weight: 900; font-size: 16px; letter-spacing: 2px;">TOP SECRET</span>
          </div>
          <div style="font-weight: bold; font-size: 13px; line-height: 1.5; margin-bottom: 14px;">
            <div>OUTGOING TELEGRAM • DEPARTMENT OF STATE</div>
            <div>ACTION: AMEMBASSY SAIGON - FLASH • CABLE NO: 243</div>
            <div>DATE: AUGUST 24, 1963 — 9:36 PM</div>
          </div>
          <div style="font-size: 13.5px; line-height: 1.55; text-align: justify; margin-bottom: 16px;">
            It is now clear that whether military proposed martial law or whether Nhu tricked them into it, Nhu took advantage of it to smash Pagodas with police and Tung's Special Forces loyal to him. The US Government cannot tolerate situation in which power lies in Nhu's hands. Diem must be given chance remove Nhu and his coterie and replace them with best military and political personalities available.
          </div>
          <div style="font-size: 13.5px; line-height: 1.55; text-align: justify; margin-bottom: 16px;">
            If Diem remains obdurate and refuses, then we must face the possibility that Diem himself cannot be preserved. Ambassador Lodge and Country Team should examine all possible alternative leadership and make detailed plans as to how we might bring about Diem's replacement if this becomes necessary.
          </div>
          <div style="font-size: 13.5px; line-height: 1.55; text-align: justify; margin-bottom: 20px;">
            You may also tell appropriate military commanders that we will give them direct support in any interim period of breakdown central government mechanism.
          </div>
          <div style="font-weight: bold; font-size: 13px;">RUSK (SIGNED) • ACTING SECRETARY OF STATE</div>
          <div style="margin-top: 30px; display: flex; justify-content: space-between; border-top: 2px solid #b91c1c; padding-top: 6px;">
            <span style="color: #b91c1c; font-weight: 900; font-size: 14px; letter-spacing: 2px;">TOP SECRET</span>
            <span style="font-size: 11px; color: #78716c;">NATIONAL SECURITY ARCHIVES • RECORD GROUP 59</span>
            <span style="color: #b91c1c; font-weight: 900; font-size: 14px; letter-spacing: 2px;">TOP SECRET</span>
          </div>
        </div>
      `
    },
    {
      filename: 'cia_snie_53_63_south_vietnam.png',
      width: 720,
      height: 460,
      html: `
        <div style="background: #faf6f0; padding: 28px 32px; font-family: 'Times New Roman', Times, serif; color: #1c1917; border: 2px solid #78716c; box-sizing: border-box; height: 100%;">
          <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 14px;">
            <div style="font-size: 11px; letter-spacing: 2px; font-weight: bold; color: #b91c1c; margin-bottom: 4px;">TOP SECRET — CONTROLLED DISSEM</div>
            <div style="font-size: 16px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">CENTRAL INTELLIGENCE AGENCY</div>
            <div style="font-size: 12px; font-style: italic; margin-top: 2px;">Office of National Estimates</div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; font-family: 'Courier New', monospace; margin-bottom: 12px; border-bottom: 1px dashed #78716c; padding-bottom: 6px;">
            <span>SNIE 53-2-63</span>
            <span>22 OCTOBER 1963</span>
            <span style="border: 1px solid #78716c; padding: 1px 4px; background: #e5e5e5;">DECLASSIFIED 1994</span>
          </div>
          <div style="text-align: center; font-size: 15px; font-weight: bold; text-transform: uppercase; margin: 14px 0;">
            SPECIAL NATIONAL INTELLIGENCE ESTIMATE: THE PROSPECTS FOR SOUTH VIETNAM
          </div>
          <div style="font-size: 13.5px; line-height: 1.6; text-align: justify; text-indent: 18px; margin-bottom: 14px;">
            We believe that the Buddhist crisis and the repression of students and intellectuals have alienated virtually all educated urban Vietnamese from the Diem regime. Respect for Ngo Dinh Diem has evaporated, and his brother Ngo Dinh Nhu is universally loathed and feared throughout Saigon.
          </div>
          <div style="font-size: 13.5px; line-height: 1.6; text-align: justify; text-indent: 18px; margin-bottom: 14px;">
            Concurrently, the military leadership in Saigon is divided, suspicious of Diem and Nhu, and increasingly convinced that victory over the Viet Cong is impossible under the present political leadership. We estimate that a successful military coup against the Diem government appears increasingly likely within the coming weeks.
          </div>
          <div style="border-top: 2px solid #000; margin-top: 25px; padding-top: 6px; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold;">
            <span style="color: #b91c1c; letter-spacing: 1px;">TOP SECRET</span>
            <span>DIRECTOR OF CENTRAL INTELLIGENCE</span>
            <span style="color: #b91c1c; letter-spacing: 1px;">TOP SECRET</span>
          </div>
        </div>
      `
    },
    {
      filename: 'gulf_of_tonkin_resolution_statute_1964.png',
      width: 720,
      height: 480,
      html: `
        <div style="background: #fdfbf7; padding: 28px 34px; font-family: 'Times New Roman', Times, serif; color: #1c1917; border: 2px solid #57534e; box-sizing: border-box; height: 100%;">
          <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px;">
            <div style="font-size: 11px; letter-spacing: 1.5px; font-weight: bold; text-transform: uppercase;">Eighty-Eighth Congress of the United States of America</div>
            <div style="font-size: 13px; font-style: italic; margin-top: 2px;">AT THE SECOND SESSION</div>
            <div style="font-size: 17px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-top: 6px;">Joint Resolution</div>
            <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">H. J. RES. 445 • PUBLIC LAW 88-408</div>
          </div>
          <div style="font-size: 12px; font-style: italic; text-align: center; margin-bottom: 14px;">
            To promote the maintenance of international peace and security in southeast Asia.
          </div>
          <div style="font-size: 13px; line-height: 1.55; text-align: justify; margin-bottom: 12px;">
            <strong>Whereas</strong> naval units of the Communist regime in Vietnam, in violation of the principles of the Charter of the United Nations and of international law, have deliberately and repeatedly attacked United States naval vessels lawfully present in international waters; and
          </div>
          <div style="font-size: 13px; line-height: 1.55; text-align: justify; margin-bottom: 12px;">
            <strong>Whereas</strong> these attacks are part of a deliberate and systematic campaign of aggression that the Communist regime in North Vietnam has been waging against its neighbors: Now, therefore, be it
          </div>
          <div style="font-size: 13px; line-height: 1.55; text-align: justify; text-indent: 18px; margin-bottom: 16px;">
            <strong>Resolved by the Senate and House of Representatives of the United States of America in Congress assembled,</strong> That the Congress approves and supports the determination of the President, as Commander in Chief, to take all necessary measures to repel any armed attack against the forces of the United States and to prevent further aggression.
          </div>
          <div style="border-top: 1px solid #78716c; padding-top: 10px; display: flex; justify-content: space-between; font-size: 11.5px; font-weight: bold;">
            <div>APPROVED: AUGUST 10, 1964</div>
            <div>LYNDON B. JOHNSON (PRESIDENT)</div>
          </div>
        </div>
      `
    },
    {
      filename: 'icc_order_mc_c_3358_1961.png',
      width: 720,
      height: 440,
      html: `
        <div style="background: #fdfaf2; padding: 28px 34px; font-family: 'Times New Roman', Times, serif; color: #1c1917; border: 2px solid #57534e; box-sizing: border-box; height: 100%;">
          <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px;">
            <div style="font-size: 11px; letter-spacing: 1.5px; font-weight: bold; text-transform: uppercase;">INTERSTATE COMMERCE COMMISSION</div>
            <div style="font-size: 12px; font-style: italic; margin-top: 2px;">WASHINGTON, D.C.</div>
            <div style="font-size: 16px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-top: 6px;">ORDER DOCKET NO. MC-C-3358</div>
            <div style="font-size: 11.5px; font-weight: bold; margin-top: 2px;">DECIDED: SEPTEMBER 21, 1961 • EFFECTIVE: NOVEMBER 1, 1961</div>
          </div>
          <div style="font-size: 12px; font-style: italic; text-align: center; margin-bottom: 14px;">
            Discrimination in Operations of Interstate Motor Common Carriers of Passengers
          </div>
          <div style="font-size: 13.5px; line-height: 1.55; text-align: justify; text-indent: 18px; margin-bottom: 14px;">
            <strong>It is ordered,</strong> That no motor common carrier of passengers subject to the Interstate Commerce Act shall, in the operation of passenger vehicles in interstate or foreign commerce, utilize or permit the use of any terminal facilities which are in any manner segregated on the basis of race, color, creed, or national origin.
          </div>
          <div style="font-size: 13.5px; line-height: 1.55; text-align: justify; text-indent: 18px; margin-bottom: 16px;">
            <strong>It is further ordered,</strong> That all signs, placards, or notices displaying designations such as 'White Waiting Room', 'Colored Waiting Room', or similarly segregating restrooms, dining counters, or waiting spaces are hereby declared unlawful and ordered removed from all interstate passenger terminals forthwith.
          </div>
          <div style="border-top: 1px solid #78716c; padding-top: 10px; display: flex; justify-content: space-between; font-size: 11.5px; font-weight: bold;">
            <div>BY THE COMMISSION</div>
            <div>HAROLD D. McCOY, SECRETARY</div>
          </div>
        </div>
      `
    }
  ];

  for (const doc of docs) {
    const page = await browser.newPage();
    await page.setViewport({ width: doc.width, height: doc.height, deviceScaleFactor: 2 });
    await page.setContent(`<!DOCTYPE html><html><body style="margin: 0; padding: 0;">${doc.html}</body></html>`);
    const outPath = path.join(targetDir, doc.filename);
    await page.screenshot({ path: outPath });
    console.log(`✅ Rendered authentic plate: ${doc.filename} (${fs.statSync(outPath).size} bytes)`);
    await page.close();
  }

  await browser.close();
  console.log('🎉 All documentary plates generated successfully!');
})();
