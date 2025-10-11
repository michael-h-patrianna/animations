import type { GroupExport, GroupMetadata } from '@/types/animation'

import { StandardEffectsBlink, metadata as blinkMeta } from './framer/StandardEffectsBlink'
import { StandardEffectsBounce, metadata as bounceMeta } from './framer/StandardEffectsBounce'
import { StandardEffectsFade, metadata as fadeMeta } from './framer/StandardEffectsFade'
import { StandardEffectsFlip, metadata as flipMeta } from './framer/StandardEffectsFlip'
import { StandardEffectsFloat, metadata as floatMeta } from './framer/StandardEffectsFloat'
import { StandardEffectsHeartbeat, metadata as heartbeatMeta } from './framer/StandardEffectsHeartbeat'
import { StandardEffectsJello, metadata as jelloMeta } from './framer/StandardEffectsJello'
import { StandardEffectsPop, metadata as popMeta } from './framer/StandardEffectsPop'
import { StandardEffectsPulse, metadata as pulseMeta } from './framer/StandardEffectsPulse'
import { StandardEffectsPulseCircle, metadata as pulseCircleMeta } from './framer/StandardEffectsPulseCircle'
import { StandardEffectsPulseWave, metadata as pulseWaveMeta } from './framer/StandardEffectsPulseWave'
import { StandardEffectsRadialPulse, metadata as radialPulseMeta } from './framer/StandardEffectsRadialPulse'
import { StandardEffectsRubberBand, metadata as rubberBandMeta } from './framer/StandardEffectsRubberBand'
import { StandardEffectsScale, metadata as scaleMeta } from './framer/StandardEffectsScale'
import { StandardEffectsShake, metadata as shakeMeta } from './framer/StandardEffectsShake'
import { StandardEffectsSlide, metadata as slideMeta } from './framer/StandardEffectsSlide'
import { StandardEffectsSoftPulse, metadata as softPulseMeta } from './framer/StandardEffectsSoftPulse'
import { StandardEffectsSpin, metadata as spinMeta } from './framer/StandardEffectsSpin'
import { StandardEffectsSqueeze, metadata as squeezeMeta } from './framer/StandardEffectsSqueeze'
import { StandardEffectsSwing, metadata as swingMeta } from './framer/StandardEffectsSwing'
import { StandardEffectsTada, metadata as tadaMeta } from './framer/StandardEffectsTada'
import { StandardEffectsWiggle, metadata as wiggleMeta } from './framer/StandardEffectsWiggle'

// CSS animations
import { StandardEffectsFlip as CssStandardEffectsFlip, metadata as flipCssMeta } from './css/StandardEffectsFlip'
import { StandardEffectsPop as CssStandardEffectsPop, metadata as popCssMeta } from './css/StandardEffectsPop'
import { StandardEffectsPulse as CssStandardEffectsPulse, metadata as pulseCssMeta } from './css/StandardEffectsPulse'
import { StandardEffectsPulseCircle as CssStandardEffectsPulseCircle, metadata as pulseCircleCssMeta } from './css/StandardEffectsPulseCircle'
import { StandardEffectsPulseWave as CssStandardEffectsPulseWave, metadata as pulseWaveCssMeta } from './css/StandardEffectsPulseWave'
import { StandardEffectsRadialPulse as CssStandardEffectsRadialPulse, metadata as radialPulseCssMeta } from './css/StandardEffectsRadialPulse'
import { StandardEffectsSoftPulse as CssStandardEffectsSoftPulse, metadata as softPulseCssMeta } from './css/StandardEffectsSoftPulse'

export const groupMetadata: GroupMetadata = {
  id: 'standard-effects',
  title: 'Standard effects',
  tech: 'framer',
  demo: 'standardEffects',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'standard-effects__shake': { component: StandardEffectsShake, metadata: shakeMeta },
    'standard-effects__bounce': { component: StandardEffectsBounce, metadata: bounceMeta },
    'standard-effects__pulse': { component: StandardEffectsPulse, metadata: pulseMeta },
    'standard-effects__radial-pulse': { component: StandardEffectsRadialPulse, metadata: radialPulseMeta },
    'standard-effects__pulse-wave': { component: StandardEffectsPulseWave, metadata: pulseWaveMeta },
    'standard-effects__rubber-band': { component: StandardEffectsRubberBand, metadata: rubberBandMeta },
    'standard-effects__swing': { component: StandardEffectsSwing, metadata: swingMeta },
    'standard-effects__jello': { component: StandardEffectsJello, metadata: jelloMeta },
    'standard-effects__pop': { component: StandardEffectsPop, metadata: popMeta },
    'standard-effects__wiggle': { component: StandardEffectsWiggle, metadata: wiggleMeta },
    'standard-effects__flip': { component: StandardEffectsFlip, metadata: flipMeta },
    'standard-effects__spin': { component: StandardEffectsSpin, metadata: spinMeta },
    'standard-effects__float': { component: StandardEffectsFloat, metadata: floatMeta },
    'standard-effects__fade': { component: StandardEffectsFade, metadata: fadeMeta },
    'standard-effects__slide': { component: StandardEffectsSlide, metadata: slideMeta },
    'standard-effects__scale': { component: StandardEffectsScale, metadata: scaleMeta },
    'standard-effects__blink': { component: StandardEffectsBlink, metadata: blinkMeta },
    'standard-effects__squeeze': { component: StandardEffectsSqueeze, metadata: squeezeMeta },
    'standard-effects__tada': { component: StandardEffectsTada, metadata: tadaMeta },
    'standard-effects__heartbeat': { component: StandardEffectsHeartbeat, metadata: heartbeatMeta },
    'standard-effects__pulse-circle': { component: StandardEffectsPulseCircle, metadata: pulseCircleMeta },
    'standard-effects__soft-pulse': { component: StandardEffectsSoftPulse, metadata: softPulseMeta },
  },
  css: {
    'standard-effects__flip': { component: CssStandardEffectsFlip, metadata: flipCssMeta },
    'standard-effects__pop': { component: CssStandardEffectsPop, metadata: popCssMeta },
    'standard-effects__pulse': { component: CssStandardEffectsPulse, metadata: pulseCssMeta },
    'standard-effects__pulse-circle': { component: CssStandardEffectsPulseCircle, metadata: pulseCircleCssMeta },
    'standard-effects__pulse-wave': { component: CssStandardEffectsPulseWave, metadata: pulseWaveCssMeta },
    'standard-effects__radial-pulse': { component: CssStandardEffectsRadialPulse, metadata: radialPulseCssMeta },
    'standard-effects__soft-pulse': { component: CssStandardEffectsSoftPulse, metadata: softPulseCssMeta },
  },
}
