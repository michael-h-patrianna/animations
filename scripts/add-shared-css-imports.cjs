#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * Script to add shared.css imports to components that are missing them
 */

async function addSharedCssImports() {
  console.log('Adding missing shared.css imports...\n');

  // Find all .tsx files in framer directories
  const files = await glob('src/components/**/framer/*.tsx', {
    cwd: process.cwd(),
    absolute: true,
  });

  let addedCount = 0;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if file already has shared.css import
    if (!content.includes("import '../shared.css'")) {
      // Check if shared.css exists
      const dir = path.dirname(filePath);
      const sharedCssPath = path.join(dir, '..', 'shared.css');

      if (fs.existsSync(sharedCssPath)) {
        // Add the import at the top
        const lines = content.split('\n');
        let insertIndex = 0;

        // Find the right place to insert (after any existing imports)
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('import ')) {
            insertIndex = i + 1;
          } else if (lines[i].trim() === '' && insertIndex > 0) {
            // Found empty line after imports
            break;
          } else if (!lines[i].trim().startsWith('import ') && insertIndex > 0) {
            // No more imports
            break;
          }
        }

        // Insert the import
        lines.splice(insertIndex, 0, "import '../shared.css'");
        const updatedContent = lines.join('\n');

        fs.writeFileSync(filePath, updatedContent);
        console.log(`✓ Added shared.css import to: ${path.relative(process.cwd(), filePath)}`);
        addedCount++;
      }
    }
  }

  console.log(`\n✓ Added ${addedCount} shared.css imports`);
}

addSharedCssImports().catch(console.error);
