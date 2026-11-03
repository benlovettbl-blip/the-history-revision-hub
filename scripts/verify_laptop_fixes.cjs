const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1536x864', width: 1536, height: 864 }
];

const TEST_URL = 'http://localhost:3003/?view=lessons&unit=edexcel_medicine&lesson=0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new'
  });

  console.log('🧪 Starting Laptop Layout Verification...');

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.goto(TEST_URL, { waitUntil: 'networkidle0' });

    const results = await page.evaluate(() => {
      const hero = document.querySelector('.lesson-hero');
      const stickyHeader = document.querySelector('.sticky-lesson-header');
      const sidebar = document.querySelector('#sidebar, .app-sidebar, aside');
      const searchBar = document.querySelector('.header-search-bar');
      const breadcrumbs = document.querySelector('#header-breadcrumbs, .breadcrumbs');
      const visualRow = document.querySelector('.narrative-visual-row');
      const visualPlate = document.querySelector('.narrative-visual-plate');
      const narrativeChunk = document.querySelector('.narrative-chunk');
      const overlay = document.querySelector('vite-error-overlay');

      const heroRect = hero ? hero.getBoundingClientRect() : null;
      const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;
      const searchRect = searchBar ? searchBar.getBoundingClientRect() : null;
      const bcRect = breadcrumbs ? breadcrumbs.getBoundingClientRect() : null;
      const plateRect = visualPlate ? visualPlate.getBoundingClientRect() : null;
      const chunkRect = narrativeChunk ? narrativeChunk.getBoundingClientRect() : null;

      const isSideBySide = (plateRect && chunkRect) ? Math.abs(plateRect.top - chunkRect.top) < 20 : false;
      const heroOverhangLeft = (heroRect && sidebarRect) ? (sidebarRect.right - heroRect.left) : 0;
      const heroOverhangRight = heroRect ? (heroRect.right - window.innerWidth) : 0;

      return {
        hasViteOverlay: !!overlay,
        heroOverhangLeft: Math.round(heroOverhangLeft),
        heroOverhangRight: Math.round(heroOverhangRight),
        searchBarWidth: searchRect ? Math.round(searchRect.width) : 0,
        breadcrumbsWidth: bcRect ? Math.round(bcRect.width) : 0,
        isSideBySide,
        plateWidth: plateRect ? Math.round(plateRect.width) : 0,
        chunkWidth: chunkRect ? Math.round(chunkRect.width) : 0
      };
    });

    console.log(`\n--- Viewport: ${vp.name} ---`);
    console.log(`  Vite Overlay: ${results.hasViteOverlay ? '❌ PRESENT' : '✅ NONE'}`);
    console.log(`  Hero Left Margin/Overhang: ${results.heroOverhangLeft <= 0 ? '✅ FLUSH (' + results.heroOverhangLeft + 'px)' : '⚠️ OVERHANG (' + results.heroOverhangLeft + 'px)'}`);
    console.log(`  Hero Right Overhang: ${results.heroOverhangRight <= 0 ? '✅ FLUSH (' + results.heroOverhangRight + 'px)' : '⚠️ OVERHANG (' + results.heroOverhangRight + 'px)'}`);
    console.log(`  Search Bar Width: ${results.searchBarWidth >= 120 ? '✅ EXPANDED (' + results.searchBarWidth + 'px)' : '⚠️ COMPACT (' + results.searchBarWidth + 'px)'}`);
    console.log(`  Layer 2 Side-by-Side: ${results.isSideBySide ? '✅ SIDE-BY-SIDE (Plate: ' + results.plateWidth + 'px, Chunk: ' + results.chunkWidth + 'px)' : '⚠️ STACKED'}`);

    await page.close();
  }

  await browser.close();
  console.log('\n🎉 Verification completed!');
})();

