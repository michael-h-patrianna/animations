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
const TimerEffectsPillCountdownMedium = lazy(() =>
  import('./framer/TimerEffectsPillCountdownMedium').then((m) => ({
    default: m.TimerEffectsPillCountdownMedium,
  }))
)
const TimerEffectsPillCountdownSoft = lazy(() =>
  import('./framer/TimerEffectsPillCountdownSoft').then((m) => ({
    default: m.TimerEffectsPillCountdownSoft,
  }))
)

// Import metadata directly (not lazy-loaded since metadata is needed immediately)
import { timerEffectsPillCountdownExtremeMetadata } from './framer/TimerEffectsPillCountdownExtreme.metadata'
import { timerEffectsPillCountdownGlitchMetadata } from './framer/TimerEffectsPillCountdownGlitch.metadata'
import { timerEffectsPillCountdownHeartbeatMetadata } from './framer/TimerEffectsPillCountdownHeartbeat.metadata'
import { timerEffectsPillCountdownMediumMetadata } from './framer/TimerEffectsPillCountdownMedium.metadata'
import { timerEffectsPillCountdownSoftMetadata } from './framer/TimerEffectsPillCountdownSoft.metadata'
import { timerEffectsPillCountdownStrongMetadata } from './framer/TimerEffectsPillCountdownStrong.metadata'
import { timerEffectsTimerColorShiftMetadata } from './framer/TimerEffectsTimerColorShift.metadata'
import { timerEffectsTimerFlashMetadata } from './framer/TimerEffectsTimerFlash.metadata'
import { timerEffectsTimerFlashSoftMetadata } from './framer/TimerEffectsTimerFlashSoft.metadata'
import { timerEffectsTimerFlipMetadata } from './framer/TimerEffectsTimerFlip.metadata'
import { timerEffectsTimerPulseMetadata } from './framer/TimerEffectsTimerPulse.metadata'

// CSS animations
import {
  TimerEffectsTimerColorShift as CssTimerEffectsTimerColorShift,
  metadata as timerColorShiftCssMetadata,
} from './css/TimerEffectsTimerColorShift'
import {
  TimerEffectsTimerFlash as CssTimerEffectsTimerFlash,
  metadata as timerFlashCssMetadata,
} from './css/TimerEffectsTimerFlash'
import {
  TimerEffectsTimerFlashSoft as CssTimerEffectsTimerFlashSoft,
  metadata as timerFlashSoftCssMetadata,
} from './css/TimerEffectsTimerFlashSoft'
import {
  TimerEffectsTimerFlip as CssTimerEffectsTimerFlip,
  metadata as timerFlipCssMetadata,
} from './css/TimerEffectsTimerFlip'
import {
  TimerEffectsTimerPulse as CssTimerEffectsTimerPulse,
  metadata as timerPulseCssMetadata,
} from './css/TimerEffectsTimerPulse'
import {
  TimerEffectsPillCountdownStrong as CssTimerEffectsPillCountdownStrong,
  metadata as pillCountdownStrongCssMetadata,
} from './css/TimerEffectsPillCountdownStrong'
import {
  TimerEffectsPillCountdownExtreme as CssTimerEffectsPillCountdownExtreme,
  metadata as pillCountdownExtremeCssMetadata,
} from './css/TimerEffectsPillCountdownExtreme'
import {
  TimerEffectsPillCountdownGlitch as CssTimerEffectsPillCountdownGlitch,
  metadata as pillCountdownGlitchCssMetadata,
} from './css/TimerEffectsPillCountdownGlitch'
import {
  TimerEffectsPillCountdownHeartbeat as CssTimerEffectsPillCountdownHeartbeat,
  metadata as pillCountdownHeartbeatCssMetadata,
} from './css/TimerEffectsPillCountdownHeartbeat'
import {
  TimerEffectsPillCountdownMedium as CssTimerEffectsPillCountdownMedium,
  metadata as pillCountdownMediumCssMetadata,
} from './css/TimerEffectsPillCountdownMedium'
import {
  TimerEffectsPillCountdownSoft as CssTimerEffectsPillCountdownSoft,
  metadata as pillCountdownSoftCssMetadata,
} from './css/TimerEffectsPillCountdownSoft'

export const groupMetadata: GroupMetadata = {
  id: 'timer-effects',
  title: 'Timer effects',
  tech: 'framer',
  demo: 'timer',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
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
    'timer-effects__pill-countdown-soft': {
      component: TimerEffectsPillCountdownSoft,
      metadata: timerEffectsPillCountdownSoftMetadata,
    },
    'timer-effects__pill-countdown-medium': {
      component: TimerEffectsPillCountdownMedium,
      metadata: timerEffectsPillCountdownMediumMetadata,
    },
  },
  css: {
    'timer-effects__timer-color-shift': {
      component: CssTimerEffectsTimerColorShift,
      metadata: timerColorShiftCssMetadata,
    },
    'timer-effects__timer-pulse': {
      component: CssTimerEffectsTimerPulse,
      metadata: timerPulseCssMetadata,
    },
    'timer-effects__timer-flash': {
      component: CssTimerEffectsTimerFlash,
      metadata: timerFlashCssMetadata,
    },
    'timer-effects__timer-flash-soft': {
      component: CssTimerEffectsTimerFlashSoft,
      metadata: timerFlashSoftCssMetadata,
    },
    'timer-effects__timer-flip': {
      component: CssTimerEffectsTimerFlip,
      metadata: timerFlipCssMetadata,
    },
    'timer-effects__pill-countdown-soft': {
      component: CssTimerEffectsPillCountdownSoft,
      metadata: pillCountdownSoftCssMetadata,
    },
    'timer-effects__pill-countdown-medium': {
      component: CssTimerEffectsPillCountdownMedium,
      metadata: pillCountdownMediumCssMetadata,
    },
    'timer-effects__pill-countdown-strong': {
      component: CssTimerEffectsPillCountdownStrong,
      metadata: pillCountdownStrongCssMetadata,
    },
    'timer-effects__pill-countdown-extreme': {
      component: CssTimerEffectsPillCountdownExtreme,
      metadata: pillCountdownExtremeCssMetadata,
    },
    'timer-effects__pill-countdown-glitch': {
      component: CssTimerEffectsPillCountdownGlitch,
      metadata: pillCountdownGlitchCssMetadata,
    },
    'timer-effects__pill-countdown-heartbeat': {
      component: CssTimerEffectsPillCountdownHeartbeat,
      metadata: pillCountdownHeartbeatCssMetadata,
    },
  },
}
