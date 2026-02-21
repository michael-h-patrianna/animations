# useAnimations StrictMode loading bug (2026-02-21)
- Symptom: App stuck on "Loading animations..." and sidebar appears empty.
- Root cause: `useAnimations` used `isMountedRef` but effect cleanup set it `false` without resetting on setup. Under React StrictMode's mount effect replay, ref stayed false, so async completion path returned early and never set `isLoading=false`.
- Fix: in `src/hooks/useAnimations.ts`, set `isMountedRef.current = true` at effect setup and `false` on cleanup.
- Regression protection: `src/__tests__/hooks.useAnimations.test.tsx` now renders hook in a StrictMode wrapper (`StrictCodeModeWrapper`) so loading transition is validated in the same lifecycle mode as app runtime.