const fs = require('fs');
const path = require('path');

const files = [
  'src/components/progress/progress-bars/index.ts',
  'src/components/base/standard-effects/index.ts',
  'src/components/rewards/reward-basic/index.ts',
  'src/components/dialogs/modal-orchestration/index.ts',
  'src/components/dialogs/modal-content/index.ts',
  'src/components/dialogs/modal-dismiss/index.ts',
  'src/components/base/button-effects/index.ts',
  'src/components/base/text-effects/index.ts',
  'src/components/realtime/update-indicators/index.ts',
  'src/components/realtime/realtime-data/index.ts',
  'src/components/rewards/lights/index.ts',
  'src/components/rewards/icon-animations/index.ts',
  'src/components/rewards/modal-celebrations/index.ts',
  'src/components/progress/loading-states/index.ts',
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove CSS import lines
  content = content.replace(/^import .* from '\.\/(css\/.*)'/gm, '// REMOVED CSS IMPORT: $1');

  // Remove css: { } section from groupExport
  content = content.replace(/,?\s*css:\s*\{[^}]*\}/gs, '');

  fs.writeFileSync(filePath, content);
  console.log(`Processed ${file}`);
});

console.log('Done removing CSS imports');
