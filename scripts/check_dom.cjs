const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3003/?view=lessons&unit=the_shoah&lesson=3', { waitUntil: 'networkidle2' });
  const info = await page.evaluate(() => {
    const tab = document.querySelector('[data-action="switch-launchpad-tab"][data-tab="donow"]');
    const panel = document.querySelector('.launchpad-panel[data-panel="donow"]');
    const donowContent = document.querySelector('.donow-panel-content');
    const allPanels = Array.from(document.querySelectorAll('.launchpad-panel')).map(p => ({
      panel: p.dataset.panel,
      display: p.style.display,
      hasContent: p.innerHTML.length
    }));
    return {
      hasTab: !!tab,
      tabText: tab ? tab.innerText : null,
      hasPanel: !!panel,
      allPanels,
      hasDoNowContent: !!donowContent,
    };
  });
  console.log(info);
  await browser.close();
})();

