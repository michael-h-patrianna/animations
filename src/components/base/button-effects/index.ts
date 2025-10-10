import type { GroupExport, GroupMetadata } from '@/types/animation'

import { ButtonEffectsRipple, metadata as rippleMeta } from './framer/ButtonEffectsRipple'
import { ButtonEffectsJitter, metadata as jitterMeta } from './framer/ButtonEffectsJitter'
import { ButtonEffectsLiquidMorph, metadata as liquidMorphMeta } from './framer/ButtonEffectsLiquidMorph'
import { ButtonEffectsShockwave, metadata as shockwaveMeta } from './framer/ButtonEffectsShockwave'
import { ButtonEffectsSplitReveal, metadata as splitRevealMeta } from './framer/ButtonEffectsSplitReveal'

export const groupMetadata: GroupMetadata = {
  id: 'button-effects',
  title: 'Button effects',
  tech: 'css',
  demo: 'button',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'button-effects__ripple': { component: ButtonEffectsRipple, metadata: rippleMeta },
    'button-effects__jitter': { component: ButtonEffectsJitter, metadata: jitterMeta },
    'button-effects__liquid-morph': { component: ButtonEffectsLiquidMorph, metadata: liquidMorphMeta },
    'button-effects__shockwave': { component: ButtonEffectsShockwave, metadata: shockwaveMeta },
    'button-effects__split-reveal': { component: ButtonEffectsSplitReveal, metadata: splitRevealMeta },
  },
  css: {},
}
