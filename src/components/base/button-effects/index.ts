import type { GroupExport, GroupMetadata } from '@/types/animation'

import { ButtonEffectsRipple, metadata as rippleMeta } from './ButtonEffectsRipple'
import { ButtonEffectsJitter, metadata as jitterMeta } from './ButtonEffectsJitter'
import { ButtonEffectsLiquidMorph, metadata as liquidMorphMeta } from './ButtonEffectsLiquidMorph'
import { ButtonEffectsShockwave, metadata as shockwaveMeta } from './ButtonEffectsShockwave'
import { ButtonEffectsSplitReveal, metadata as splitRevealMeta } from './ButtonEffectsSplitReveal'

export const groupMetadata: GroupMetadata = {
  id: 'button-effects',
  title: 'Button effects',
  tech: 'css',
  demo: 'button',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
    'button-effects__ripple': { component: ButtonEffectsRipple, metadata: rippleMeta },
    'button-effects__jitter': { component: ButtonEffectsJitter, metadata: jitterMeta },
    'button-effects__liquid-morph': { component: ButtonEffectsLiquidMorph, metadata: liquidMorphMeta },
    'button-effects__shockwave': { component: ButtonEffectsShockwave, metadata: shockwaveMeta },
    'button-effects__split-reveal': { component: ButtonEffectsSplitReveal, metadata: splitRevealMeta },
  },
}
