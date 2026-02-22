Moved Coin Trail and Coin Fountain registry entries from modal-celebrations group to collection-effects group.

Files changed:
- src/components/rewards/collection-effects/index.ts
  - Added metadata imports and lazy component imports for ModalCelebrationsCoinTrail / ModalCelebrationsCoinsFountain (framer+css).
  - Added groupExport entries for ids modal-celebrations__coin-trail and modal-celebrations__coins-fountain in both framer and css maps.
  - Added import of ../modal-celebrations/framer/ModalCelebrationsCoinsFountain.css so pf-celebration styles remain available in collection-effects group.
- src/components/rewards/modal-celebrations/index.ts
  - Removed coin-trail and coins-fountain metadata imports, lazy loads, and groupExport entries (framer+css).
  - Removed group-level framer css import for ModalCelebrationsCoinsFountain.css from modal-celebrations index.

Verification:
- npm test -- src/__tests__/registryConsistency.test.ts (pass)
- npm run build (pass)

Note: jackpot celebration files are deleted in current working tree; do not reintroduce jackpot imports in modal-celebrations index unless those files are restored.