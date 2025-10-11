const fs = require('fs');
const path = require('path');

const groupIndexFiles = [
  'src/components/dialogs/modal-base/index.ts',
  'src/components/realtime/timer-effects/index.ts',
  'src/components/rewards/reward-basic/index.ts',
  'src/components/dialogs/modal-orchestration/index.ts',
  'src/components/progress/loading-states/index.ts',
  'src/components/rewards/modal-celebrations/index.ts',
  'src/components/rewards/icon-animations/index.ts',
  'src/components/rewards/lights/index.ts',
  'src/components/realtime/realtime-data/index.ts',
  'src/components/realtime/update-indicators/index.ts',
  'src/components/base/text-effects/index.ts',
  'src/components/base/button-effects/index.ts',
  'src/components/dialogs/modal-dismiss/index.ts',
  'src/components/dialogs/modal-content/index.ts',
  'src/components/progress/progress-bars/index.ts',
  'src/components/base/standard-effects/index.ts',
];

groupIndexFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if css property is missing by looking for the pattern where framer is defined but css is not
  if (content.includes('framer: {') && !content.includes('css: {')) {
    // Find the closing brace of framer object and add css property after it
    const framerClosingMatch = content.match(/(framer: \{[\s\S]*?\n  \},)/);
    if (framerClosingMatch) {
      const framerBlock = framerClosingMatch[1];
      const replacement = framerBlock + '\n  css: {},';
      content = content.replace(framerBlock, replacement);

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
    } else {
      console.log(`⚠️  Could not find framer closing brace in: ${file}`);
    }
  } else {
    console.log(`ℹ️  Skipped (already has css property): ${file}`);
  }
});

console.log('\n✅ All files processed!');
