Problem: lights animations derive many blend/shadow colors from `onColor` via `calculateBulbColors`, but parser in `src/utils/colors.ts` only handled hex + rgba. Passing `var(--pf-anim-gold)` produced NaN channels and broken styles.

Fix (2026-02-20):
- Added robust color normalization in `src/utils/colors.ts`:
  - parse hex (`#rgb/#rgba/#rrggbb/#rrggbbaa`)
  - parse `rgb()/rgba()` (including percentage channels)
  - resolve CSS vars/named colors via DOM computed style (`resolveCssColor`)
  - fallback RGB if unresolved
- Updated color math helpers (`blendColors`, `addTransparency`, `shiftColorTemperature`, `calculateBulbColors`) to rely on normalized RGB parsing instead of string slicing.
- Added regression test `src/utils/colors.test.ts`: `calculateBulbColors('var(--test-bulb-color)')` equals hex-equivalent output.

Verification run:
- `npm test -- src/utils/colors.test.ts` pass
- `npx eslint src/utils/colors.ts src/utils/colors.test.ts ...lights tsx` pass
- `npm test -- src/__tests__/allAnimations.smoke.test.tsx src/__tests__/registryConsistency.test.tsx` pass
- `npm run type-check` pass