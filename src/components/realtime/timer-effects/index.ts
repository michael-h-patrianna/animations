import type { AnimationComponentMap } from '@/types/animation'
import { lazy } from 'react'

// Lazy-loaded variants to enable code-splitting per animation component
const TimerEffectsTimerColorShift = lazy(() =>
  import('./TimerEffectsTimerColorShift').then((m) => ({ default: m.TimerEffectsTimerColorShift }))
)
const TimerEffectsTimerFlash = lazy(() =>
  import('./TimerEffectsTimerFlash').then((m) => ({ default: m.TimerEffectsTimerFlash }))
)
const TimerEffectsTimerFlashSoft = lazy(() =>
  import('./TimerEffectsTimerFlashSoft').then((m) => ({ default: m.TimerEffectsTimerFlashSoft }))
)
const TimerEffectsTimerFlip = lazy(() =>
  import('./TimerEffectsTimerFlip').then((m) => ({ default: m.TimerEffectsTimerFlip }))
)
const TimerEffectsTimerPulse = lazy(() =>
  import('./TimerEffectsTimerPulse').then((m) => ({ default: m.TimerEffectsTimerPulse }))
)

// New pill countdown family (escalating intensity)
const TimerEffectsPillCountdownStrong = lazy(() =>
  import('./TimerEffectsPillCountdownStrong').then((m) => ({
    default: m.TimerEffectsPillCountdownStrong,
  }))
)
const TimerEffectsPillCountdownExtreme = lazy(() =>
  import('./TimerEffectsPillCountdownExtreme').then((m) => ({
    default: m.TimerEffectsPillCountdownExtreme,
  }))
)
const TimerEffectsPillCountdownGlitch = lazy(() =>
  import('./TimerEffectsPillCountdownGlitch').then((m) => ({
    default: m.TimerEffectsPillCountdownGlitch,
  }))
)
const TimerEffectsPillCountdownHeartbeat = lazy(() =>
  import('./TimerEffectsPillCountdownHeartbeat').then((m) => ({
    default: m.TimerEffectsPillCountdownHeartbeat,
  }))
)

export { TimerEffectsPillCountdownExtreme } from './TimerEffectsPillCountdownExtreme'
export { TimerEffectsPillCountdownGlitch } from './TimerEffectsPillCountdownGlitch'
export { TimerEffectsPillCountdownHeartbeat } from './TimerEffectsPillCountdownHeartbeat'
export { TimerEffectsPillCountdownStrong } from './TimerEffectsPillCountdownStrong'
export { TimerEffectsTimerColorShift } from './TimerEffectsTimerColorShift'
export { TimerEffectsTimerFlash } from './TimerEffectsTimerFlash'
export { TimerEffectsTimerFlashSoft } from './TimerEffectsTimerFlashSoft'
export { TimerEffectsTimerFlip } from './TimerEffectsTimerFlip'
export { TimerEffectsTimerPulse } from './TimerEffectsTimerPulse'

export const realtimeTimerEffectsAnimations: AnimationComponentMap = {
  'timer-effects__timer-color-shift': TimerEffectsTimerColorShift,
  'timer-effects__timer-flash': TimerEffectsTimerFlash,
  'timer-effects__timer-flash-soft': TimerEffectsTimerFlashSoft,
  'timer-effects__timer-flip': TimerEffectsTimerFlip,
  'timer-effects__timer-pulse': TimerEffectsTimerPulse,
  'timer-effects__pill-countdown-strong': TimerEffectsPillCountdownStrong,
  'timer-effects__pill-countdown-extreme': TimerEffectsPillCountdownExtreme,
  'timer-effects__pill-countdown-glitch': TimerEffectsPillCountdownGlitch,
  'timer-effects__pill-countdown-heartbeat': TimerEffectsPillCountdownHeartbeat,
}
