const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all group index.ts files that have a css/ folder
const groupDirs = glob.sync('src/components/*/*/', { cwd: __dirname });

groupDirs.forEach((groupDir) => {
  const fullPath = path.join(__dirname, groupDir);
  const cssDir = path.join(fullPath, 'css');
  const indexPath = path.join(fullPath, 'index.ts');

  // Check if css directory exists
  if (!fs.existsSync(cssDir)) {
    return;
  }

  // Check if index.ts exists
  if (!fs.existsSync(indexPath)) {
    console.log(`⚠️  No index.ts found in ${groupDir}`);
    return;
  }

  // Find all CSS animation components
  const cssFiles = fs.readdirSync(cssDir).filter((f) => f.endsWith('.tsx'));
  if (cssFiles.length === 0) {
    console.log(`ℹ️  No CSS components in ${groupDir}css/`);
    return;
  }

  // Read the index.ts file
  let content = fs.readFileSync(indexPath, 'utf8');

  // Check if already has CSS imports
  if (content.includes('from \'./css/')) {
    console.log(`ℹ️  Already has CSS imports: ${groupDir}index.ts`);
    return;
  }

  // Extract component names from CSS files
  const cssComponents = cssFiles.map((file) => {
    const componentName = file.replace('.tsx', '');
    return {
      file: componentName,
      componentName,
      metadataName: componentName.charAt(0).toLowerCase() + componentName.slice(1) + 'CssMeta',
    };
  });

  // Find where to insert CSS imports (after framer imports, before the commented REMOVED lines or before export)
  const framerImportEnd = content.lastIndexOf('from \'./framer/');
  if (framerImportEnd === -1) {
    console.log(`⚠️  No framer imports found in ${groupDir}index.ts`);
    return;
  }

  // Find the end of that import line
  const importLineEnd = content.indexOf('\n', framerImportEnd);

  // Build CSS import statements
  const cssImports = cssComponents
    .map((comp) => {
      return `import { ${comp.componentName}, metadata as ${comp.metadataName} } from './css/${comp.componentName}'`;
    })
    .join('\n');

  // Insert CSS imports
  const beforeImports = content.slice(0, importLineEnd + 1);
  const afterImports = content.slice(importLineEnd + 1);
  content = beforeImports + '\n' + cssImports + '\n' + afterImports;

  // Remove the "// REMOVED CSS IMPORT" comment lines
  content = content.replace(/\/\/ REMOVED CSS IMPORT:.*\n/g, '');

  // Find and replace the empty css: {} object
  const cssObjectMatch = content.match(/css: \{\},/);
  if (!cssObjectMatch) {
    console.log(`⚠️  No css: {} found in ${groupDir}index.ts`);
    return;
  }

  // Build CSS object entries by matching animation IDs from framer section
  const framerSection = content.match(/framer: \{([\s\S]*?)\n  \},/);
  if (!framerSection) {
    console.log(`⚠️  No framer section found in ${groupDir}index.ts`);
    return;
  }

  // Extract animation IDs from framer section
  const idMatches = [...framerSection[1].matchAll(/'([^']+)':/g)];
  const animationIds = idMatches.map((m) => m[1]);

  // Map CSS components to animation IDs
  const cssEntries = cssComponents
    .map((comp) => {
      // Find matching animation ID
      const matchingId = animationIds.find((id) => {
        const idPart = id.split('__')[1]; // e.g., 'button-effects__ripple' -> 'ripple'
        const compPart = comp.componentName
          .replace(/^[A-Z][a-z]+Effects/, '') // Remove prefix like 'ButtonEffects'
          .replace(/^[A-Z][a-z]+[A-Z][a-z]+/, '') // Remove other prefixes
          .toLowerCase()
          .split(/(?=[A-Z])/)
          .join('-'); // Convert to kebab-case
        return id.includes(idPart) || idPart.includes(compPart) || comp.componentName.toLowerCase().includes(idPart.replace(/-/g, ''));
      });

      if (matchingId) {
        return `    '${matchingId}': { component: ${comp.componentName}, metadata: ${comp.metadataName} },`;
      }
      return null;
    })
    .filter(Boolean);

  if (cssEntries.length === 0) {
    console.log(`⚠️  Could not match CSS components to animation IDs in ${groupDir}index.ts`);
    return;
  }

  const cssObject = `css: {\n${cssEntries.join('\n')}\n  },`;
  content = content.replace(/css: \{\},/, cssObject);

  // Write the file back
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`✅ Wired up ${cssEntries.length} CSS animations in ${groupDir}index.ts`);
});

console.log('\n✅ Done!');
