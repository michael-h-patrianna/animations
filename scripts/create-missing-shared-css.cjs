#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * Script to create empty shared.css files for groups that don't have one
 */

async function createMissingSharedCss() {
  console.log('Finding groups without shared.css...\n');

  // Find all group directories (directories containing framer/ subdirectories)
  const framerDirs = await glob('src/components/**/framer', {
    cwd: process.cwd(),
    absolute: true,
  });

  let createdCount = 0;

  for (const framerDir of framerDirs) {
    const groupDir = path.dirname(framerDir);
    const sharedCssPath = path.join(groupDir, 'shared.css');

    if (!fs.existsSync(sharedCssPath)) {
      // Create empty shared.css
      fs.writeFileSync(sharedCssPath, '/* Shared styles for this group */\n');
      console.log(`✓ Created: ${path.relative(process.cwd(), sharedCssPath)}`);
      createdCount++;
    }
  }

  console.log(`\n✓ Created ${createdCount} shared.css files`);
}

createMissingSharedCss().catch(console.error);
