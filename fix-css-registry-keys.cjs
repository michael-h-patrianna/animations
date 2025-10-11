#!/usr/bin/env node

/**
 * Script to update group index.ts files to add -css suffix to CSS animation registry keys
 */

const fs = require('fs');
const path = require('path');

// Group index files that need updating
const groupIndexFiles = [
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/button-effects/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/standard-effects/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/dialogs/modal-base/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/dialogs/modal-content/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/dialogs/modal-dismiss/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/dialogs/modal-orchestration/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/realtime/timer-effects/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/realtime/update-indicators/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/realtime/realtime-data/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/icon-animations/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/lights/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/modal-celebrations/index.ts',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/reward-basic/index.ts',
];

console.log(`Processing ${groupIndexFiles.length} group index files\n`);

let updatedCount = 0;
let keysUpdated = 0;
let errors = [];

for (const filePath of groupIndexFiles) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if file has a css section
    if (!content.includes('css: {')) {
      console.log(`⊘ No CSS section in: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
      continue;
    }

    let newContent = content;
    let fileModified = false;
    let fileKeysUpdated = 0;

    // Match the css section
    const cssBlockRegex = /css:\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s;
    const cssMatch = content.match(cssBlockRegex);

    if (!cssMatch) {
      console.log(`⚠️  Could not parse CSS section in: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
      continue;
    }

    const cssBlock = cssMatch[1];

    // Find all keys in the CSS section that don't already end with -css
    // Pattern: 'key': { ... } where key doesn't end with -css
    const keyPattern = /['"]([a-z0-9_-]+__[a-z0-9_-]+)['"]:\s*\{/g;
    let match;
    const keysToUpdate = [];

    while ((match = keyPattern.exec(cssBlock)) !== null) {
      const key = match[1];
      if (!key.endsWith('-css')) {
        keysToUpdate.push(key);
      }
    }

    if (keysToUpdate.length === 0) {
      console.log(`✓ Already updated: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
      continue;
    }

    // Update each key
    for (const key of keysToUpdate) {
      const newKey = key + '-css';
      // Replace the key in the css section only
      // Use a more specific pattern to avoid replacing in imports
      const keyReplacePattern = new RegExp(`(['"])${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"]):\\s*\\{`, 'g');

      // Only replace within the css block
      const oldCssBlock = cssMatch[0];
      const newCssBlock = oldCssBlock.replace(keyReplacePattern, `$1${newKey}$2: {`);

      if (oldCssBlock !== newCssBlock) {
        newContent = newContent.replace(oldCssBlock, newCssBlock);
        fileModified = true;
        fileKeysUpdated++;
      }
    }

    if (fileModified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✓ Updated: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
      console.log(`  Keys updated: ${fileKeysUpdated}`);
      updatedCount++;
      keysUpdated += fileKeysUpdated;
    }

  } catch (error) {
    errors.push({ file: filePath, error: error.message });
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`Summary:`);
console.log(`  Files updated: ${updatedCount}`);
console.log(`  Total keys updated: ${keysUpdated}`);
console.log(`  Errors: ${errors.length}`);
console.log('='.repeat(60));

if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(({ file, error }) => {
    console.log(`  ${file}: ${error}`);
  });
  process.exit(1);
}

process.exit(0);
