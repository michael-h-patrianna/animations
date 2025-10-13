#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * Script to remove shared.css imports from components where the file doesn't exist
 */

async function fixMissingSharedCss() {
  console.log('Checking for missing shared.css imports...\n');

  // Find all .tsx files in the components directory
  const files = await glob('src/components/**/framer/*.tsx', {
    cwd: process.cwd(),
    absolute: true,
  });

  let fixedCount = 0;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if file imports shared.css
    if (content.includes("import '../shared.css'")) {
      // Check if shared.css exists
      const dir = path.dirname(filePath);
      const sharedCssPath = path.join(dir, '..', 'shared.css');

      if (!fs.existsSync(sharedCssPath)) {
        // Remove the import
        const updatedContent = content.replace(/import '\.\.\/shared\.css'\n?/, '');
        fs.writeFileSync(filePath, updatedContent);
        console.log(`✓ Removed shared.css import from: ${path.relative(process.cwd(), filePath)}`);
        fixedCount++;
      }
    }
  }

  console.log(`\n✓ Fixed ${fixedCount} component files`);
}

fixMissingSharedCss().catch(console.error);
