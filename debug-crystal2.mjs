import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleMsgs = [];
page.on('console', msg => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', err => consoleMsgs.push(`[PAGE_ERROR] ${err.message}`));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(2000);

// Check all categories and groups visible on page
const pageStructure = await page.evaluate(() => {
  // Check for navigation or category links
  const nav = document.querySelectorAll('nav a, [role="navigation"] a, button');
  const navItems = Array.from(nav).map(el => ({ tag: el.tagName, text: el.textContent.trim().substring(0, 60), href: el.href || '' }));
  
  // Check all headings at any depth
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingTexts = Array.from(headings).map(h => ({ tag: h.tagName, text: h.textContent.trim().substring(0, 80) }));
  
  // Check for sidebar / category list
  const categories = document.querySelectorAll('[class*="category"], [class*="Category"], [class*="sidebar"], [class*="Sidebar"]');
  const categoryInfo = Array.from(categories).map(el => ({ class: el.className.substring(0, 60), text: el.textContent.trim().substring(0, 100) }));

  // Look for "rewards" or "prize" text in the DOM
  const allText = document.body.innerText;
  const hasRewards = allText.toLowerCase().includes('rewards');
  const hasPrize = allText.toLowerCase().includes('prize');
  const hasCrystal = allText.toLowerCase().includes('crystal');
  
  return { navItems: navItems.slice(0, 30), headingTexts, categoryInfo: categoryInfo.slice(0, 10), hasRewards, hasPrize, hasCrystal };
});

console.log('--- PAGE STRUCTURE ---');
console.log(JSON.stringify(pageStructure, null, 2));

// Take screenshot
await page.screenshot({ path: '/tmp/crystal-shatter-page.png', fullPage: true });

// Check registry - look at what's loaded
const bodyHTML = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
console.log('\n--- BODY HTML (first 500 chars) ---');
console.log(bodyHTML);

await browser.close();
