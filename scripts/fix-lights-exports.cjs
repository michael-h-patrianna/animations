#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to fix lights components to use default exports
 */

const lightsDir = path.join(process.cwd(), 'src/components/rewards/lights/framer');

const files = [
  'LightsCircleStatic2.tsx',
  'LightsCircleStatic3.tsx',
  'LightsCircleStatic4.tsx',
  'LightsCircleStatic5.tsx',
  'LightsCircleStatic6.tsx',
  'LightsCircleStatic7.tsx',
  'LightsCircleStatic8.tsx',
];

let fixedCount = 0;

for (const file of files) {
  const filePath = path.join(lightsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Replace named export with default export
  const updatedContent = content.replace(
    /export function (\w+)\(/,
    'export default function $1('
  );

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✓ Fixed: ${file}`);
    fixedCount++;
  }
}

console.log(`\n✓ Fixed ${fixedCount} lights component files`);
