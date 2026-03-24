import {
  buildGroupFromExports,
  registerLazyCategory,
  registerLazyGroup,
} from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

// ============================================================================
// Group Metadata (lightweight, eager-loaded for navigation)
// ============================================================================

const collectionEffectsMeta: GroupMetadata = {
  id: 'collection-effects',
  title: 'Collection Effects',
  demo: 'collectionEffects',
}

const iconAnimationsMeta: GroupMetadata = {
  id: 'icon-animations',
  title: 'Icon Animations',
  demo: 'iconAnimations',
}

const lightsMeta: GroupMetadata = {
  id: 'lights',
  title: 'Lights',
  demo: 'lights',
}

const modalCelebrationsMeta: GroupMetadata = {
  id: 'modal-celebrations',
  title: 'Modal Celebrations',
  demo: 'modalCelebrations',
}

const prizeRevealMeta: GroupMetadata = {
  id: 'prize-reveal',
  title: 'Prize Reveal',
  demo: 'prizeReveal',
}

// ============================================================================
// Lazy Loaders (heavy code split into separate chunks)
// ============================================================================

// Collection Effects
registerLazyGroup('collection-effects-framer', async () => {
  const { groupExport } = await import('./collection-effects')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'rewards')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('collection-effects-css', async () => {
  const { groupExport } = await import('./collection-effects')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'rewards')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Icon Animations
registerLazyGroup('icon-animations-framer', async () => {
  const { groupExport } = await import('./icon-animations')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'rewards')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('icon-animations-css', async () => {
  const { groupExport } = await import('./icon-animations')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'rewards')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Lights
registerLazyGroup('lights-framer', async () => {
  const { groupExport } = await import('./lights')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'rewards')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('lights-css', async () => {
  const { groupExport } = await import('./lights')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'rewards')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Modal Celebrations
registerLazyGroup('modal-celebrations-framer', async () => {
  const { groupExport } = await import('./modal-celebrations')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'rewards')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('modal-celebrations-css', async () => {
  const { groupExport } = await import('./modal-celebrations')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'rewards')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Prize Reveal
registerLazyGroup('prize-reveal-framer', async () => {
  const { groupExport } = await import('./prize-reveal')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'rewards')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('prize-reveal-css', async () => {
  const { groupExport } = await import('./prize-reveal')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'rewards')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// ============================================================================
// Navigation Registration
// ============================================================================

registerLazyCategory('rewards', 'Game Elements & Rewards', [
  { id: 'collection-effects-framer', title: 'Collection Effects (Framer)', tech: 'framer', baseGroupId: 'collection-effects', animationIds: [], metadata: collectionEffectsMeta },
  { id: 'collection-effects-css', title: 'Collection Effects (CSS)', tech: 'css', baseGroupId: 'collection-effects', animationIds: [], metadata: collectionEffectsMeta },
  { id: 'icon-animations-framer', title: 'Icon Animations (Framer)', tech: 'framer', baseGroupId: 'icon-animations', animationIds: [], metadata: iconAnimationsMeta },
  { id: 'icon-animations-css', title: 'Icon Animations (CSS)', tech: 'css', baseGroupId: 'icon-animations', animationIds: [], metadata: iconAnimationsMeta },
  { id: 'lights-framer', title: 'Lights (Framer)', tech: 'framer', baseGroupId: 'lights', animationIds: [], metadata: lightsMeta },
  { id: 'lights-css', title: 'Lights (CSS)', tech: 'css', baseGroupId: 'lights', animationIds: [], metadata: lightsMeta },
  { id: 'modal-celebrations-framer', title: 'Modal Celebrations (Framer)', tech: 'framer', baseGroupId: 'modal-celebrations', animationIds: [], metadata: modalCelebrationsMeta },
  { id: 'modal-celebrations-css', title: 'Modal Celebrations (CSS)', tech: 'css', baseGroupId: 'modal-celebrations', animationIds: [], metadata: modalCelebrationsMeta },
  { id: 'prize-reveal-framer', title: 'Prize Reveal (Framer)', tech: 'framer', baseGroupId: 'prize-reveal', animationIds: [], metadata: prizeRevealMeta },
  { id: 'prize-reveal-css', title: 'Prize Reveal (CSS)', tech: 'css', baseGroupId: 'prize-reveal', animationIds: [], metadata: prizeRevealMeta },
])

// ============================================================================
// Legacy Compatibility Export (empty - for any code that imports categoryExport)
// ============================================================================

import type { CategoryExport, CategoryMetadata } from '@/types/animation'

export const categoryMetadata: CategoryMetadata = {
  id: 'rewards',
  title: 'Game Elements & Rewards',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {},
}
