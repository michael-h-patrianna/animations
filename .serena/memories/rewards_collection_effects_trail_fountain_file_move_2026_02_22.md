Performed full folder/subfolder consistency fix for Collection Effects coin animations.

What was wrong:
- Coin Trail and Coin Fountain were registered under collection-effects but their implementation files/metadata still lived in modal-celebrations, and registry keys used modal-celebrations__ prefix.

Fixes:
- Moved both animations (framer+css component/meta/style files) from:
  - src/components/rewards/modal-celebrations/{framer,css}/ModalCelebrationsCoinTrail*
  - src/components/rewards/modal-celebrations/{framer,css}/ModalCelebrationsCoinsFountain*
  to:
  - src/components/rewards/collection-effects/{framer,css}/CollectionEffectsCoinTrail*
  - src/components/rewards/collection-effects/{framer,css}/CollectionEffectsCoinsFountain*
- Updated export names and data-animation-id to collection-effects__coin-trail and collection-effects__coins-fountain.
- Updated metadata ids/descriptions to collection-effects prefix.
- Updated collection-effects/index.ts to import local files and register new IDs in framer+css maps.
- Removed trail/fountain cases from modal-celebrations data-animation-id test.
- Added collection-effects data-animation-id test for all 4 collection effects animations.

Verification:
- Structural audits pass:
  - all metadata IDs match their group folder names
  - all group registry keys align with groupMetadata.id
  - no cross-group ../ imports in src/components/*/*/index.ts
- Tests pass:
  - collection-effects.data-animation-id
  - modal-celebrations.data-animation-id
  - registryConsistency
- build still fails on pre-existing unrelated App.tsx type errors (navigateToGroup/codeMode).