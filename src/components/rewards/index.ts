import { declareCategoryGroups } from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

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
  title: 'Celebration effects',
  demo: 'modalCelebrations',
}

const prizeRevealMeta: GroupMetadata = {
  id: 'prize-reveal',
  title: 'Prize Reveal',
  demo: 'prizeReveal',
}

declareCategoryGroups('rewards', 'Game Elements & Rewards', [
  { metadata: collectionEffectsMeta, load: () => import('./collection-effects') },
  { metadata: iconAnimationsMeta, load: () => import('./icon-animations') },
  { metadata: lightsMeta, load: () => import('./lights') },
  { metadata: modalCelebrationsMeta, load: () => import('./modal-celebrations') },
  { metadata: prizeRevealMeta, load: () => import('./prize-reveal') },
])
