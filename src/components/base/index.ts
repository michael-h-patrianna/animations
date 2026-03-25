import { declareCategoryGroups } from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

const textEffectsMeta: GroupMetadata = {
  id: 'text-effects',
  title: 'Text effects',
  demo: 'textEffects',
}

const standardEffectsMeta: GroupMetadata = {
  id: 'standard-effects',
  title: 'Standard effects',
  demo: 'standardEffects',
}

const buttonEffectsMeta: GroupMetadata = {
  id: 'button-effects',
  title: 'Button effects',
  demo: 'buttonEffects',
}

declareCategoryGroups('base', 'Base Effects', [
  { metadata: textEffectsMeta, load: () => import('./text-effects') },
  { metadata: standardEffectsMeta, load: () => import('./standard-effects') },
  { metadata: buttonEffectsMeta, load: () => import('./button-effects') },
])
