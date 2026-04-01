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

const celebrationEffectsMeta: GroupMetadata = {
  id: 'celebration-effects',
  title: 'Celebration effects',
  demo: 'celebrationEffects',
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
  { metadata: celebrationEffectsMeta, load: () => import('./celebration-effects') },
  { metadata: prizeRevealMeta, load: () => import('./prize-reveal') },
])
