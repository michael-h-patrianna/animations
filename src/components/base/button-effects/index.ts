// Framer variant CSS (loaded at group level for no-css-in-motion compliance)
import './shared.css'
import './framer/ButtonEffectsJitter.css'
import './framer/ButtonEffectsLiquidMorph.css'
import './framer/ButtonEffectsRewardReadyPulse.css'
import './framer/ButtonEffectsRipple.css'
import './framer/ButtonEffectsShockwave.css'
import './framer/ButtonEffectsSplitReveal.css'
import './framer/ButtonFeedbackShakeGentle.css'

import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Import metadata only (not components) to avoid loading CSS
import { metadata as jitterMeta } from './framer/ButtonEffectsJitter.meta'
import { metadata as liquidMorphMeta } from './framer/ButtonEffectsLiquidMorph.meta'
import { metadata as pressSquashMeta } from './framer/ButtonEffectsPressSquash.meta'
import { metadata as rewardReadyPulseMeta } from './framer/ButtonEffectsRewardReadyPulse.meta'
import { metadata as rippleMeta } from './framer/ButtonEffectsRipple.meta'
import { metadata as shockwaveMeta } from './framer/ButtonEffectsShockwave.meta'
import { metadata as splitRevealMeta } from './framer/ButtonEffectsSplitReveal.meta'
import { metadata as shakeGentleMetadata } from './framer/ButtonFeedbackShakeGentle.meta'

// Import CSS metadata only
import { metadata as jitterCssMeta } from './css/ButtonEffectsJitter.meta'
import { metadata as liquidMorphCssMeta } from './css/ButtonEffectsLiquidMorph.meta'
import { metadata as pressSquashCssMeta } from './css/ButtonEffectsPressSquash.meta'
import { metadata as rewardReadyPulseCssMeta } from './css/ButtonEffectsRewardReadyPulse.meta'
import { metadata as rippleCssMeta } from './css/ButtonEffectsRipple.meta'
import { metadata as shockwaveCssMeta } from './css/ButtonEffectsShockwave.meta'
import { metadata as splitRevealCssMeta } from './css/ButtonEffectsSplitReveal.meta'
import { metadata as shakeGentleCssMetadata } from './css/ButtonFeedbackShakeGentle.meta'

// Lazy load components
const ButtonEffectsRipple = lazy(() =>
  import('./framer/ButtonEffectsRipple').then((m) => ({ default: m.ButtonEffectsRipple }))
)
const ButtonEffectsJitter = lazy(() =>
  import('./framer/ButtonEffectsJitter').then((m) => ({ default: m.ButtonEffectsJitter }))
)
const ButtonEffectsLiquidMorph = lazy(() =>
  import('./framer/ButtonEffectsLiquidMorph').then((m) => ({ default: m.ButtonEffectsLiquidMorph }))
)
const ButtonEffectsShockwave = lazy(() =>
  import('./framer/ButtonEffectsShockwave').then((m) => ({ default: m.ButtonEffectsShockwave }))
)
const ButtonEffectsSplitReveal = lazy(() =>
  import('./framer/ButtonEffectsSplitReveal').then((m) => ({ default: m.ButtonEffectsSplitReveal }))
)
const ButtonEffectsRewardReadyPulse = lazy(() =>
  import('./framer/ButtonEffectsRewardReadyPulse').then((m) => ({
    default: m.ButtonEffectsRewardReadyPulse,
  }))
)
const ButtonFeedbackShakeGentle = lazy(() =>
  import('./framer/ButtonFeedbackShakeGentle').then((m) => ({
    default: m.ButtonFeedbackShakeGentle,
  }))
)
const ButtonEffectsPressSquash = lazy(() =>
  import('./framer/ButtonEffectsPressSquash').then((m) => ({
    default: m.ButtonEffectsPressSquash,
  }))
)
// Lazy load CSS components
const CssButtonEffectsRipple = lazy(() =>
  import('./css/ButtonEffectsRipple').then((m) => ({ default: m.ButtonEffectsRipple }))
)
const CssButtonEffectsJitter = lazy(() =>
  import('./css/ButtonEffectsJitter').then((m) => ({ default: m.ButtonEffectsJitter }))
)
const CssButtonEffectsLiquidMorph = lazy(() =>
  import('./css/ButtonEffectsLiquidMorph').then((m) => ({ default: m.ButtonEffectsLiquidMorph }))
)
const CssButtonEffectsShockwave = lazy(() =>
  import('./css/ButtonEffectsShockwave').then((m) => ({ default: m.ButtonEffectsShockwave }))
)
const CssButtonEffectsSplitReveal = lazy(() =>
  import('./css/ButtonEffectsSplitReveal').then((m) => ({ default: m.ButtonEffectsSplitReveal }))
)
const CssButtonEffectsRewardReadyPulse = lazy(() =>
  import('./css/ButtonEffectsRewardReadyPulse').then((m) => ({
    default: m.ButtonEffectsRewardReadyPulse,
  }))
)
const CssButtonFeedbackShakeGentle = lazy(() =>
  import('./css/ButtonFeedbackShakeGentle').then((m) => ({
    default: m.ButtonFeedbackShakeGentle,
  }))
)
const CssButtonEffectsPressSquash = lazy(() =>
  import('./css/ButtonEffectsPressSquash').then((m) => ({
    default: m.ButtonEffectsPressSquash,
  }))
)

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
    'button-effects__liquid-morph': {
      component: ButtonEffectsLiquidMorph,
      metadata: liquidMorphMeta,
    },
    'button-effects__press-squash': {
      component: ButtonEffectsPressSquash,
      metadata: pressSquashMeta,
    },
    'button-effects__shockwave': { component: ButtonEffectsShockwave, metadata: shockwaveMeta },
    'button-effects__split-reveal': {
      component: ButtonEffectsSplitReveal,
      metadata: splitRevealMeta,
    },
    'button-effects__reward-ready-pulse': {
      component: ButtonEffectsRewardReadyPulse,
      metadata: rewardReadyPulseMeta,
    },
    'bxf-feedback__shake-gentle': {
      component: ButtonFeedbackShakeGentle,
      metadata: shakeGentleMetadata,
    },
  },
  css: {
    'button-effects__ripple': { component: CssButtonEffectsRipple, metadata: rippleCssMeta },
    'button-effects__jitter': { component: CssButtonEffectsJitter, metadata: jitterCssMeta },
    'button-effects__liquid-morph': {
      component: CssButtonEffectsLiquidMorph,
      metadata: liquidMorphCssMeta,
    },
    'button-effects__press-squash': {
      component: CssButtonEffectsPressSquash,
      metadata: pressSquashCssMeta,
    },
    'button-effects__shockwave': {
      component: CssButtonEffectsShockwave,
      metadata: shockwaveCssMeta,
    },
    'button-effects__split-reveal': {
      component: CssButtonEffectsSplitReveal,
      metadata: splitRevealCssMeta,
    },
    'button-effects__reward-ready-pulse': {
      component: CssButtonEffectsRewardReadyPulse,
      metadata: rewardReadyPulseCssMeta,
    },
    'bxf-feedback__shake-gentle': {
      component: CssButtonFeedbackShakeGentle,
      metadata: shakeGentleCssMetadata,
    },
  },
}
