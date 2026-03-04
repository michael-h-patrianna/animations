import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleMsgs = [];
page.on('console', msg => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', err => consoleMsgs.push(`[PAGE_ERROR] ${err.message}`));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(1000);

await page.locator('button:has-text("Prize Reveal")').first().click();
await page.waitForTimeout(6000);

// Get complete DOM of the crystal shatter card
const fullDOM = await page.evaluate(() => {
  // Find the card that has crystal shatter
  const cards = document.querySelectorAll('[data-animation-id="prize-reveal__crystal-shatter"]');
  if (cards.length === 0) return 'NOT FOUND';
  
  const card = cards[0]; // first one is the card wrapper
  
  // Get all child elements recursively, max depth 5
  function getTree(el, depth) {
    if (depth > 6) return '...';
    const cs = getComputedStyle(el);
    const result = {
      tag: el.tagName,
      class: el.className?.substring?.(0, 80) || '',
      children: [],
      display: cs.display,
      opacity: cs.opacity,
      width: cs.width,
      height: cs.height,
    };
    if (el.tagName === 'IMG') {
      result.src = el.src.split('/').pop();
      result.naturalWidth = el.naturalWidth;
    }
    for (const child of el.children) {
      result.children.push(getTree(child, depth + 1));
    }
    return result;
  }
  
  return getTree(card, 0);
});

console.log('--- CRYSTAL SHATTER CARD DOM TREE ---');
console.log(JSON.stringify(fullDOM, null, 2));

// Now check if there's a .pf-demo-canvas inside and what's in it
const canvasInfo = await page.evaluate(() => {
  const cards = document.querySelectorAll('[data-animation-id="prize-reveal__crystal-shatter"]');
  if (cards.length === 0) return 'NOT FOUND';
  const card = cards[0];
  const canvas = card.querySelector('.pf-demo-canvas');
  if (!canvas) return { canvas: 'NOT FOUND', cardHTML: card.innerHTML.substring(0, 2000) };
  return {
    canvasClass: canvas.className,
    canvasDisplay: getComputedStyle(canvas).display,
    canvasWidth: getComputedStyle(canvas).width,
    canvasHeight: getComputedStyle(canvas).height,
    canvasOverflow: getComputedStyle(canvas).overflow,
    canvasChildCount: canvas.children.length,
    canvasInnerHTML: canvas.innerHTML.substring(0, 2000),
  };
});
console.log('\n--- DEMO CANVAS ---');
console.log(JSON.stringify(canvasInfo, null, 2));

// Check for the css variant too - click CSS tab if present
const cssTab = page.locator('button:has-text("CSS")');
if (await cssTab.count() > 0) {
  await cssTab.first().click();
  await page.waitForTimeout(4000);
  
  const cssAnimIds = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-animation-id]')).map(el => ({
      id: el.getAttribute('data-animation-id'),
      class: el.className.substring(0, 80),
      childCount: el.children.length,
    }));
  });
  console.log('\n--- CSS TAB ANIMATION IDs ---');
  console.log(JSON.stringify(cssAnimIds, null, 2));
}

console.log(`\n--- CONSOLE (${consoleMsgs.length}) ---`);
consoleMsgs.forEach(m => console.log(m));

await browser.close();
