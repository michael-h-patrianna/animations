import type { GroupMetadata, GroupExport } from '@/types/animation'
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

// Import metadata directly (not lazy-loaded since metadata is needed immediately)
import { timerEffectsTimerColorShiftMetadata } from './TimerEffectsTimerColorShift.metadata'
import { timerEffectsTimerFlashMetadata } from './TimerEffectsTimerFlash.metadata'
import { timerEffectsTimerFlashSoftMetadata } from './TimerEffectsTimerFlashSoft.metadata'
import { timerEffectsTimerFlipMetadata } from './TimerEffectsTimerFlip.metadata'
import { timerEffectsTimerPulseMetadata } from './TimerEffectsTimerPulse.metadata'
import { timerEffectsPillCountdownStrongMetadata } from './TimerEffectsPillCountdownStrong.metadata'
import { timerEffectsPillCountdownExtremeMetadata } from './TimerEffectsPillCountdownExtreme.metadata'
import { timerEffectsPillCountdownGlitchMetadata } from './TimerEffectsPillCountdownGlitch.metadata'
import { timerEffectsPillCountdownHeartbeatMetadata } from './TimerEffectsPillCountdownHeartbeat.metadata'

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
      metadata: timerEffectsTimerColorShiftMetadata
    },
    'timer-effects__timer-pulse': {
      component: TimerEffectsTimerPulse,
      metadata: timerEffectsTimerPulseMetadata
    },
    'timer-effects__timer-flash': {
      component: TimerEffectsTimerFlash,
      metadata: timerEffectsTimerFlashMetadata
    },
    'timer-effects__timer-flash-soft': {
      component: TimerEffectsTimerFlashSoft,
      metadata: timerEffectsTimerFlashSoftMetadata
    },
    'timer-effects__timer-flip': {
      component: TimerEffectsTimerFlip,
      metadata: timerEffectsTimerFlipMetadata
    },
    'timer-effects__pill-countdown-strong': {
      component: TimerEffectsPillCountdownStrong,
      metadata: timerEffectsPillCountdownStrongMetadata
    },
    'timer-effects__pill-countdown-extreme': {
      component: TimerEffectsPillCountdownExtreme,
      metadata: timerEffectsPillCountdownExtremeMetadata
    },
    'timer-effects__pill-countdown-glitch': {
      component: TimerEffectsPillCountdownGlitch,
      metadata: timerEffectsPillCountdownGlitchMetadata
    },
    'timer-effects__pill-countdown-heartbeat': {
      component: TimerEffectsPillCountdownHeartbeat,
      metadata: timerEffectsPillCountdownHeartbeatMetadata
    }
  }
}

