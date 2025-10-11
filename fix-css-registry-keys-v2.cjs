#!/usr/bin/env node

/**
 * Script to update group index.ts files to add -css suffix to CSS animation registry keys
 * V2: Improved to handle all keys in css block
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
    let fileKeysUpdated = 0;

    // Find and replace all keys in the css section that don't already end with -css
    // Pattern matches: 'some-key__variant': { at the start of a line (with indentation)
    const keyPattern = /^(\s+)['"]([a-z0-9_-]+__[a-z0-9_-]+)['"]:\s*\{/gm;

    // Track if we're inside the css block
    const cssBlockStart = content.indexOf('css: {');
    if (cssBlockStart === -1) {
      console.log(`⊘ No CSS section in: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
      continue;
    }

    // Find the closing brace of the css block
    let braceDepth = 0;
    let cssBlockEnd = cssBlockStart;
    let foundStart = false;
    for (let i = cssBlockStart; i < content.length; i++) {
      if (content[i] === '{') {
        braceDepth++;
        foundStart = true;
      } else if (content[i] === '}') {
        braceDepth--;
        if (foundStart && braceDepth === 0) {
          cssBlockEnd = i + 1;
          break;
        }
      }
    }

    const cssBlock = content.substring(cssBlockStart, cssBlockEnd);
    let newCssBlock = cssBlock;

    // Replace all keys in the css block
    newCssBlock = newCssBlock.replace(keyPattern, (match, indent, key) => {
      if (key.endsWith('-css')) {
        return match; // Already has -css suffix
      }
      fileKeysUpdated++;
      const newKey = key + '-css';
      return `${indent}'${newKey}': {`;
    });

    if (newCssBlock !== cssBlock) {
      newContent = content.substring(0, cssBlockStart) + newCssBlock + content.substring(cssBlockEnd);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✓ Updated: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
      console.log(`  Keys updated: ${fileKeysUpdated}`);
      updatedCount++;
      keysUpdated += fileKeysUpdated;
    } else {
      console.log(`✓ Already updated: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
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
