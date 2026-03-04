import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleMsgs = [];
page.on('console', msg => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', err => consoleMsgs.push(`[PAGE_ERROR] ${err.message}`));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(1000);

// Click Prize Reveal
await page.locator('button:has-text("Prize Reveal")').first().click();
await page.waitForTimeout(6000);

// Find the crystal shatter container and check its actual innerHTML
const csInfo = await page.evaluate(() => {
  const el = document.querySelector('[data-animation-id="prize-reveal__crystal-shatter"]');
  if (!el) return { found: false };
  
  // Go up to find the AnimationCard wrapper
  let card = el;
  for (let i = 0; i < 5; i++) {
    if (card.parentElement) card = card.parentElement;
    if (card.classList.contains('pf-demo-canvas') || card.classList.contains('animation-card')) break;
  }
  
  return {
    found: true,
    tagName: el.tagName,
    className: el.className,
    innerHTML: el.innerHTML.substring(0, 800),
    childCount: el.children.length,
    innerText: el.innerText.substring(0, 200),
    outerHTMLLength: el.outerHTML.length,
    computedDisplay: getComputedStyle(el).display,
    computedVisibility: getComputedStyle(el).visibility,
    computedOpacity: getComputedStyle(el).opacity,
    computedWidth: getComputedStyle(el).width,
    computedHeight: getComputedStyle(el).height,
    computedOverflow: getComputedStyle(el).overflow,
    offsetWidth: el.offsetWidth,
    offsetHeight: el.offsetHeight,
    parentClass: el.parentElement?.className?.substring(0, 100) || '',
    parentDisplay: el.parentElement ? getComputedStyle(el.parentElement).display : '',
    parentWidth: el.parentElement ? getComputedStyle(el.parentElement).width : '',
    parentHeight: el.parentElement ? getComputedStyle(el.parentElement).height : '',
    parentOverflow: el.parentElement ? getComputedStyle(el.parentElement).overflow : '',
    // check for error boundaries
    errorBoundary: el.querySelector('[class*="error"]')?.textContent || 'none',
  };
});

console.log('--- CRYSTAL SHATTER CONTAINER ---');
console.log(JSON.stringify(csInfo, null, 2));

// Check ALL animation IDs and compare - are any others also missing inner content?
const allAnimations = await page.evaluate(() => {
  const els = document.querySelectorAll('[data-animation-id]');
  return Array.from(els).map(el => ({
    id: el.getAttribute('data-animation-id'),
    className: el.className.substring(0, 60),
    childCount: el.children.length,
    innerHTMLLength: el.innerHTML.length,
    hasStage: !!el.querySelector('[class*="stage"]'),
  }));
});
console.log('\n--- ALL ANIMATION CONTAINERS ---');
console.log(JSON.stringify(allAnimations, null, 2));

// Check for Suspense fallback or loading states
const suspense = await page.evaluate(() => {
  const loadings = document.querySelectorAll('[class*="loading"], [class*="Loading"], [class*="spinner"], [class*="Spinner"], [class*="suspense"], [class*="Suspense"], [class*="fallback"], [class*="Fallback"]');
  return Array.from(loadings).map(el => ({ class: el.className, text: el.textContent.substring(0, 50) }));
});
console.log('\n--- SUSPENSE/LOADING ELEMENTS ---');
console.log(JSON.stringify(suspense, null, 2));

// Check ALL console messages
console.log(`\n--- ALL BROWSER CONSOLE (${consoleMsgs.length} messages) ---`);
consoleMsgs.forEach(m => console.log(m));

await browser.close();
