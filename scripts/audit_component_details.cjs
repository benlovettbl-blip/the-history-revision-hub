const puppeteer = require('puppeteer');

async function auditDetails() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  // 1. Check Lesson View details
  await page.goto('http://localhost:3003/?view=lessons&unit=cme_new&lesson=0', { waitUntil: 'networkidle0' });
  const lessonDetails = await page.evaluate(() => {
    const launchpad = document.querySelector('.launchpad-bar') || document.querySelector('.hero-curricular-launchpad') || document.querySelector('.launchpad-pill-group');
    const launchpadRect = launchpad ? launchpad.getBoundingClientRect() : null;

    const lede = document.querySelector('.historical-editorial-lede') || document.querySelector('.historical-setting');
    const ledeRect = lede ? lede.getBoundingClientRect() : null;

    const stageHeader = document.querySelector('.unified-stage-header-card') || document.querySelector('.stage-card') || document.querySelector('.stage-header-top-bar');
    const stageRect = stageHeader ? stageHeader.getBoundingClientRect() : null;

    const visualRow = document.querySelector('.narrative-visual-row');
    const visualPlate = document.querySelector('.narrative-visual-plate');
    const narrativeChunk = document.querySelector('.narrative-chunk');

    const drawer = document.querySelector('details.cme-source-drawer') || document.querySelector('details.source-drawer');
    const drawerRect = drawer ? drawer.getBoundingClientRect() : null;

    return {
      launchpadRect: launchpadRect ? { w: Math.round(launchpadRect.width), h: Math.round(launchpadRect.height) } : null,
      ledeRect: ledeRect ? { w: Math.round(ledeRect.width), h: Math.round(ledeRect.height) } : null,
      stageRect: stageRect ? { w: Math.round(stageRect.width), h: Math.round(stageRect.height) } : null,
      visualRow: visualRow ? {
        rowWidth: Math.round(visualRow.getBoundingClientRect().width),
        plateWidth: visualPlate ? Math.round(visualPlate.getBoundingClientRect().width) : 0,
        chunkWidth: narrativeChunk ? Math.round(narrativeChunk.getBoundingClientRect().width) : 0,
        isStacked: visualPlate && narrativeChunk ? Math.abs(visualPlate.getBoundingClientRect().top - narrativeChunk.getBoundingClientRect().top) > 50 : false
      } : null,
      drawerRect: drawerRect ? { w: Math.round(drawerRect.width), h: Math.round(drawerRect.height) } : null
    };
  });
  console.log('Lesson view details (CME L0 at 1366x768):', JSON.stringify(lessonDetails, null, 2));

  // 2. Check Workbooks Zone
  await page.goto('http://localhost:3003/?view=booklet&unit=cme_new', { waitUntil: 'networkidle0' });
  const wbDetails = await page.evaluate(() => {
    const cards = document.querySelectorAll('.master-pillar-card');
    const grid = document.querySelector('.master-pillars-grid') || (cards[0] ? cards[0].parentElement : null);
    const gridRect = grid ? grid.getBoundingClientRect() : null;
    const cardsInfo = Array.from(cards).map(c => {
      const r = c.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top) };
    });
    return {
      gridWidth: gridRect ? Math.round(gridRect.width) : 0,
      cardsCount: cards.length,
      cardsInfo
    };
  });
  console.log('\nWorkbooks Zone details (at 1366x768):', JSON.stringify(wbDetails, null, 2));

  // 3. Check Lessons List Cards
  await page.goto('http://localhost:3003/?view=lessons&unit=cme_new', { waitUntil: 'networkidle0' });
  const listDetails = await page.evaluate(() => {
    const banner = document.querySelector('.premium-banner');
    const bannerActions = document.querySelector('.premium-banner-actions');
    const bRect = banner ? banner.getBoundingClientRect() : null;
    const aRect = bannerActions ? bannerActions.getBoundingClientRect() : null;

    const cards = document.querySelectorAll('.lesson-card') || [];

    return {
      banner: bRect ? { w: Math.round(bRect.width), h: Math.round(bRect.height) } : null,
      bannerActions: aRect ? { w: Math.round(aRect.width), h: Math.round(aRect.height), right: Math.round(aRect.right) } : null,
      cardsCount: cards.length
    };
  });
  console.log('\nLessons List details (at 1366x768):', JSON.stringify(listDetails, null, 2));

  await browser.close();
}

auditDetails().catch(console.error);

