Removed timer-effects animations Timer Flip and Timer Color Shift across repo on 2026-02-21.

App/runtime cleanup:
- Deleted framer+css component/meta/css files for TimerEffectsTimerFlip and TimerEffectsTimerColorShift under src/components/realtime/timer-effects/{framer,css}.
- Removed related imports/lazy loaders/metadata registrations and groupExport entries in src/components/realtime/timer-effects/index.ts.
- Updated timer-effects tests to drop flip/color-shift cases:
  - src/__tests__/timer-effects.restart-parity.test.tsx
  - src/__tests__/timer-effects.restart-timeout-cleanup.test.tsx
- Updated e2e representative scenario from timer-color-shift to timer-pulse in tests/e2e/animation-rendering.spec.ts.
- Removed deleted CSS file entries from scripts/add-will-change.mjs.

Mirrored skill/reference cleanup for full repository removal:
- Removed Timer Flip / Timer Color Shift rows from:
  - .agents/skills/animation-design/catalog.md
  - .claude/skills/animation-design/catalog.md
- Deleted corresponding reference files (framer/css + meta/metadata + css) under:
  - .agents/skills/animation-design/reference/realtime/timer-effects/
  - .claude/skills/animation-design/reference/realtime/timer-effects/
- Removed imports/lazy loaders/metadata map entries from both mirrored timer-effects index.ts files.

Verification:
- rg search for titles/class names/IDs returned no matches repository-wide.
- Targeted tests passed:
  npm test -- src/__tests__/timer-effects.restart-parity.test.tsx src/__tests__/timer-effects.restart-timeout-cleanup.test.tsx
- Build passed: npm run build