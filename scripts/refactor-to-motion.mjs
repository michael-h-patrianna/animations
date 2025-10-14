#!/usr/bin/env node

/**
 * Refactor script: Convert framer-motion imports to motion/react-m
 * This script updates all animation components to use the optimized m components
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Patterns to match all framer animation files
const patterns = [
  'src/components/base/**/framer/*.tsx',
  'src/components/dialogs/**/framer/*.tsx',
  'src/components/progress/**/framer/*.tsx',
  'src/components/realtime/**/framer/*.tsx',
  'src/components/rewards/**/framer/*.tsx',
];

async function refactorFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;

  // Replace framer-motion imports with motion/react-m
  const oldImportPattern = /import\s*{([^}]+)}\s*from\s*['"]framer-motion['"]/g;

  const match = content.match(oldImportPattern);
  if (match) {
    const imports = match[0];

    // Extract the imported items
    const importMatch = imports.match(/import\s*{([^}]+)}\s*from/);
    if (importMatch) {
      const importedItems = importMatch[1]
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

      // Separate motion from other imports
      const hasMotion = importedItems.some(item => item === 'motion');
      const otherImports = importedItems.filter(item => item !== 'motion');

      let newImports = '';

      // Add motion/react-m import if motion was imported
      if (hasMotion) {
        newImports += "import * as m from 'motion/react-m'\n";
      }

      // Add motion/react import for other items
      if (otherImports.length > 0) {
        newImports += `import { ${otherImports.join(', ')} } from 'motion/react'`;
      }

      content = content.replace(oldImportPattern, newImports);
      modified = true;
    }
  }

  // Replace <motion. with <m.
  if (content.includes('<motion.')) {
    content = content.replace(/<motion\./g, '<m.');
    modified = true;
  }

  // Replace </motion. with </m.
  if (content.includes('</motion.')) {
    content = content.replace(/<\/motion\./g, '</m.');
    modified = true;
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
    return true;
  }

  return false;
}

async function main() {
  console.log('Starting framer-motion to motion/react-m refactor...\n');

  let totalFiles = 0;
  let modifiedFiles = 0;

  for (const pattern of patterns) {
    const files = await glob(pattern, { cwd: rootDir });

    for (const file of files) {
      const filePath = path.join(rootDir, file);
      totalFiles++;

      try {
        const wasModified = await refactorFile(filePath);
        if (wasModified) {
          modifiedFiles++;
          console.log(`✓ ${file}`);
        }
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error.message);
      }
    }
  }

  console.log(`\n✅ Refactor complete!`);
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files modified: ${modifiedFiles}`);
  console.log(`   Files unchanged: ${totalFiles - modifiedFiles}`);
}

main().catch(console.error);
