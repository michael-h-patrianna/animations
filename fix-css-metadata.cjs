#!/usr/bin/env node

/**
 * Script to update CSS animation metadata to have unique IDs with -css suffix
 * and (CSS) suffix in titles.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all CSS animation files
const componentsDir = path.join(__dirname, 'src', 'components');
const cssFiles = execSync(`find "${componentsDir}" -path "*/css/*.tsx" -type f`)
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${cssFiles.length} CSS animation files to update\n`);

let updatedCount = 0;
let skippedCount = 0;
let errors = [];

for (const filePath of cssFiles) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;

    // Pattern to match metadata export with id field
    // Captures: export const metadata: AnimationMetadata = { id: 'xxx', ...
    const metadataRegex = /export const metadata: AnimationMetadata = \{([^}]+)\}/s;
    const match = content.match(metadataRegex);

    if (!match) {
      console.log(`⚠️  No metadata found in: ${path.relative(componentsDir, filePath)}`);
      skippedCount++;
      continue;
    }

    const metadataContent = match[1];

    // Extract current id
    const idMatch = metadataContent.match(/id:\s*['"]([^'"]+)['"]/);
    if (!idMatch) {
      console.log(`⚠️  No id field found in: ${path.relative(componentsDir, filePath)}`);
      skippedCount++;
      continue;
    }

    const currentId = idMatch[1];

    // Skip if already has -css suffix
    if (currentId.endsWith('-css')) {
      console.log(`✓ Already updated: ${path.relative(componentsDir, filePath)}`);
      skippedCount++;
      continue;
    }

    const newId = currentId + '-css';

    // Extract current title
    const titleMatch = metadataContent.match(/title:\s*['"]([^'"]+)['"]/);
    if (!titleMatch) {
      console.log(`⚠️  No title field found in: ${path.relative(componentsDir, filePath)}`);
      skippedCount++;
      continue;
    }

    const currentTitle = titleMatch[1];

    // Skip if already has (CSS) suffix
    if (currentTitle.endsWith('(CSS)')) {
      console.log(`✓ Title already updated: ${path.relative(componentsDir, filePath)}`);
      // Still need to update ID
    } else {
      // Add (CSS) suffix to title
      const newTitle = currentTitle + ' (CSS)';
      newContent = newContent.replace(
        new RegExp(`(title:\\s*['"])${currentTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"])`),
        `$1${newTitle}$2`
      );
      modified = true;
    }

    // Update id
    newContent = newContent.replace(
      new RegExp(`(id:\\s*['"])${currentId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"])`),
      `$1${newId}$2`
    );
    modified = true;

    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✓ Updated: ${path.relative(componentsDir, filePath)}`);
      console.log(`  ID: ${currentId} → ${newId}`);
      updatedCount++;
    }

  } catch (error) {
    errors.push({ file: filePath, error: error.message });
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`Summary:`);
console.log(`  Updated: ${updatedCount} files`);
console.log(`  Skipped: ${skippedCount} files`);
console.log(`  Errors: ${errors.length} files`);
console.log('='.repeat(60));

if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(({ file, error }) => {
    console.log(`  ${file}: ${error}`);
  });
  process.exit(1);
}

process.exit(0);
