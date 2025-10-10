#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Get all files with useReducedMotion
const files = execSync('grep -l "useReducedMotion" src/**/*.tsx 2>/dev/null', { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${files.length} files with useReducedMotion`);

let processedCount = 0;
let errorCount = 0;

files.forEach((file, index) => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Remove useReducedMotion from imports
    content = content.replace(
      /import\s*{([^}]*?)useReducedMotion\s*,?\s*([^}]*?)}\s*from\s*'framer-motion'/g,
      (match, before, after) => {
        const cleanBefore = before.replace(/,\s*$/, '').trim();
        const cleanAfter = after.replace(/^\s*,/, '').trim();
        const imports = [cleanBefore, cleanAfter].filter(Boolean).join(', ');
        return imports ? `import { ${imports} } from 'framer-motion'` : '';
      }
    );
    
    // Also handle the case where it's in a different order
    content = content.replace(
      /import\s*{([^}]*?),\s*useReducedMotion([^}]*?)}\s*from\s*'framer-motion'/g,
      (match, before, after) => {
        const cleanBefore = before.trim();
        const cleanAfter = after.replace(/^\s*,/, '').trim();
        const imports = [cleanBefore, cleanAfter].filter(Boolean).join(', ');
        return imports ? `import { ${imports} } from 'framer-motion'` : '';
      }
    );
    
    // Remove the shouldReduceMotion declaration line
    content = content.replace(/\s*const\s+shouldReduceMotion\s*=\s*useReducedMotion\(\)\s*\n?/g, '\n');
    
    // Remove comments mentioning reduced motion
    content = content.replace(/\s*\/\/\s*Honor reduced-motion preferences.*\n?/g, '\n');
    
    // Write back if changed
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf-8');
      processedCount++;
      console.log(`✓ [${index + 1}/${files.length}] ${file}`);
    } else {
      console.log(`- [${index + 1}/${files.length}] ${file} (no changes)`);
    }
  } catch (error) {
    errorCount++;
    console.error(`✗ [${index + 1}/${files.length}] ${file}: ${error.message}`);
  }
});

console.log(`\nProcessed ${processedCount} files successfully`);
if (errorCount > 0) {
  console.log(`Failed to process ${errorCount} files`);
}
console.log('\nNote: Conditional logic with shouldReduceMotion must be removed manually');
