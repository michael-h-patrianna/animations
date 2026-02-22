Removed animation id `modal-celebrations__jackpot-celebration` from the modal-celebrations group.

Changes made:
- Removed framer/css registry entries and lazy imports in `src/components/rewards/modal-celebrations/index.ts`.
- Removed explicit jackpot imports and test cases in `src/__tests__/modal-celebrations.data-animation-id.test.tsx`.
- Deleted implementation files:
  - `src/components/rewards/modal-celebrations/framer/ModalCelebrationsJackpotCelebration.tsx`
  - `src/components/rewards/modal-celebrations/framer/ModalCelebrationsJackpotCelebration.meta.ts`
  - `src/components/rewards/modal-celebrations/css/ModalCelebrationsJackpotCelebration.tsx`
  - `src/components/rewards/modal-celebrations/css/ModalCelebrationsJackpotCelebration.meta.ts`
  - `src/components/rewards/modal-celebrations/css/ModalCelebrationsJackpotCelebration.css`

Verification:
- `rg -n "JackpotCelebration|modal-celebrations__jackpot-celebration" src tests` returned no matches.
- `npm test -- modal-celebrations.data-animation-id.test.tsx` passed.
- `npm run type-check` passed.
- `npx eslint src/components/rewards/modal-celebrations/index.ts src/__tests__/modal-celebrations.data-animation-id.test.tsx` passed.