Phase plan

- Phase 1: Understand & Plan
  - [✓] Diagnose build and test failures
  - [✓] Identify coverage gaps and failing specs
- Phase 2: Implement Solution
  - [✓] Fix flaky ProgressBarsZoomedProgress test
  - [✓] Fix XP Accumulation test selector issue
  - [✓] Add all-animations smoke test to execute all components
  - [ ] Add App smoke coverage test with mocked hook
- Phase 3: Validate & Iterate
  - [ ] Run unit tests + coverage to verify ≥100%
  - [ ] Address any remaining gaps and re-run (up to 3 iterations)

Tasks

- [✓] Update tsconfig to avoid test polyfills leaking into build
- [✓] Provide DOM Web Animations ambient types for TS
- [✓] Stabilize zoomed progress test timing
- [✓] Use non-ambiguous selector for x2 multiplier
- [ ] Create app smoke coverage test
- [ ] Run coverage and iterate to 100%