## Active Target
- Target: rewards/modal-celebrations :: modal-celebrations__confetti-rain
- Scope: investigate and fix BOTH framer + css variants together
- Patrol mode: one animation at a time in celebration group

## Task Queue Details
Current queue (confetti-rain):
1. [in_progress] Understand purpose of modal-celebrations__confetti-rain
2. [pending] Analyze src/components/rewards/modal-celebrations/framer/ModalCelebrationsConfettiRain.tsx
3. [pending] Analyze src/components/rewards/modal-celebrations/framer/ModalCelebrationsConfettiRain.meta.ts
4. [pending] Analyze src/components/rewards/modal-celebrations/framer/ModalCelebrationsConfettiRain.css
5. [pending] Analyze src/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiRain.tsx
6. [pending] Analyze src/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiRain.meta.ts
7. [pending] Analyze src/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiRain.css
8. [pending] Analyze src/components/rewards/modal-celebrations/index.ts (confetti-rain entries)
9. [pending] Analyze src/components/rewards/modal-celebrations/shared.css
10. [pending] Analyze src/__tests__/modal-celebrations.data-animation-id.test.tsx (confetti-rain coverage)
11. [pending] Trace framer confetti-rain render flow
12. [pending] Trace css confetti-rain render flow
13. [pending] Evaluate modal-celebrations__confetti-rain against intended behavior

Checkpoint completed (confetti-burst):
- Fixed selector leakage by scoping confetti-burst selectors in BOTH style files.
- Added regression test file: `src/__tests__/modal-celebrations.confetti-burst.test.tsx`.
- Verification passed:
  - `npm test -- src/__tests__/modal-celebrations.confetti-burst.test.tsx src/__tests__/modal-celebrations.data-animation-id.test.tsx`
  - `npx eslint src/__tests__/modal-celebrations.confetti-burst.test.tsx`
  - `npm run type-check`

## Issues Found
- None yet for confetti-rain target.

## Issues Fixed
- [closed] Selector leakage for confetti-burst.
  - Root cause: unscoped `.pf-celebration*` selectors in confetti-burst style files collided with other group styles imported together.
  - Fix: scoped root/layer/confetti selectors to `[data-animation-id='modal-celebrations__confetti-burst']` in:
    - `src/components/rewards/modal-celebrations/framer/ModalCelebrationsConfettiBurst.css`
    - `src/components/rewards/modal-celebrations/css/ModalCelebrationsConfettiBurst.css`
  - Added tests for DOM structure parity and selector scoping:
    - `src/__tests__/modal-celebrations.confetti-burst.test.tsx`

## Deferred for Developer
- None
