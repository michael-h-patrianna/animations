import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Lazy-loaded variants to enable code-splitting per animation component
const TimerEffectsTimerColorShift = lazy(() =>
  import('./framer/TimerEffectsTimerColorShift').then((m) => ({ default: m.TimerEffectsTimerColorShift }))
)
const TimerEffectsTimerFlash = lazy(() =>
  import('./framer/TimerEffectsTimerFlash').then((m) => ({ default: m.TimerEffectsTimerFlash }))
)
const TimerEffectsTimerFlashSoft = lazy(() =>
  import('./framer/TimerEffectsTimerFlashSoft').then((m) => ({ default: m.TimerEffectsTimerFlashSoft }))
)
const TimerEffectsTimerFlip = lazy(() =>
  import('./framer/TimerEffectsTimerFlip').then((m) => ({ default: m.TimerEffectsTimerFlip }))
)
const TimerEffectsTimerPulse = lazy(() =>
  import('./framer/TimerEffectsTimerPulse').then((m) => ({ default: m.TimerEffectsTimerPulse }))
)

// New pill countdown family (escalating intensity)
const TimerEffectsPillCountdownStrong = lazy(() =>
  import('./framer/TimerEffectsPillCountdownStrong').then((m) => ({
    default: m.TimerEffectsPillCountdownStrong,
  }))
)
const TimerEffectsPillCountdownExtreme = lazy(() =>
  import('./framer/TimerEffectsPillCountdownExtreme').then((m) => ({
    default: m.TimerEffectsPillCountdownExtreme,
  }))
)
const TimerEffectsPillCountdownGlitch = lazy(() =>
  import('./framer/TimerEffectsPillCountdownGlitch').then((m) => ({
    default: m.TimerEffectsPillCountdownGlitch,
  }))
)
const TimerEffectsPillCountdownHeartbeat = lazy(() =>
  import('./framer/TimerEffectsPillCountdownHeartbeat').then((m) => ({
    default: m.TimerEffectsPillCountdownHeartbeat,
  }))
)

// Import metadata directly (not lazy-loaded since metadata is needed immediately)
import { timerEffectsPillCountdownExtremeMetadata } from './framer/TimerEffectsPillCountdownExtreme.metadata'
import { timerEffectsPillCountdownGlitchMetadata } from './framer/TimerEffectsPillCountdownGlitch.metadata'
import { timerEffectsPillCountdownHeartbeatMetadata } from './framer/TimerEffectsPillCountdownHeartbeat.metadata'
import { timerEffectsPillCountdownStrongMetadata } from './framer/TimerEffectsPillCountdownStrong.metadata'
import { timerEffectsTimerColorShiftMetadata } from './framer/TimerEffectsTimerColorShift.metadata'
import { timerEffectsTimerFlashMetadata } from './framer/TimerEffectsTimerFlash.metadata'
import { timerEffectsTimerFlashSoftMetadata } from './framer/TimerEffectsTimerFlashSoft.metadata'
import { timerEffectsTimerFlipMetadata } from './framer/TimerEffectsTimerFlip.metadata'
import { timerEffectsTimerPulseMetadata } from './framer/TimerEffectsTimerPulse.metadata'

export const groupMetadata: GroupMetadata = {
  id: 'timer-effects',
  title: 'Timer effects',
  tech: 'framer',
  demo: 'timer',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
    'timer-effects__timer-color-shift': {
      component: TimerEffectsTimerColorShift,
      metadata: timerEffectsTimerColorShiftMetadata,
    },
    'timer-effects__timer-pulse': {
      component: TimerEffectsTimerPulse,
      metadata: timerEffectsTimerPulseMetadata,
    },
    'timer-effects__timer-flash': {
      component: TimerEffectsTimerFlash,
      metadata: timerEffectsTimerFlashMetadata,
    },
    'timer-effects__timer-flash-soft': {
      component: TimerEffectsTimerFlashSoft,
      metadata: timerEffectsTimerFlashSoftMetadata,
    },
    'timer-effects__timer-flip': {
      component: TimerEffectsTimerFlip,
      metadata: timerEffectsTimerFlipMetadata,
    },
    'timer-effects__pill-countdown-strong': {
      component: TimerEffectsPillCountdownStrong,
      metadata: timerEffectsPillCountdownStrongMetadata,
    },
    'timer-effects__pill-countdown-extreme': {
      component: TimerEffectsPillCountdownExtreme,
      metadata: timerEffectsPillCountdownExtremeMetadata,
    },
    'timer-effects__pill-countdown-glitch': {
      component: TimerEffectsPillCountdownGlitch,
      metadata: timerEffectsPillCountdownGlitchMetadata,
    },
    'timer-effects__pill-countdown-heartbeat': {
      component: TimerEffectsPillCountdownHeartbeat,
      metadata: timerEffectsPillCountdownHeartbeatMetadata,
    },
  },
}
