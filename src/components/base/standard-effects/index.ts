import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as blinkMeta } from './framer/StandardEffectsBlink.meta'
import { metadata as bounceMeta } from './framer/StandardEffectsBounce.meta'
import { metadata as fadeMeta } from './framer/StandardEffectsFade.meta'
import { metadata as flipMeta } from './framer/StandardEffectsFlip.meta'
import { metadata as floatMeta } from './framer/StandardEffectsFloat.meta'
import { metadata as heartbeatMeta } from './framer/StandardEffectsHeartbeat.meta'
import { metadata as jelloMeta } from './framer/StandardEffectsJello.meta'
import { metadata as popMeta } from './framer/StandardEffectsPop.meta'
import { metadata as pulseMeta } from './framer/StandardEffectsPulse.meta'
import { metadata as pulseCircleMeta } from './framer/StandardEffectsPulseCircle.meta'
import { metadata as pulseWaveMeta } from './framer/StandardEffectsPulseWave.meta'
import { metadata as radialPulseMeta } from './framer/StandardEffectsRadialPulse.meta'
import { metadata as rubberBandMeta } from './framer/StandardEffectsRubberBand.meta'
import { metadata as scaleMeta } from './framer/StandardEffectsScale.meta'
import { metadata as shakeMeta } from './framer/StandardEffectsShake.meta'
import { metadata as slideMeta } from './framer/StandardEffectsSlide.meta'
import { metadata as softPulseMeta } from './framer/StandardEffectsSoftPulse.meta'
import { metadata as spinMeta } from './framer/StandardEffectsSpin.meta'
import { metadata as squeezeMeta } from './framer/StandardEffectsSqueeze.meta'
import { metadata as swingMeta } from './framer/StandardEffectsSwing.meta'
import { metadata as tadaMeta } from './framer/StandardEffectsTada.meta'
import { metadata as wiggleMeta } from './framer/StandardEffectsWiggle.meta'

// CSS - Import metadata only
import { metadata as blinkCssMeta } from './css/StandardEffectsBlink.meta'
import { metadata as bounceCssMeta } from './css/StandardEffectsBounce.meta'
import { metadata as fadeCssMeta } from './css/StandardEffectsFade.meta'
import { metadata as flipCssMeta } from './css/StandardEffectsFlip.meta'
import { metadata as heartbeatCssMeta } from './css/StandardEffectsHeartbeat.meta'
import { metadata as jelloCssMeta } from './css/StandardEffectsJello.meta'
import { metadata as popCssMeta } from './css/StandardEffectsPop.meta'
import { metadata as pulseCssMeta } from './css/StandardEffectsPulse.meta'
import { metadata as pulseCircleCssMeta } from './css/StandardEffectsPulseCircle.meta'
import { metadata as pulseWaveCssMeta } from './css/StandardEffectsPulseWave.meta'
import { metadata as radialPulseCssMeta } from './css/StandardEffectsRadialPulse.meta'
import { metadata as rubberBandCssMeta } from './css/StandardEffectsRubberBand.meta'
import { metadata as shakeCssMeta } from './css/StandardEffectsShake.meta'
import { metadata as softPulseCssMeta } from './css/StandardEffectsSoftPulse.meta'
import { metadata as swingCssMeta } from './css/StandardEffectsSwing.meta'
import { metadata as spinCssMeta } from './css/StandardEffectsSpin.meta'
import { metadata as squeezeCssMeta } from './css/StandardEffectsSqueeze.meta'
import { metadata as scaleCssMeta } from './css/StandardEffectsScale.meta'
import { metadata as slideCssMeta } from './css/StandardEffectsSlide.meta'
import { metadata as wiggleCssMeta } from './css/StandardEffectsWiggle.meta'
import { metadata as tadaCssMeta } from './css/StandardEffectsTada.meta'

// Framer Motion - Lazy load components
const StandardEffectsBlink = lazy(() => import('./framer/StandardEffectsBlink').then(m => ({ default: m.StandardEffectsBlink })))
const StandardEffectsBounce = lazy(() => import('./framer/StandardEffectsBounce').then(m => ({ default: m.StandardEffectsBounce })))
const StandardEffectsFade = lazy(() => import('./framer/StandardEffectsFade').then(m => ({ default: m.StandardEffectsFade })))
const StandardEffectsFlip = lazy(() => import('./framer/StandardEffectsFlip').then(m => ({ default: m.StandardEffectsFlip })))
const StandardEffectsFloat = lazy(() => import('./framer/StandardEffectsFloat').then(m => ({ default: m.StandardEffectsFloat })))
const StandardEffectsHeartbeat = lazy(() => import('./framer/StandardEffectsHeartbeat').then(m => ({ default: m.StandardEffectsHeartbeat })))
const StandardEffectsJello = lazy(() => import('./framer/StandardEffectsJello').then(m => ({ default: m.StandardEffectsJello })))
const StandardEffectsPop = lazy(() => import('./framer/StandardEffectsPop').then(m => ({ default: m.StandardEffectsPop })))
const StandardEffectsPulse = lazy(() => import('./framer/StandardEffectsPulse').then(m => ({ default: m.StandardEffectsPulse })))
const StandardEffectsPulseCircle = lazy(() => import('./framer/StandardEffectsPulseCircle').then(m => ({ default: m.StandardEffectsPulseCircle })))
const StandardEffectsPulseWave = lazy(() => import('./framer/StandardEffectsPulseWave').then(m => ({ default: m.StandardEffectsPulseWave })))
const StandardEffectsRadialPulse = lazy(() => import('./framer/StandardEffectsRadialPulse').then(m => ({ default: m.StandardEffectsRadialPulse })))
const StandardEffectsRubberBand = lazy(() => import('./framer/StandardEffectsRubberBand').then(m => ({ default: m.StandardEffectsRubberBand })))
const StandardEffectsScale = lazy(() => import('./framer/StandardEffectsScale').then(m => ({ default: m.StandardEffectsScale })))
const StandardEffectsShake = lazy(() => import('./framer/StandardEffectsShake').then(m => ({ default: m.StandardEffectsShake })))
const StandardEffectsSlide = lazy(() => import('./framer/StandardEffectsSlide').then(m => ({ default: m.StandardEffectsSlide })))
const StandardEffectsSoftPulse = lazy(() => import('./framer/StandardEffectsSoftPulse').then(m => ({ default: m.StandardEffectsSoftPulse })))
const StandardEffectsSpin = lazy(() => import('./framer/StandardEffectsSpin').then(m => ({ default: m.StandardEffectsSpin })))
const StandardEffectsSqueeze = lazy(() => import('./framer/StandardEffectsSqueeze').then(m => ({ default: m.StandardEffectsSqueeze })))
const StandardEffectsSwing = lazy(() => import('./framer/StandardEffectsSwing').then(m => ({ default: m.StandardEffectsSwing })))
const StandardEffectsTada = lazy(() => import('./framer/StandardEffectsTada').then(m => ({ default: m.StandardEffectsTada })))
const StandardEffectsWiggle = lazy(() => import('./framer/StandardEffectsWiggle').then(m => ({ default: m.StandardEffectsWiggle })))

// CSS - Lazy load components
const CssStandardEffectsBlink = lazy(() => import('./css/StandardEffectsBlink').then(m => ({ default: m.StandardEffectsBlink })))
const CssStandardEffectsBounce = lazy(() => import('./css/StandardEffectsBounce').then(m => ({ default: m.StandardEffectsBounce })))
const CssStandardEffectsFade = lazy(() => import('./css/StandardEffectsFade').then(m => ({ default: m.StandardEffectsFade })))
const CssStandardEffectsFlip = lazy(() => import('./css/StandardEffectsFlip').then(m => ({ default: m.StandardEffectsFlip })))
const CssStandardEffectsHeartbeat = lazy(() => import('./css/StandardEffectsHeartbeat').then(m => ({ default: m.StandardEffectsHeartbeat })))
const CssStandardEffectsJello = lazy(() => import('./css/StandardEffectsJello').then(m => ({ default: m.StandardEffectsJello })))
const CssStandardEffectsPop = lazy(() => import('./css/StandardEffectsPop').then(m => ({ default: m.StandardEffectsPop })))
const CssStandardEffectsPulse = lazy(() => import('./css/StandardEffectsPulse').then(m => ({ default: m.StandardEffectsPulse })))
const CssStandardEffectsPulseCircle = lazy(() => import('./css/StandardEffectsPulseCircle').then(m => ({ default: m.StandardEffectsPulseCircle })))
const CssStandardEffectsPulseWave = lazy(() => import('./css/StandardEffectsPulseWave').then(m => ({ default: m.StandardEffectsPulseWave })))
const CssStandardEffectsRadialPulse = lazy(() => import('./css/StandardEffectsRadialPulse').then(m => ({ default: m.StandardEffectsRadialPulse })))
const CssStandardEffectsRubberBand = lazy(() => import('./css/StandardEffectsRubberBand').then(m => ({ default: m.StandardEffectsRubberBand })))
const CssStandardEffectsShake = lazy(() => import('./css/StandardEffectsShake').then(m => ({ default: m.StandardEffectsShake })))
const CssStandardEffectsSoftPulse = lazy(() => import('./css/StandardEffectsSoftPulse').then(m => ({ default: m.StandardEffectsSoftPulse })))
const CssStandardEffectsSwing = lazy(() => import('./css/StandardEffectsSwing').then(m => ({ default: m.StandardEffectsSwing })))
const CssStandardEffectsSpin = lazy(() => import('./css/StandardEffectsSpin').then(m => ({ default: m.StandardEffectsSpin })))
const CssStandardEffectsSqueeze = lazy(() => import('./css/StandardEffectsSqueeze').then(m => ({ default: m.StandardEffectsSqueeze })))
const CssStandardEffectsScale = lazy(() => import('./css/StandardEffectsScale').then(m => ({ default: m.StandardEffectsScale })))
const CssStandardEffectsSlide = lazy(() => import('./css/StandardEffectsSlide').then(m => ({ default: m.StandardEffectsSlide })))
const CssStandardEffectsWiggle = lazy(() => import('./css/StandardEffectsWiggle').then(m => ({ default: m.StandardEffectsWiggle })))
const CssStandardEffectsTada = lazy(() => import('./css/StandardEffectsTada').then(m => ({ default: m.StandardEffectsTada })))

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
    'standard-effects__blink': { component: CssStandardEffectsBlink, metadata: blinkCssMeta },
    'standard-effects__bounce': { component: CssStandardEffectsBounce, metadata: bounceCssMeta },
    'standard-effects__fade': { component: CssStandardEffectsFade, metadata: fadeCssMeta },
    'standard-effects__flip': { component: CssStandardEffectsFlip, metadata: flipCssMeta },
    'standard-effects__heartbeat': { component: CssStandardEffectsHeartbeat, metadata: heartbeatCssMeta },
    'standard-effects__jello': { component: CssStandardEffectsJello, metadata: jelloCssMeta },
    'standard-effects__pop': { component: CssStandardEffectsPop, metadata: popCssMeta },
    'standard-effects__pulse': { component: CssStandardEffectsPulse, metadata: pulseCssMeta },
    'standard-effects__pulse-circle': { component: CssStandardEffectsPulseCircle, metadata: pulseCircleCssMeta },
    'standard-effects__pulse-wave': { component: CssStandardEffectsPulseWave, metadata: pulseWaveCssMeta },
    'standard-effects__radial-pulse': { component: CssStandardEffectsRadialPulse, metadata: radialPulseCssMeta },
    'standard-effects__rubber-band': { component: CssStandardEffectsRubberBand, metadata: rubberBandCssMeta },
    'standard-effects__shake': { component: CssStandardEffectsShake, metadata: shakeCssMeta },
    'standard-effects__soft-pulse': { component: CssStandardEffectsSoftPulse, metadata: softPulseCssMeta },
    'standard-effects__swing': { component: CssStandardEffectsSwing, metadata: swingCssMeta },
    'standard-effects__spin': { component: CssStandardEffectsSpin, metadata: spinCssMeta },
    'standard-effects__squeeze': { component: CssStandardEffectsSqueeze, metadata: squeezeCssMeta },
    'standard-effects__scale': { component: CssStandardEffectsScale, metadata: scaleCssMeta },
    'standard-effects__slide': { component: CssStandardEffectsSlide, metadata: slideCssMeta },
    'standard-effects__wiggle': { component: CssStandardEffectsWiggle, metadata: wiggleCssMeta },
    'standard-effects__tada': { component: CssStandardEffectsTada, metadata: tadaCssMeta },
  },
}
