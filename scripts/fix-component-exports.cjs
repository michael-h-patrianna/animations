#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * Script to fix missing component exports
 * Finds all empty .tsx files and adds the required named export function
 */

async function fixComponentExports() {
  console.log('Finding empty component files...\n');

  // Find all .tsx files in the components directory
  const files = await glob('src/components/**/framer/*.tsx', {
    cwd: process.cwd(),
    absolute: true,
  });

  let fixedCount = 0;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if file is empty or only has imports
    const hasExportFunction = /export\s+function\s+\w+/.test(content);

    if (!hasExportFunction) {
      // Extract component name from filename
      const filename = path.basename(filePath, '.tsx');

      // Generate the component content
      const componentContent = `import '../shared.css'

export function ${filename}() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element">
        <div className="demo-text">${filename.replace(/([A-Z])/g, ' $1').trim()}</div>
      </div>
    </div>
  )
}
`;

      fs.writeFileSync(filePath, componentContent);
      console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
      fixedCount++;
    }
  }

  console.log(`\n✓ Fixed ${fixedCount} component files`);
}

fixComponentExports().catch(console.error);
