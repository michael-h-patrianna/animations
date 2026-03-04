import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Collect console messages
const consoleMsgs = [];
page.on('console', msg => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', err => consoleMsgs.push(`[PAGE_ERROR] ${err.message}`));

// Navigate to the page
await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });

// Wait a bit for React to render
await page.waitForTimeout(2000);

// Take a full-page screenshot
await page.screenshot({ path: '/tmp/crystal-shatter-full.png', fullPage: true });

// Look for crystal-shatter or cs-css elements
const cssCrystalShatter = await page.locator('[class*="crystal-shatter"]').count();
const cssCsCss = await page.locator('[class*="cs-css"]').count();
console.log(`Elements with class containing "crystal-shatter": ${cssCrystalShatter}`);
console.log(`Elements with class containing "cs-css": ${cssCsCss}`);

// Look specifically for shard elements
const framerShards = await page.locator('.pf-crystal-shatter__shard').count();
const cssShards = await page.locator('.pf-cs-css__shard').count();
console.log(`\n--- SHARD ELEMENTS ---`);
console.log(`.pf-crystal-shatter__shard count: ${framerShards}`);
console.log(`.pf-cs-css__shard count: ${cssShards}`);

// Check if the Prize Reveal section exists
const prizeRevealText = await page.locator('text=Prize Reveal').count();
const crystalShatterText = await page.locator('text=Crystal Shatter').count();
console.log(`\n--- TEXT MATCHES ---`);
console.log(`"Prize Reveal" text elements: ${prizeRevealText}`);
console.log(`"Crystal Shatter" text elements: ${crystalShatterText}`);

// Try to find the animation card or section
const animationIds = await page.evaluate(() => {
  const els = document.querySelectorAll('[data-animation-id]');
  return Array.from(els).map(el => el.getAttribute('data-animation-id'));
});
console.log(`\n--- ANIMATION IDs ---`);
console.log(JSON.stringify(animationIds, null, 2));

// Now try to scroll to the crystal shatter section and get details
const crystalShatterContainer = page.locator('[data-animation-id*="crystal-shatter"]').first();
const containerCount = await crystalShatterContainer.count();

if (containerCount > 0) {
  await crystalShatterContainer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(4000); // Wait for animation to play through shatter phase

  // Take focused screenshot
  const box = await crystalShatterContainer.boundingBox();
  if (box) {
    await page.screenshot({ 
      path: '/tmp/crystal-shatter-focused.png',
      clip: { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 60), width: Math.min(box.width + 40, 1280), height: box.height + 80 }
    });
  }

  // Check shards again after animation should have started
  const shardsAfterWait = await page.locator('.pf-crystal-shatter__shard, .pf-cs-css__shard').count();
  console.log(`\n--- SHARDS AFTER 4s WAIT ---`);
  console.log(`Total shard elements: ${shardsAfterWait}`);

  // Get computed styles of shards if they exist
  if (shardsAfterWait > 0) {
    const shardStyles = await page.evaluate(() => {
      const shards = document.querySelectorAll('.pf-crystal-shatter__shard, .pf-cs-css__shard');
      return Array.from(shards).slice(0, 4).map((el, i) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          index: i,
          className: el.className,
          opacity: cs.opacity,
          width: cs.width,
          height: cs.height,
          position: cs.position,
          display: cs.display,
          visibility: cs.visibility,
          transform: cs.transform,
          zIndex: cs.zIndex,
          filter: cs.filter,
          src: el.src || '',
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
          complete: el.complete,
          rectTop: rect.top,
          rectLeft: rect.left,
          rectWidth: rect.width,
          rectHeight: rect.height,
        };
      });
    });
    console.log(`\n--- SHARD COMPUTED STYLES (first 4) ---`);
    console.log(JSON.stringify(shardStyles, null, 2));
  } else {
    console.log('\n--- NO SHARD ELEMENTS FOUND AFTER WAIT ---');
  }

  // Check the fragments container
  const fragmentsInfo = await page.evaluate(() => {
    const framerFrags = document.querySelector('.pf-crystal-shatter__fragments');
    const cssFrags = document.querySelector('.pf-cs-css__fragments');
    const result = {};
    if (framerFrags) {
      const cs = getComputedStyle(framerFrags);
      result.framer = { 
        childCount: framerFrags.children.length, 
        display: cs.display, 
        width: cs.width, 
        height: cs.height, 
        overflow: cs.overflow, 
        opacity: cs.opacity,
        position: cs.position,
        zIndex: cs.zIndex,
        innerHTML: framerFrags.innerHTML.substring(0, 300),
      };
    }
    if (cssFrags) {
      const cs = getComputedStyle(cssFrags);
      result.css = { 
        childCount: cssFrags.children.length, 
        display: cs.display, 
        width: cs.width, 
        height: cs.height, 
        overflow: cs.overflow, 
        opacity: cs.opacity,
        position: cs.position,
        zIndex: cs.zIndex,
        innerHTML: cssFrags.innerHTML.substring(0, 300),
      };
    }
    return result;
  });
  console.log(`\n--- FRAGMENTS CONTAINER ---`);
  console.log(JSON.stringify(fragmentsInfo, null, 2));

  // Check the stage container for overflow clipping
  const stageInfo = await page.evaluate(() => {
    const stage = document.querySelector('.pf-crystal-shatter__stage, .pf-cs-css__stage');
    if (!stage) return null;
    const cs = getComputedStyle(stage);
    const parent = stage.parentElement;
    const parentCs = parent ? getComputedStyle(parent) : null;
    return {
      stageClass: stage.className,
      overflow: cs.overflow,
      width: cs.width,
      height: cs.height,
      position: cs.position,
      parentClass: parent?.className || '',
      parentOverflow: parentCs?.overflow || '',
      parentWidth: parentCs?.width || '',
      parentHeight: parentCs?.height || '',
    };
  });
  console.log(`\n--- STAGE CONTAINER ---`);
  console.log(JSON.stringify(stageInfo, null, 2));

} else {
  console.log('\n--- Crystal Shatter container NOT FOUND in DOM ---');
  
  // Check all headings and sections
  const allSections = await page.evaluate(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(headings).map(h => ({ tag: h.tagName, text: h.textContent.trim().substring(0, 80) }));
  });
  console.log('\nPage headings:');
  console.log(JSON.stringify(allSections, null, 2));
}

// Print console logs  
console.log(`\n--- BROWSER CONSOLE (${consoleMsgs.length} messages) ---`);
const errors = consoleMsgs.filter(m => m.startsWith('[error]') || m.startsWith('[PAGE_ERROR]'));
const warnings = consoleMsgs.filter(m => m.startsWith('[warning]'));
if (errors.length > 0) {
  console.log(`\nERRORS (${errors.length}):`);
  errors.forEach(e => console.log(e));
}
if (warnings.length > 0) {
  console.log(`\nWARNINGS (${warnings.length}):`);
  warnings.forEach(w => console.log(w));
}
if (errors.length === 0 && warnings.length === 0) {
  console.log('No errors or warnings.');
}

await browser.close();
