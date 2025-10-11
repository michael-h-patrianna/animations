#!/usr/bin/env node

/**
 * Script to update CSS animation metadata that use "satisfies AnimationMetadata"
 * to have unique IDs with -css suffix and (CSS) suffix in titles.
 */

const fs = require('fs');
const path = require('path');

// Files with satisfies syntax that need updating
const filesToUpdate = [
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/modal-celebrations/css/ModalCelebrationsTreasureParticles.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/modal-celebrations/css/ModalCelebrationsFireworksTriple.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/modal-celebrations/css/ModalCelebrationsFireworksRing.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiSpiral.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiRain.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/modal-celebrations/css/ModalCelebrationsCoinsFountain.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/modal-celebrations/css/ModalCelebrationsCoinsArc.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/rewards/icon-animations/css/IconAnimationsPulse.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesSpinnerOrbital.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesSpinnerGalaxy.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesSpinnerDualRing.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesSkeletonVertical.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesSkeletonTile.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesSkeletonHorizontal.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesSkeletonCard.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesRingProgress.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesRingMulti.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesDotsRise.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/progress/loading-states/css/LoadingStatesDotsPortal.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsXpNumberPop.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsWaveText.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsWaveReveal.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsVerbTwirl.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsVerbJump.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsVerbJog.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsVerbFloat.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsVerbFlip.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsVerbFall.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsTypewriter.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsMetallicSpecularFlash.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsLightSweepDraw.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsLevelBreakthrough.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsHorizonLightPass.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsGlitchText.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsEpicWin.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsCounterIncrement.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsComboCounter.tsx',
  '/Users/michaelhaufschild/Documents/code/animations/src/components/base/text-effects/css/TextEffectsCharacterReveal.tsx',
];

console.log(`Processing ${filesToUpdate.length} files with "satisfies AnimationMetadata"\n`);

let updatedCount = 0;
let skippedCount = 0;
let errors = [];

for (const filePath of filesToUpdate) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;

    // Pattern to match metadata using satisfies
    const metadataRegex = /export const metadata = \{([^}]+)\} satisfies AnimationMetadata/s;
    const match = content.match(metadataRegex);

    if (!match) {
      console.log(`⚠️  No metadata found in: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
      skippedCount++;
      continue;
    }

    const metadataContent = match[1];

    // Extract current id
    const idMatch = metadataContent.match(/id:\s*['"]([^'"]+)['"]/);
    if (!idMatch) {
      console.log(`⚠️  No id field found in: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
      skippedCount++;
      continue;
    }

    const currentId = idMatch[1];

    // Skip if already has -css suffix
    if (currentId.endsWith('-css')) {
      console.log(`✓ Already updated: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
      skippedCount++;
      continue;
    }

    const newId = currentId + '-css';

    // Extract current title
    const titleMatch = metadataContent.match(/title:\s*['"]([^'"]+)['"]/);
    if (!titleMatch) {
      console.log(`⚠️  No title field found in: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
      skippedCount++;
      continue;
    }

    const currentTitle = titleMatch[1];

    // Add (CSS) suffix to title if not present
    if (!currentTitle.endsWith('(CSS)')) {
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
      console.log(`✓ Updated: ${path.relative('/Users/michaelhaufschild/Documents/code/animations/src/components', filePath)}`);
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
