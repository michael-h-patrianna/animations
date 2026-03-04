import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleMsgs = [];
page.on('console', msg => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', err => consoleMsgs.push(`[PAGE_ERROR] ${err.message}`));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(1000);

// Click "Prize Reveal" in sidebar
const prizeRevealBtn = page.locator('button:has-text("Prize Reveal")');
const prBtnCount = await prizeRevealBtn.count();
console.log(`Prize Reveal buttons found: ${prBtnCount}`);

if (prBtnCount > 0) {
  await prizeRevealBtn.first().click();
  await page.waitForTimeout(5000); // Wait for navigation + animation (shatter happens at 2.4s)

  // Screenshot the full page
  await page.screenshot({ path: '/tmp/crystal-shatter-prize-reveal.png', fullPage: true });

  // Check for crystal shatter animation
  const animationIds = await page.evaluate(() => {
    const els = document.querySelectorAll('[data-animation-id]');
    return Array.from(els).map(el => el.getAttribute('data-animation-id'));
  });
  console.log('\n--- ANIMATION IDs on Prize Reveal page ---');
  console.log(JSON.stringify(animationIds, null, 2));

  // Check for headings
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h2, h3, h4')).map(h => h.textContent.trim().substring(0, 100));
  });
  console.log('\n--- HEADINGS ---');
  console.log(JSON.stringify(headings, null, 2));

  // Check for all crystal-shatter elements
  const csElements = await page.locator('[class*="crystal-shatter"]').count();
  const csCssElements = await page.locator('[class*="cs-css"]').count();
  console.log(`\nElements with "crystal-shatter": ${csElements}`);
  console.log(`Elements with "cs-css": ${csCssElements}`);

  // Check shard elements
  const framerShards = await page.locator('.pf-crystal-shatter__shard').count();
  const cssShards = await page.locator('.pf-cs-css__shard').count();
  console.log(`\n--- SHARD ELEMENTS ---`);
  console.log(`.pf-crystal-shatter__shard: ${framerShards}`);
  console.log(`.pf-cs-css__shard: ${cssShards}`);

  // Check fragments containers
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
        visibility: cs.visibility,
      };
    } else {
      result.framer = 'NOT_IN_DOM';
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
        visibility: cs.visibility,
      };
    } else {
      result.css = 'NOT_IN_DOM';
    }
    return result;
  });
  console.log('\n--- FRAGMENTS CONTAINERS ---');
  console.log(JSON.stringify(fragmentsInfo, null, 2));

  // If shards exist, get their computed styles
  const totalShards = framerShards + cssShards;
  if (totalShards > 0) {
    const shardStyles = await page.evaluate(() => {
      const shards = document.querySelectorAll('.pf-crystal-shatter__shard, .pf-cs-css__shard');
      return Array.from(shards).slice(0, 5).map((el, i) => {
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
          animation: cs.animation,
          animationPlayState: cs.animationPlayState,
          src: el.src || '',
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
          complete: el.complete,
          rectTop: Math.round(rect.top),
          rectLeft: Math.round(rect.left),
          rectWidth: Math.round(rect.width),
          rectHeight: Math.round(rect.height),
        };
      });
    });
    console.log('\n--- SHARD COMPUTED STYLES ---');
    console.log(JSON.stringify(shardStyles, null, 2));
  }

  // Check stage/parent containers for overflow
  const stageInfo = await page.evaluate(() => {
    const stages = document.querySelectorAll('.pf-crystal-shatter__stage, .pf-cs-css__stage');
    return Array.from(stages).map(stage => {
      const cs = getComputedStyle(stage);
      const parent = stage.parentElement;
      const parentCs = parent ? getComputedStyle(parent) : null;
      const grandparent = parent?.parentElement;
      const gpCs = grandparent ? getComputedStyle(grandparent) : null;
      return {
        stageClass: stage.className,
        overflow: cs.overflow,
        width: cs.width,
        height: cs.height,
        position: cs.position,
        parentClass: parent?.className?.substring(0, 80) || '',
        parentOverflow: parentCs?.overflow || '',
        parentWidth: parentCs?.width || '',
        parentHeight: parentCs?.height || '',
        grandparentClass: grandparent?.className?.substring(0, 80) || '',
        gpOverflow: gpCs?.overflow || '',
        gpWidth: gpCs?.width || '',
        gpHeight: gpCs?.height || '',
      };
    });
  });
  console.log('\n--- STAGE CONTAINERS ---');
  console.log(JSON.stringify(stageInfo, null, 2));

  // Screenshot focused on crystal shatter area if it exists
  const csContainer = page.locator('[data-animation-id*="crystal-shatter"]').first();
  if (await csContainer.count() > 0) {
    await csContainer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const box = await csContainer.boundingBox();
    if (box) {
      await page.screenshot({
        path: '/tmp/crystal-shatter-focused.png',
        clip: { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 60), width: Math.min(box.width + 40, 1280), height: Math.min(box.height + 120, 900) }
      });
      console.log('\nFocused screenshot saved to /tmp/crystal-shatter-focused.png');
    }
  }
}

// Console errors
const errors = consoleMsgs.filter(m => m.startsWith('[error]') || m.startsWith('[PAGE_ERROR]'));
const warnings = consoleMsgs.filter(m => m.startsWith('[warning]'));
console.log(`\n--- BROWSER CONSOLE ---`);
console.log(`Total messages: ${consoleMsgs.length}, Errors: ${errors.length}, Warnings: ${warnings.length}`);
if (errors.length > 0) {
  console.log('\nERRORS:');
  errors.forEach(e => console.log(e));
}
if (warnings.length > 0) {
  console.log('\nWARNINGS:');
  warnings.slice(0, 5).forEach(w => console.log(w));
}

await browser.close();
