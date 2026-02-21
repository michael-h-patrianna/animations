Removed Standard Effects animation Soft Pulse across repository on 2026-02-21.

App/runtime changes:
- Deleted src components for Soft Pulse (framer + css):
  - src/components/base/standard-effects/framer/StandardEffectsSoftPulse.tsx
  - src/components/base/standard-effects/framer/StandardEffectsSoftPulse.meta.ts
  - src/components/base/standard-effects/framer/StandardEffectsSoftPulse.css
  - src/components/base/standard-effects/css/StandardEffectsSoftPulse.tsx
  - src/components/base/standard-effects/css/StandardEffectsSoftPulse.meta.ts
  - src/components/base/standard-effects/css/StandardEffectsSoftPulse.css
- Removed all related imports/lazy loaders/metadata references and groupExport entries for id standard-effects__soft-pulse in:
  - src/components/base/standard-effects/index.ts
- Removed soft pulse imports/test cases from:
  - src/__tests__/standard-effects.data-animation-id.test.tsx

Mirrored skill/reference cleanup:
- Removed catalog row for Soft Pulse in:
  - .agents/skills/animation-design/catalog.md
  - .claude/skills/animation-design/catalog.md
- Removed Soft Pulse imports/lazy loaders/metadata references and groupExport entries in:
  - .agents/skills/animation-design/reference/base/standard-effects/index.ts
  - .claude/skills/animation-design/reference/base/standard-effects/index.ts
- Deleted mirrored reference files (framer + css variants + meta/css) under both .agents and .claude reference/base/standard-effects folders.

Verification:
- `npm test -- src/__tests__/standard-effects.data-animation-id.test.tsx` passed (42 tests).
- `npm run build` passed.
- Repo-wide search for `Soft Pulse`, `StandardEffectsSoftPulse`, and `standard-effects__soft-pulse` returned no matches.